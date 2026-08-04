import {
  hasServiceRoleKey,
  resetTestUser,
} from '@/lib/supabase/test-reset';
import { createServerClient } from '@supabase/ssr';
import { TRIAL_COOKIE } from '@/lib/trial';
import { CHAT_PATH } from '@/lib/trial-gate';
import { NextResponse, type NextRequest } from 'next/server';

const TEST_EMAIL = 'alwho@fastmail.com';

function createSupabaseFromRequest(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Cookie refresh handled on /dev/reset page when needed.
        },
      },
    }
  );
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return new Response('Forbidden', { status: 403 });
  }

  const origin = new URL(request.url).origin;

  if (!hasServiceRoleKey()) {
    return NextResponse.redirect(`${origin}/dev/reset`);
  }

  try {
    const supabase = createSupabaseFromRequest(request);
    await resetTestUser(TEST_EMAIL, supabase);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Reset failed';
    return NextResponse.redirect(
      `${origin}/dev/reset?error=${encodeURIComponent(message)}`
    );
  }

  const response = NextResponse.redirect(`${origin}${CHAT_PATH}`);
  response.cookies.set(TRIAL_COOKIE, new Date().toISOString(), {
    path: '/',
    maxAge: 60 * 60 * 2,
    httpOnly: true,
    sameSite: 'lax',
  });

  return response;
}
