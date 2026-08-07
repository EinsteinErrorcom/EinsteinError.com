import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

export const ALLOWED_TEST_EMAILS = new Set([
  'alwho@fastmail.com',
  'wild.book0719@fastmail.com',
]);

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function findUserIdByEmail(
  admin: SupabaseClient,
  email: string
): Promise<string | null> {
  const normalizedEmail = email.toLowerCase();
  let page = 1;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });

    if (error) {
      throw error;
    }

    const match = data.users.find(
      (user) => user.email?.toLowerCase() === normalizedEmail
    );

    if (match) {
      return match.id;
    }

    if (data.users.length < 200) {
      return null;
    }

    page += 1;
  }
}

async function resetViaServiceRole(email: string): Promise<void> {
  const admin = createAdminClient();
  if (!admin) {
    throw new Error('Service role client unavailable');
  }

  const userId = await findUserIdByEmail(admin, email);

  if (!userId) {
    throw new Error(`No auth user found for ${email}`);
  }

  const { error: profileError } = await admin
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (profileError) {
    throw profileError;
  }
}

async function resolveSessionUser(supabase: SupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    return user;
  }

  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
}

async function resetViaSession(
  supabase: SupabaseClient,
  email: string
): Promise<void> {
  const user = await resolveSessionUser(supabase);

  if (!user) {
    throw new Error('NOT_SIGNED_IN');
  }

  const normalizedEmail = email.toLowerCase();
  const signedInEmail = user.email?.toLowerCase() ?? '';

  if (signedInEmail !== normalizedEmail && !ALLOWED_TEST_EMAILS.has(signedInEmail)) {
    throw new Error(
      `Signed in as ${user.email ?? 'unknown'}. Use ${email} or add SUPABASE_SERVICE_ROLE_KEY to .env.local`
    );
  }

  const trialStartAt = new Date().toISOString();
  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      trial_start_at: trialStartAt,
      is_subscribed: false,
      access_tier: 'trial',
    },
    { onConflict: 'id' }
  );

  if (error) {
    throw error;
  }
}

export async function resetTestUser(
  email: string,
  supabase?: SupabaseClient
): Promise<void> {
  const normalizedEmail = email.toLowerCase();

  if (!ALLOWED_TEST_EMAILS.has(normalizedEmail)) {
    throw new Error(`Reset blocked: ${email} is not an allowed test account`);
  }

  const admin = createAdminClient();
  if (admin) {
    await resetViaServiceRole(email);
    return;
  }

  if (!supabase) {
    throw new Error('NOT_SIGNED_IN');
  }

  await resetViaSession(supabase, email);
}

export function hasServiceRoleKey(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}
