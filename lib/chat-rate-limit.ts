import type { SupabaseClient } from '@supabase/supabase-js';

export type ChatRateLimitFailure = {
  ok: false;
  status: 429;
  error: string;
};

export type ChatRateLimitSuccess = {
  ok: true;
};

export type ChatRateLimitResult = ChatRateLimitFailure | ChatRateLimitSuccess;

const HOUR_MS = 60 * 60 * 1000;
const memoryBuckets = new Map<string, number[]>();

export function getChatRateLimitPerHour(): number {
  const configured = Number(process.env.CHAT_RATE_LIMIT_PER_HOUR ?? 20);
  return Number.isFinite(configured) && configured > 0 ? configured : 20;
}

function enforceMemoryRateLimit(userId: string, limit: number): ChatRateLimitResult {
  const now = Date.now();
  const recent = (memoryBuckets.get(userId) ?? []).filter((timestamp) => now - timestamp < HOUR_MS);

  if (recent.length >= limit) {
    return {
      ok: false,
      status: 429,
      error: `Rate limit exceeded. Max ${limit} chat requests per hour.`,
    };
  }

  recent.push(now);
  memoryBuckets.set(userId, recent);
  return { ok: true };
}

export async function enforceChatRateLimit(
  supabase: SupabaseClient,
  userId: string
): Promise<ChatRateLimitResult> {
  const limit = getChatRateLimitPerHour();
  const windowStart = new Date(Date.now() - HOUR_MS).toISOString();

  const { count, error } = await supabase
    .from('chat_requests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', windowStart);

  if (error) {
    return enforceMemoryRateLimit(userId, limit);
  }

  if ((count ?? 0) >= limit) {
    return {
      ok: false,
      status: 429,
      error: `Rate limit exceeded. Max ${limit} chat requests per hour.`,
    };
  }

  const { error: insertError } = await supabase
    .from('chat_requests')
    .insert({ user_id: userId });

  if (insertError) {
    return enforceMemoryRateLimit(userId, limit);
  }

  return { ok: true };
}
