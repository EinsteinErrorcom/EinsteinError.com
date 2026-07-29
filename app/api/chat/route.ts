import { NextResponse } from 'next/server';
import { processPrompt } from '@/lib/ai/adapter';
// We will import your Supabase client here once we verify your path
import { createClient } from '@/lib/supabase/server'; 

export async function POST(req: Request) {
  const { prompt, modelType } = await req.json();
  const supabase = await createClient();

  // 1. GATEKEEPER: Verify user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. GATEKEEPER: Check Subscription/Trial (Assuming a 'profiles' table)
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_trial_active, stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.is_trial_active) {
    return NextResponse.json({ error: 'Subscription or Trial required' }, { status: 403 });
  }

  // 3. SECURE BRIDGE: If passed, process the prompt
  const response = await processPrompt(prompt, modelType);
  
  return NextResponse.json({ response });
}