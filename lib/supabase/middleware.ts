import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseEnv } from '@/lib/supabase/env'
import {
  isTrialExpired,
  parseTrialStartedAt,
  TRIAL_COOKIE,
  TRIAL_DURATION_MS,
} from '@/lib/trial'

const TRIAL_EXEMPT_PATHS = new Set(['/', '/trial-expired'])

function isTrialExemptPath(pathname: string) {
  return (
    TRIAL_EXEMPT_PATHS.has(pathname) ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/_next/')
  )
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseEnv = getSupabaseEnv()
  if (!supabaseEnv) {
    // Allow pages to render when Supabase is not configured yet (e.g. on deploy).
    return supabaseResponse
  }

  const { supabaseUrl, supabaseAnonKey } = supabaseEnv

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const pathname = request.nextUrl.pathname

  if (data?.claims?.sub && !isTrialExemptPath(pathname)) {
    const trialStartedAt = parseTrialStartedAt(
      request.cookies.get(TRIAL_COOKIE)?.value
    )

    if (trialStartedAt && isTrialExpired(trialStartedAt)) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/trial-expired'
      redirectUrl.search = ''
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}

export function createTrialStartCookie(startedAt: string) {
  return {
    name: TRIAL_COOKIE,
    value: startedAt,
    options: {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      maxAge: Math.ceil(TRIAL_DURATION_MS / 1000),
      path: '/',
    },
  }
}
