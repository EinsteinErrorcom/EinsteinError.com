import { createTrialStartCookie } from '@/lib/supabase/middleware';
import { getSiteOrigin } from '@/lib/site-url';
import {
  fetchProfileTrial,
  PRICING_PATH,
  shouldRedirectToPricing,
} from '@/lib/trial-gate';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

const APPROVED_PATH = '/FREETrialApproved';

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(`${getSiteOrigin(request)}${path}`);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const oauthError = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const siteOrigin = getSiteOrigin(request);

  if (oauthError) {
    const reason = errorDescription || oauthError;
    return NextResponse.redirect(
      `${siteOrigin}/?auth=error&reason=${encodeURIComponent(reason)}`
    );
  }

  if (!code) {
    return redirectTo(request, '/?auth=error');
  }

  const cookieStore = await cookies();
  const pendingCookies: { name: string; value: string; options: Parameters<typeof cookieStore.set>[2] }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            pendingCookies.push({ name, value, options });
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${siteOrigin}/?auth=error&reason=${encodeURIComponent(error.message)}`
    );
  }

  let destination = APPROVED_PATH;
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, trial_start_at')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingProfile) {
      const trialStartAt = new Date().toISOString();
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        trial_start_at: trialStartAt,
        is_subscribed: false,
      });

      if (profileError) {
        return NextResponse.redirect(
          `${siteOrigin}/?auth=error&reason=${encodeURIComponent('Could not create profile')}`
        );
      }

      const trialCookie = createTrialStartCookie(trialStartAt);
      pendingCookies.push({
        name: trialCookie.name,
        value: trialCookie.value,
        options: trialCookie.options,
      });
    }

    const profile = await fetchProfileTrial(supabase, user.id);
    if (shouldRedirectToPricing(profile)) {
      destination = PRICING_PATH;
    }
  }

  const response = NextResponse.redirect(`${siteOrigin}${destination}`);
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
