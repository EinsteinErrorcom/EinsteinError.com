"use client";

import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv, SUPABASE_CONFIG_ERROR } from "@/lib/supabase/env";
import { buildChatPathWithCheckoutSession, CHAT_PATH } from "@/lib/trial-gate";
import type { SupabaseClient } from "@supabase/supabase-js";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

type GoogleLoginButtonProps = {
  googleClientId?: string | null;
  initialError?: string | null;
  checkoutSessionId?: string | null;
};

type CredentialResponse = {
  credential: string;
};

const EXPECTED_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ||
  "495417569663-hvj538m26imrr1ee1igpoa9ve4f3lceh.apps.googleusercontent.com";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: string;
              theme?: string;
              size?: string;
              width?: number;
              text?: string;
              shape?: string;
            }
          ) => void;
        };
      };
    };
  }
}

function waitForGoogleIdentity(): Promise<void> {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      if (window.google?.accounts?.id) {
        window.clearInterval(timer);
        resolve();
        return;
      }

      if (Date.now() - startedAt > 10000) {
        window.clearInterval(timer);
        reject(new Error("Google sign-in script failed to load."));
      }
    }, 100);
  });
}

function audienceErrorHelp(): string {
  return (
    "Supabase rejected the Google token. In Supabase → Authentication → Providers → Google, " +
    "paste this exact ID into the Client IDs / Authorized Client IDs field: " +
    EXPECTED_CLIENT_ID
  );
}

async function waitForAccessToken(supabase: SupabaseClient): Promise<string> {
  for (let attempt = 0; attempt < 15; attempt += 1) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return session.access_token;
    }

    await new Promise((resolve) => {
      window.setTimeout(resolve, 100 * (attempt + 1));
    });
  }

  throw new Error(
    "Sign-in succeeded but your session was not established. Please try again."
  );
}

async function ensureProfileAfterSignIn(supabase: SupabaseClient): Promise<void> {
  const accessToken = await waitForAccessToken(supabase);

  for (let attempt = 0; attempt < 15; attempt += 1) {
    const response = await fetch("/api/auth/ensure-profile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return;
    }

    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    if (response.status !== 401 || attempt === 14) {
      throw new Error(body?.error ?? "Could not create profile");
    }

    await new Promise((resolve) => {
      window.setTimeout(resolve, 100 * (attempt + 1));
    });
  }
}

