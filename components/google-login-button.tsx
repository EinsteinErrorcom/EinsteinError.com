"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv, SUPABASE_CONFIG_ERROR } from "@/lib/supabase/env";

type GoogleLoginButtonProps = {
  initialError?: string;
};

const OAUTH_EXCHANGE_ERROR =
  "Google sign-in failed while connecting to Supabase. In Supabase Dashboard → Authentication → Providers → Google, confirm the Client ID and Client Secret match your Google Cloud OAuth app. In Google Cloud, the authorized redirect URI must be https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback (replace YOUR_PROJECT_REF with your Supabase project ref).";

function getOAuthErrorFromUrl(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const readParams = (params: URLSearchParams) => {
    const error = params.get("error");
    const errorCode = params.get("error_code");
    const errorDescription = params.get("error_description");

    if (!error && !errorCode && !errorDescription) {
      return null;
    }

    if (
      errorDescription?.includes("Unable to exchange external code") ||
      errorCode === "unexpected_failure"
    ) {
      return OAUTH_EXCHANGE_ERROR;
    }

    return (
      errorDescription?.replace(/\+/g, " ") ||
      error ||
      "Google sign-in could not be completed. Please try again."
    );
  };

  const queryError = readParams(new URLSearchParams(window.location.search));
  if (queryError) {
    return queryError;
  }

  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;

  return readParams(new URLSearchParams(hash));
}

function getAuthCallbackUrl() {
  const nextPath = "/page2";
  const callbackPath = `/auth/callback?next=${encodeURIComponent(nextPath)}`;

  // Always use the domain the user is actually on — never a stale SITE_URL.
  if (typeof window !== "undefined") {
    return `${window.location.origin}${callbackPath}`;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (siteUrl) {
    return `${siteUrl}${callbackPath}`;
  }

  return callbackPath;
}

export function GoogleLoginButton({ initialError }: GoogleLoginButtonProps) {
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const oauthError = getOAuthErrorFromUrl();
    if (oauthError) {
      setError(oauthError);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  async function handleGoogleLogin() {
    setError(null);
    setIsLoading(true);

    try {
      if (!getSupabaseEnv()) {
        setError(SUPABASE_CONFIG_ERROR);
        return;
      }

      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getAuthCallbackUrl(),
          skipBrowserRedirect: true,
        },
      });

      if (authError) {
        setError(
          authError.message ||
            "Google sign-in failed. Please try again in a moment."
        );
        return;
      }

      if (!data.url) {
        setError("Google sign-in could not be started. Please try again.");
        return;
      }

      window.location.assign(data.url);
    } catch {
      setError(
        "Something went wrong while connecting to Google. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        id="google-login-btn"
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? "Connecting to Google..." : "Continue with Google"}
      </button>
      {error ? (
        <p
          id="google-login-error"
          role="alert"
          style={{
            color: "#FF6B6B",
            fontWeight: "bold",
            fontSize: "18px",
            marginTop: "16px",
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
