import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createTrialStartCookie } from "@/lib/supabase/middleware";
import { TRIAL_COOKIE } from "@/lib/trial";

function getRedirectOrigin(request: Request, fallbackOrigin: string) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (process.env.NODE_ENV === "development") {
    return fallbackOrigin;
  }

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return fallbackOrigin;
}

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/page2";
  }

  return next;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeNextPath(requestUrl.searchParams.get("next"));
  const redirectOrigin = getRedirectOrigin(request, requestUrl.origin);
  const supabaseEnv = getSupabaseEnv();

  if (!code || !supabaseEnv) {
    return NextResponse.redirect(`${redirectOrigin}/?auth=error`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    supabaseEnv.supabaseUrl,
    supabaseEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error) {
    const existingTrial = cookieStore.get(TRIAL_COOKIE)?.value;
    const trialStart = existingTrial ?? new Date().toISOString();
    const response = NextResponse.redirect(`${redirectOrigin}${next}`);

    if (!existingTrial) {
      const trialCookie = createTrialStartCookie(trialStart);
      response.cookies.set(
        trialCookie.name,
        trialCookie.value,
        trialCookie.options
      );
    }

    return response;
  }

  return NextResponse.redirect(`${redirectOrigin}/?auth=error`);
}
