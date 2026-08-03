import type { SupabaseClient } from '@supabase/supabase-js';
import { isProfileTrialActive, type ProfileTrial } from './trial';

export const PRICING_PATH = '/pricing';

export function shouldRedirectToPricing(
  profile: ProfileTrial | null | undefined
): boolean {
  if (!profile) {
    return false;
  }

  return !isProfileTrialActive(profile);
}

export async function fetchProfileTrial(
  supabase: SupabaseClient,
  userId: string
): Promise<ProfileTrial | null> {
  const { data } = await supabase
    .from('profiles')
    .select('trial_start_at, is_subscribed')
    .eq('id', userId)
    .maybeSingle();

  return data ?? null;
}
