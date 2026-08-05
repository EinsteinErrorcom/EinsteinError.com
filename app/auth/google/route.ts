import { getSupabaseEnv } from '@/lib/supabase/env';
import { getSiteOrigin } from '@/lib/site-url';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const siteOrigin = getSiteOrigin(request);
  const supabaseEnv = getSupabaseEnv();

  if (!supabaseEnv) {
    return NextResponse.redirect(
      `${siteOrigin}/?auth=error&reason=${encodeURIComponent('Sign-in is not configured')}`
    );
  }

  const cookieStore = await cookies();
  const pendingCookies: {
    name: string;
    value: string;
    options: Parameters<typeof cookieStore.set>[2];
  }[] = [];

  const supabase = createServerClient(
    supabaseEnv.supabaseUrl,
    supabaseEnv.supabaseAnonKey,
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

  const redirectTo = `${siteOrigin}/auth/callback`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });

  if (error || !data.url) {
    return NextResponse.redirect(
      `${siteOrigin}/?auth=error&reason=${encodeURIComponent(error?.message ?? 'OAuth failed')}`
    );
  }

  const response = NextResponse.redirect(data.url);
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
