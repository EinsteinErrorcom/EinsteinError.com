import { createTrialStartCookie } from '@/lib/supabase/middleware';
import { incrementFreeTrialClickCount } from '@/lib/free-trial-clicks';
import { createClient, getAuthenticatedUser } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const user = await getAuthenticatedUser(req, supabase);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('id, trial_start_at')
    .eq('id', user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: true });
  }

  const trialStartAt = new Date().toISOString();
  const { error } = await supabase.from('profiles').insert({
    id: user.id,
    trial_start_at: trialStartAt,
    is_subscribed: false,
    access_tier: 'trial',
  });

  if (error) {
    return NextResponse.json({ error: 'Could not create profile' }, { status: 500 });
  }

  await incrementFreeTrialClickCount();

  const cookieStore = await cookies();
  const trialCookie = createTrialStartCookie(trialStartAt);
  cookieStore.set(trialCookie.name, trialCookie.value, trialCookie.options);

  return NextResponse.json({ ok: true });
}
