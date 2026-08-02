"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv, SUPABASE_CONFIG_ERROR } from "@/lib/supabase/env";

type GoogleLoginButtonProps = {
  initialError?: string;
};

function getOAuthErrorFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error") || params.get("error_description");
  return error ? decodeURIComponent(error.replace(/\+/g, " ")) : null;
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
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        throw authError;
      }
    } catch (err: any) {
      setError(err.message || "Google sign-in failed. Please try again.");
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
      >
        {isLoading ? "Connecting to Google..." : "Continue with Google"}
      </button>
      {error && <p style={{ color: "#FF6B6B", fontWeight: "bold", marginTop: "16px" }}>{error}</p>}
    </div>
  );
}