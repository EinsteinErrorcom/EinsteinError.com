import { getGoogleClientId, getSiteOrigin } from '@/lib/site-url';
import { NextResponse } from 'next/server';

export async function GET() {
  const configuredClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  if (configuredClientId) {
    return NextResponse.json({ clientId: configuredClientId });
  }

  const clientId = await getGoogleClientId();
  if (!clientId) {
    return NextResponse.json(
      { error: 'Google Client ID not found. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local' },
      { status: 404 }
    );
  }

  return NextResponse.json({ clientId, origin: getSiteOrigin() });
}
