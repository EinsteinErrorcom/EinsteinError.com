import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseEnv } from '@/lib/supabase/env'
import {
  fetchProfileTrial,
  PRICING_PATH,
  shouldRedirectToPricing,
} from '@/lib/trial-gate'
import {
  isTrialExpired,
  parseTrialStartedAt,
  TRIAL_COOKIE,
  TRIAL_DURATION_MS,
} from '@/lib/trial'

const TRIAL_EXEMPT_PATHS = new Set(['/', '/pricing', '/trial-expired', '/dev/reset'])

function isDevPath(pathname: string) {
  return pathname.startsWith('/dev/')
}

function isTrialExemptPath(pathname: string) {
  return (
    TRIAL_EXEMPT_PATHS.has(pathname) ||
    pathname.startsWith('/pricing') ||
    isDevPath(pathname) ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/')
  )
}

function redirectWithCookies(
  url: URL,
  supabaseResponse: NextResponse
) {
  const redirectResponse = NextResponse.redirect(url)
  supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
    redirectResponse.cookies.set(name, value)
  })
  return redirectResponse
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseEnv = getSupabaseEnv()
  const supabaseUrl = supabaseEnv?.supabaseUrl ?? process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseAnonKey = supabaseEnv?.supabaseAnonKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  if (user) {
    const profile = await fetchProfileTrial(supabase, user.id)
    const trialExpired = shouldRedirectToPricing(profile)

    if (
      trialExpired &&
      (pathname === '/FREETrialApproved' || pathname === '/chat') &&
      !request.nextUrl.searchParams.get('auth')
    ) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = PRICING_PATH
      redirectUrl.search = ''
      return redirectWithCookies(redirectUrl, supabaseResponse)
    }

    if (
      !trialExpired &&
      pathname === '/' &&
      !request.nextUrl.searchParams.get('auth')
    ) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/FREETrialApproved'
      redirectUrl.search = ''
      return redirectWithCookies(redirectUrl, supabaseResponse)
    }
  }

  if (user && !isTrialExemptPath(pathname)) {
    const trialStartedAt = parseTrialStartedAt(
      request.cookies.get(TRIAL_COOKIE)?.value
    )

    if (trialStartedAt && isTrialExpired(trialStartedAt)) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = PRICING_PATH
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
