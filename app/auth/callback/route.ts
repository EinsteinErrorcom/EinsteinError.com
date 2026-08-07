import { createTrialStartCookie } from '@/lib/supabase/middleware';
import { applyPendingCookies, createRouteHandlerClient, type PendingAuthCookie } from '@/lib/supabase/route-handler';
import { getSiteOrigin } from '@/lib/site-url';
import {
  buildAuthErrorPath,
  buildChatPathWithCheckoutSession,
  CHECKOUT_SESSION_QUERY,
  fetchProfileTrial,
  shouldRedirectToPricing,
  TRIAL_EXPIRED_PATH,
  CHAT_PATH,
} from '@/lib/trial-gate';
import { NextResponse, type NextRequest } from 'next/server';

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(`${getSiteOrigin(request)}${path}`);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const oauthError = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const checkoutSessionId =
    requestUrl.searchParams.get(CHECKOUT_SESSION_QUERY)?.trim() || null;
  const siteOrigin = getSiteOrigin(request);

  if (oauthError) {
    const reason = errorDescription || oauthError;
    return NextResponse.redirect(
      `${siteOrigin}${buildAuthErrorPath(reason, checkoutSessionId)}`
    );
  }

  if (!code) {
    return redirectTo(
      request,
      buildAuthErrorPath('Missing OAuth code', checkoutSessionId)
    );
  }

  const pendingCookies: PendingAuthCookie[] = [];
  const routeClient = createRouteHandlerClient(request, pendingCookies);

  if (!routeClient) {
    return NextResponse.redirect(
      `${siteOrigin}${buildAuthErrorPath('Sign-in is not configured', checkoutSessionId)}`
    );
  }

  const { error } = await routeClient.supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${siteOrigin}${buildAuthErrorPath(error.message, checkoutSessionId)}`
    );
  }

  let destination = CHAT_PATH;
  const { data: { user } } = await routeClient.supabase.auth.getUser();

  if (user) {
    const { data: existingProfile } = await routeClient.supabase
      .from('profiles')
      .select('id, trial_start_at')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingProfile) {
      const trialStartAt = new Date().toISOString();
      const { error: profileError } = await routeClient.supabase.from('profiles').insert({
        id: user.id,
        trial_start_at: trialStartAt,
        is_subscribed: false,
        access_tier: 'trial',
      });

      if (profileError) {
        return NextResponse.redirect(
          `${siteOrigin}${buildAuthErrorPath('Could not create profile', checkoutSessionId)}`
        );
      }

      const trialCookie = createTrialStartCookie(trialStartAt);
      pendingCookies.push({
        name: trialCookie.name,
        value: trialCookie.value,
        options: trialCookie.options,
      });
    }

    if (checkoutSessionId) {
      destination = buildChatPathWithCheckoutSession(checkoutSessionId);
    } else {
      const profile = await fetchProfileTrial(routeClient.supabase, user.id);
      if (shouldRedirectToPricing(profile)) {
        destination = TRIAL_EXPIRED_PATH;
      }
    }
  }

  const response = NextResponse.redirect(`${siteOrigin}${destination}`);
  applyPendingCookies(response, pendingCookies);
  return response;
}
