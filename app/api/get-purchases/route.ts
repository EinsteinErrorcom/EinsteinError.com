import { readFreeTrialClickCount } from '@/lib/free-trial-clicks';
import type { FreeTrialRow } from '@/lib/purchases';
import { createServiceRoleClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type PurchaseRow = {
  id: string;
  trial_start_at: string | null;
  access_tier: string | null;
};

async function readPurchasesWithServiceRole(): Promise<PurchaseRow[] | null> {
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from('profiles')
      .select('id, trial_start_at, access_tier')
      .eq('is_subscribed', true)
      .order('trial_start_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data ?? [];
  } catch {
    return null;
  }
}

async function readPurchasesWithRpc(): Promise<PurchaseRow[] | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_subscribed_purchases');

    if (error) {
      throw error;
    }

    return (data as PurchaseRow[] | null) ?? [];
  } catch {
    return null;
  }
}

async function readFreeTrialsWithServiceRole(): Promise<FreeTrialRow[] | null> {
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from('profiles')
      .select('id, trial_start_at')
      .eq('is_subscribed', false)
      .eq('access_tier', 'trial')
      .not('trial_start_at', 'is', null)
      .order('trial_start_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data ?? [];
  } catch {
    return null;
  }
}

async function readFreeTrialsWithRpc(): Promise<FreeTrialRow[] | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_free_trial_clickthroughs');

    if (error) {
      throw error;
    }

    return (data as FreeTrialRow[] | null) ?? [];
  } catch {
    return null;
  }
}

export async function GET() {
  const purchases =
    (await readPurchasesWithServiceRole()) ?? (await readPurchasesWithRpc());

  if (purchases === null) {
    return NextResponse.json(
      {
        error:
          'Unable to load purchases. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase Dashboard → Settings → API → service_role), apply the latest Supabase migration, then restart npm run dev.',
      },
      { status: 500 }
    );
  }

  const freeTrials =
    (await readFreeTrialsWithServiceRole()) ?? (await readFreeTrialsWithRpc()) ?? [];

  const freeTrialCount = await readFreeTrialClickCount();

  return NextResponse.json({
    purchases,
    freeTrials,
    freeTrialCount,
  });
}
