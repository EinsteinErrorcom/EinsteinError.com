import { getSupabaseEnv } from '@/lib/supabase/env';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export type PendingAuthCookie = {
  name: string;
  value: string;
  options: Parameters<NextResponse['cookies']['set']>[2];
};

export function createRouteHandlerClient(
  request: NextRequest,
  pendingCookies: PendingAuthCookie[]
) {
  const supabaseEnv = getSupabaseEnv();
  if (!supabaseEnv) {
    return null;
  }

  const response = NextResponse.next({ request });

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
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
            pendingCookies.push({ name, value, options });
          });
        },
      },
    }
  );

  return { supabase, response };
}

export function applyPendingCookies(
  target: NextResponse,
  pendingCookies: PendingAuthCookie[]
) {
  pendingCookies.forEach(({ name, value, options }) => {
    target.cookies.set(name, value, options);
  });
}
