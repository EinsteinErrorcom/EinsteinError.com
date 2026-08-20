import { createServiceRoleClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export const FREE_TRIAL_CLICKS_KEY = 'free_trial_clicks';

export type FreeTrialRow = {
  id: string;
  trial_start_at: string | null;
};

export function formatFreeTrialClickCount(count: number): string {
  return count.toLocaleString('en-US');
}

export async function readFreeTrialClickCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_free_trial_click_count');

    if (!error && typeof data === 'number') {
      return data;
    }
  } catch {
    // Fall through to service role read below.
  }

  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from('site_stats')
      .select('value')
      .eq('key', FREE_TRIAL_CLICKS_KEY)
      .maybeSingle();

    if (!error && typeof data?.value === 'number') {
      return data.value;
    }
  } catch {
    // Table or migration may not exist yet.
  }

  return 0;
}

export async function incrementFreeTrialClickCount(): Promise<void> {
  try {
    const admin = createServiceRoleClient();
    await admin.rpc('increment_free_trial_clicks');
  } catch {
    // Counter is best-effort; profile creation must still succeed.
  }
}
