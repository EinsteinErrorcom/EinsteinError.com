import { NextResponse } from 'next/server';
import { SITE_PAGES } from '@/lib/site-pages';
import { CHAT_PATH, CHECKOUT_PATH } from '@/lib/trial-gate';

export const runtime = 'nodejs';

export async function GET() {
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY?.trim());

  return NextResponse.json({
    ok: stripeConfigured && supabaseConfigured,
    timestamp: new Date().toISOString(),
    routes: {
      home: '/',
      chat: CHAT_PATH,
      checkout: CHECKOUT_PATH,
      pageCount: SITE_PAGES.length,
    },
    services: {
      supabase: supabaseConfigured,
      stripe: stripeConfigured,
      gemini: geminiConfigured,
    },
    environment: process.env.NODE_ENV ?? 'unknown',
  });
}
