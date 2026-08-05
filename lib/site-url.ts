import type { NextRequest } from 'next/server';

export function getSiteOrigin(request?: NextRequest) {
  if (request) {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https';

    if (forwardedHost) {
      return `${forwardedProto}://${forwardedHost}`;
    }

    return new URL(request.url).origin;
  }

  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (configured) {
    return configured;
  }

  return 'http://localhost:3000';
}

export function getAuthCallbackUrl(request?: NextRequest) {
  return `${getSiteOrigin(request)}/auth/callback`;
}

export async function getGoogleClientId(request?: NextRequest) {
  const configuredClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  if (configuredClientId) {
    return configuredClientId;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!supabaseUrl) {
    return null;
  }

  const redirectTo = encodeURIComponent(`${getSiteOrigin(request)}/auth/callback`);
  const authorizeUrl =
    `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`;

  try {
    const response = await fetch(authorizeUrl, { redirect: 'manual' });
    const location = response.headers.get('location');

    if (!location) {
      return null;
    }

    return new URL(location).searchParams.get('client_id');
  } catch {
    return null;
  }
}
