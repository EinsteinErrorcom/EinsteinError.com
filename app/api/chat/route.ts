import { NextResponse } from 'next/server';
import { AIAdapterError, processPrompt } from '@/lib/ai/adapter';
import { enforceChatGatekeeper } from '@/lib/chat-gatekeeper';
import { enforceChatRateLimit } from '@/lib/chat-rate-limit';
import { createClient } from '@/lib/supabase/server';
import { chatRequestSchema } from '@/lib/validations/chat';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    await supabase.auth.getSession();

    const authHeader = req.headers.get('Authorization');
    const bearerToken = authHeader?.replace(/^Bearer\s+/i, '').trim() || null;

    const gatekeeper = await enforceChatGatekeeper(supabase, bearerToken);
    if (!gatekeeper.ok) {
      return NextResponse.json({ error: gatekeeper.error }, { status: gatekeeper.status });
    }

    const rateLimit = await enforceChatRateLimit(supabase, gatekeeper.userId);
    if (!rateLimit.ok) {
      return NextResponse.json({ error: rateLimit.error }, { status: rateLimit.status });
    }

    const response = await processPrompt(parsed.data.message);

    return NextResponse.json({ response });
  } catch (err) {
    if (err instanceof AIAdapterError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
