import { isAccessActive } from '@/lib/access';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ChatGatekeeperFailure = {
  ok: false;
  status: 401 | 403 | 404;
  error: string;
};

export type ChatGatekeeperSuccess = {
  ok: true;
  userId: string;
};

export type ChatGatekeeperResult = ChatGatekeeperFailure | ChatGatekeeperSuccess;

type ProfileRow = {
  trial_start_at: string | null;
  is_subscribed: boolean | null;
  access_tier: string | null;
};

async function loadOrCreateProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<ProfileRow | null> {
  const { data: existing } = await supabase
    .from('profiles')
    .select('trial_start_at, is_subscribed, access_tier')
    .eq('id', userId)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  const trialStartAt = new Date().toISOString();
  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      trial_start_at: trialStartAt,
      is_subscribed: false,
      access_tier: 'trial',
    })
    .select('trial_start_at, is_subscribed, access_tier')
    .single();

  if (insertError || !created) {
    return null;
  }

  return created;
}

export async function validateChatAccess(
  supabase: SupabaseClient,
  userId: string
): Promise<ChatGatekeeperFailure | null> {
  const profile = await loadOrCreateProfile(supabase, userId);

  if (!profile) {
    return { ok: false, status: 404, error: 'Profile not found' };
  }

  if (!isAccessActive(profile)) {
    return { ok: false, status: 403, error: 'Trial expired' };
  }

  return null;
}

export async function resolveAuthenticatedUserId(
  supabase: SupabaseClient,
  accessToken?: string | null
): Promise<string | null> {
  if (accessToken) {
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (user) {
      return user.id;
    }
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    return user.id;
  }

  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

export async function enforceChatGatekeeper(
  supabase: SupabaseClient,
  accessToken?: string | null
): Promise<ChatGatekeeperResult> {
  const userId = await resolveAuthenticatedUserId(supabase, accessToken);

  if (!userId) {
    return { ok: false, status: 401, error: 'Unauthorized' };
  }

  const accessFailure = await validateChatAccess(supabase, userId);
  if (accessFailure) {
    return accessFailure;
  }

  return { ok: true, userId };
}
