"use client";

import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv, SUPABASE_CONFIG_ERROR } from "@/lib/supabase/env";
import { CHAT_PATH } from "@/lib/trial-gate";
import type { SupabaseClient } from "@supabase/supabase-js";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

type GoogleLoginButtonProps = {
  googleClientId?: string | null;
  initialError?: string | null;
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

function isMobileDevice() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function GoogleButtonLabel({ loading }: { loading?: boolean }) {
  if (loading) {
    return <>Signing you in...</>;
  }

  return (
    <>
      Click HERE To Log In
      <br />
      To Your Google Account
    </>
  );
}

function GoogleLogo() {
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
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
}: GoogleLoginButtonProps) {
  const clientId = googleClientId?.trim() || EXPECTED_CLIENT_ID;
  const [loginError, setLoginError] = useState<string | null>(initialError);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonReady, setButtonReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const handleCredentialRef = useRef<(response: CredentialResponse) => void>(() => {});

  useEffect(() => {
    setIsMobile(isMobileDevice());
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
      window.location.assign(CHAT_PATH);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Google sign-in failed.";
      console.error("Google sign-in failed:", err);
      setLoginError(message);
      setIsLoading(false);
    }
  }, []);

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
          width: overlayRef.current.offsetWidth || 400,
        });

        initializedRef.current = true;

        const markReady = () => {
          if (overlayRef.current?.querySelector("iframe")) {
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
  }, [clientId]);

  const isInteractive = buttonReady && !isLoading;

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />

      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            position: "relative",
            width: "104%",
            margin: "0 auto",
            minHeight: isMobile ? "48px" : "88px",
          }}
        >
          {!isMobile && (
            <button
              id="google-login-btn"
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              disabled={!isInteractive}
              style={{ pointerEvents: "none", width: "100%" }}
            >
              <span className="google-login-btn__logo google-login-btn__logo--spacer" aria-hidden="true">
                <GoogleLogo />
              </span>
              <span className="google-login-btn__text">
                <GoogleButtonLabel loading={!isInteractive} />
              </span>
              <span className="google-login-btn__logo">
                <GoogleLogo />
              </span>
            </button>
          )}

          <div
            ref={overlayRef}
            aria-label="Sign in with Google"
            style={
              isMobile
                ? {
                    minHeight: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isInteractive ? 1 : 0.5,
                    pointerEvents: isInteractive ? "auto" : "none",
                  }
                : {
                    position: "absolute",
                    inset: 0,
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    opacity: isInteractive ? 0.02 : 0,
                    pointerEvents: isInteractive ? "auto" : "none",
                    cursor: isInteractive ? "pointer" : "default",
                  }
            }
          />

          {isMobile && !isInteractive && (
            <p style={{ color: "#00FFFF", fontSize: "16px", marginTop: "12px" }}>
              Loading Google sign-in...
            </p>
          )}
        </div>

        {loginError && (
          <p style={{ color: "#FF6B6B", fontSize: "16px", marginTop: "16px", lineHeight: 1.5 }}>
            {loginError}
          </p>
        )}
      </div>
    </>
  );
}
