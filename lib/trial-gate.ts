import type { SupabaseClient } from '@supabase/supabase-js';
import { isProfileTrialActive, type ProfileTrial } from './trial';

/** Site page routes (12-page structure) */
/** MAX-LIT Secure Checkout — 3 tiers ($15 / $75 / $400) — Page 10 */
export const CHECKOUT_PATH = '/checkout10';
export const CHECKOUT10_PATH = CHECKOUT_PATH;
/** @deprecated Use CHECKOUT_PATH — kept for trial-expired redirects */
export const PRICING_PATH = CHECKOUT_PATH;
export const CHAT8_PATH = '/maxchatbox8';
export const CHAT_PATH = '/maxchatbox8';
export const TRIAL_EXPIRED_PATH = '/trialexpired9';
export const TIME_EXPIRED_PATH = '/timeexpired11';
/** Page 12 — spare / reserved */
export const SPARE_PATH = '/spare12';

/** Landing page anchor — scrolls to the Google Sign-In block */
export const SIGN_IN_SECTION_ID = 'auth-section';
export const SIGN_IN_PATH = `/#${SIGN_IN_SECTION_ID}`;

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
