import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseEnv } from '@/lib/supabase/env';

const establishSessionSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
});

export async function POST(req: Request) {
  const supabaseEnv = getSupabaseEnv();
  if (!supabaseEnv) {
    return NextResponse.json({ error: 'Sign-in is not configured' }, { status: 503 });
  }

  let body: z.infer<typeof establishSessionSchema>;
  try {
    body = establishSessionSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid session payload' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    supabaseEnv.supabaseUrl,
    supabaseEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.setSession({
    access_token: body.access_token,
    refresh_token: body.refresh_token,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
