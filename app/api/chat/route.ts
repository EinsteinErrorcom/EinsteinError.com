import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processPrompt } from '@/lib/ai/adapter';

export async function POST(req: Request) {
  try {
    const { message, modelType } = await req.json();
    const supabase = await createClient();

    // 1. GATEKEEPER: Secure Authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. GATEKEEPER: Trial/Subscription Validation
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('trial_start_at, is_subscribed')
      .eq('id', user.id)
      .single();

    if (error || !profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const isTrialActive = !profile.is_subscribed && 
      (new Date().getTime() - new Date(profile.trial_start_at).getTime() < 7200000);

    if (!profile.is_subscribed && !isTrialActive) {
      return NextResponse.json({ error: 'Trial expired' }, { status: 403 });
    }

    // 3. SECURE BRIDGE: Model-Agnostic Adapter Processing
    // We do NOT send system instructions from the client. 
    // They are injected here, safely inside the server.
    const response = await processPrompt(message, modelType);
    
    return NextResponse.json({ response });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}