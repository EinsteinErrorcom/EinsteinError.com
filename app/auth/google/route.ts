import { applyPendingCookies, createRouteHandlerClient, type PendingAuthCookie } from '@/lib/supabase/route-handler';
import { getSiteOrigin } from '@/lib/site-url';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const siteOrigin = getSiteOrigin(request);
  const pendingCookies: PendingAuthCookie[] = [];
  const routeClient = createRouteHandlerClient(request, pendingCookies);

  if (!routeClient) {
    return NextResponse.redirect(
      `${siteOrigin}/?auth=error&reason=${encodeURIComponent('Sign-in is not configured')}`
    );
  }

  const redirectTo = `${siteOrigin}/auth/callback`;
  const { data, error } = await routeClient.supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });

  if (error || !data.url) {
    return NextResponse.redirect(
      `${siteOrigin}/?auth=error&reason=${encodeURIComponent(error?.message ?? 'OAuth failed')}`
    );
  }

  const response = NextResponse.redirect(data.url);
  applyPendingCookies(response, pendingCookies);
  return response;
}