export function GoogleLoginButton({
  googleClientId,
  initialError = null,
  checkoutSessionId = null,
}: GoogleLoginButtonProps) {
  const clientId = googleClientId?.trim() || EXPECTED_CLIENT_ID;
  const [loginError, setLoginError] = useState<string | null>(initialError);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonReady, setButtonReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const handleCredentialRef = useRef<(response: CredentialResponse) => void>(() => {});

  const stretchGoogleButton = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) {
      return;
    }

    overlay.style.width = "100%";
    overlay.style.height = "100%";

    for (const node of overlay.querySelectorAll("div, iframe")) {
      if (!(node instanceof HTMLElement)) {
        continue;
      }

      node.style.setProperty("width", "100%", "important");
      node.style.setProperty("height", "100%", "important");
      node.style.setProperty("min-height", "100%", "important");
      node.style.setProperty("border", "none", "important");
      node.style.setProperty("margin", "0", "important");
    }
  }, []);

  const triggerGoogleSignIn = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) {
      return;
    }

    const clickTarget =
      overlay.querySelector('div[role="button"]') ??
      overlay.querySelector("iframe") ??
      overlay.firstElementChild;

    if (clickTarget instanceof HTMLElement) {
      clickTarget.click();
    }
  }, []);

  useEffect(() => {
    if (window.location.hash.includes("error=")) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`
      );
    }
  }, []);

  const handleCredential = useCallback(async (response: CredentialResponse) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      if (!getSupabaseEnv()) {
        throw new Error(SUPABASE_CONFIG_ERROR);
      }

      if (!response.credential) {
        throw new Error("Google did not return a sign-in token.");
      }

      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
      });

      if (signInError) {
        if (signInError.message.toLowerCase().includes("audience")) {
          throw new Error(audienceErrorHelp());
        }
        throw signInError;
      }

      await ensureProfileAfterSignIn(supabase);
      const destination = checkoutSessionId
        ? buildChatPathWithCheckoutSession(checkoutSessionId)
        : CHAT_PATH;
      window.location.assign(destination);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Google sign-in failed.";
      console.error("Google sign-in failed:", err);
      setLoginError(message);
      setIsLoading(false);
    }
  }, [checkoutSessionId]);

  useEffect(() => {
    handleCredentialRef.current = handleCredential;
  }, [handleCredential]);

  useEffect(() => {
    if (!overlayRef.current || initializedRef.current) {
      return;
    }

    let cancelled = false;
    let observer: MutationObserver | null = null;

    const mount = async () => {
      try {
        await waitForGoogleIdentity();
        if (cancelled || !overlayRef.current || initializedRef.current) {
          return;
        }

        overlayRef.current.innerHTML = "";

        window.google!.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => handleCredentialRef.current(response),
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false,
        });

        window.google!.accounts.id.renderButton(overlayRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: "continue_with",
          width: containerRef.current?.clientWidth || 700,
        });

        initializedRef.current = true;

        const markReady = () => {
          if (overlayRef.current?.querySelector("iframe")) {
            stretchGoogleButton();
            setButtonReady(true);
          }
        };

        observer = new MutationObserver(markReady);
        observer.observe(overlayRef.current, { childList: true, subtree: true });
        markReady();
        window.setTimeout(markReady, 500);
        window.setTimeout(markReady, 1500);
      } catch (err) {
        if (!cancelled) {
          setLoginError(
            err instanceof Error ? err.message : "Google sign-in failed to load."
          );
        }
      }
    };

    void mount();

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [clientId, stretchGoogleButton]);

  useEffect(() => {
    if (!buttonReady) {
      return;
    }

    stretchGoogleButton();
    const timer = window.setTimeout(stretchGoogleButton, 250);
    return () => window.clearTimeout(timer);
  }, [buttonReady, stretchGoogleButton]);

  const isInteractive = buttonReady && !isLoading;

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />

      <div style={{ marginTop: "20px" }}>
        <div
          ref={containerRef}
          role="button"
          tabIndex={isInteractive ? 0 : -1}
          aria-label="Sign in with Google to access MAX-LIT"
          onClick={() => {
            if (isInteractive) {
              triggerGoogleSignIn();
            }
          }}
          onKeyDown={(event) => {
            if (isInteractive && (event.key === "Enter" || event.key === " ")) {
              event.preventDefault();
              triggerGoogleSignIn();
            }
          }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "700px",
            margin: "0 auto",
            cursor: isInteractive ? "pointer" : "default",
          }}
        >
          <img
            src="/QCOMPUTER.png"
            alt=""
            aria-hidden="true"
            width={700}
            height={1000}
            style={{
              width: "100%",
              maxWidth: "700px",
              aspectRatio: "700 / 1000",
              height: "auto",
              display: "block",
              opacity: isInteractive ? 1 : 0.5,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />

          <div
            ref={overlayRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              overflow: "hidden",
              opacity: 0.01,
              pointerEvents: "none",
            }}
          />
        </div>

        {!isInteractive && (
          <p style={{ color: "#00FFFF", fontSize: "16px", marginTop: "12px" }}>
            {isLoading ? "Signing you in..." : "Loading sign-in..."}
          </p>
        )}

        {loginError && (
          <p style={{ color: "#FF6B6B", fontSize: "16px", marginTop: "16px", lineHeight: 1.5 }}>
            {loginError}
          </p>
        )}
      </div>
    </>
  );
}
