'use server';

import { createTrialStartCookie } from '@/lib/supabase/middleware';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function ensureUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('id, trial_start_at')
    .eq('id', user.id)
    .maybeSingle();

  if (existing) {
    return { ok: true };
  }

  const trialStartAt = new Date().toISOString();
  const { error } = await supabase.from('profiles').insert({
    id: user.id,
    trial_start_at: trialStartAt,
    is_subscribed: false,
  });

  if (error) {
    return { error: 'Could not create profile' };
  }

  const cookieStore = await cookies();
  const trialCookie = createTrialStartCookie(trialStartAt);
  cookieStore.set(trialCookie.name, trialCookie.value, trialCookie.options);

  return { ok: true };
}
