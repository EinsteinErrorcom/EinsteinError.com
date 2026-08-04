import { createServerClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getSupabaseEnv, SUPABASE_CONFIG_ERROR } from '@/lib/supabase/env'

export async function createClient() {
  const supabaseEnv = getSupabaseEnv()
  if (!supabaseEnv) {
    throw new Error(SUPABASE_CONFIG_ERROR)
  }

  const cookieStore = await cookies()

  return createServerClient(
    supabaseEnv.supabaseUrl,
    supabaseEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if the proxy is refreshing user sessions.
          }
        },
      },
    }
  )
}

export async function resolveUserId(accessToken?: string | null): Promise<string | null> {
  const supabase = await createClient()

  if (accessToken) {
    const { data: { user } } = await supabase.auth.getUser(accessToken)
    if (user) {
      return user.id
    }
  }

  const { data: claimsData } = await supabase.auth.getClaims()
  if (claimsData?.claims?.sub) {
    return claimsData.claims.sub
  }

  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    return session.user.id
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    return user.id
  }

  return null
}

export async function getAuthenticatedUser(
  req: Request,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<User | null> {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
  if (token) {
    const { data: { user: tokenUser } } = await supabase.auth.getUser(token)
    if (tokenUser) {
      return tokenUser
    }
  }

  const userId = await resolveUserId()
  if (!userId) {
    return null
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    return user
  }

  if (token) {
    const { data: { user: tokenUser } } = await supabase.auth.getUser(token)
    return tokenUser ?? null
  }

  return null
}
