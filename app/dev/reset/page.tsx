import { resetTestUser, hasServiceRoleKey } from '@/lib/supabase/test-reset';
import { createClient } from '@/lib/supabase/server';
import { createTrialStartCookie } from '@/lib/supabase/middleware';
import { CHAT_PATH, SIGN_IN_PATH } from '@/lib/trial-gate';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const TEST_EMAIL = 'alwho@fastmail.com';

type DevResetPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function DevResetPage({ searchParams }: DevResetPageProps) {
  if (process.env.NODE_ENV !== 'development') {
    redirect('/');
  }

  const params = await searchParams;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (params.error) {
    return (
      <main
        style={{
          maxWidth: 640,
          margin: '80px auto',
          padding: '32px',
          background: '#161b22',
          border: '4px solid #C5A059',
          borderRadius: 12,
          color: '#00FFFF',
          lineHeight: 1.6,
        }}
      >
        <h1 style={{ color: '#FF6B6B', fontSize: 28, marginBottom: 16 }}>
          Dev Reset Failed
        </h1>
        <p style={{ marginBottom: 24 }}>{decodeURIComponent(params.error)}</p>
        <Link href="/dev/reset" style={{ color: '#C5A059', marginRight: 16 }}>
          Try again
        </Link>
        <Link href="/" style={{ color: '#00FFFF' }}>
          Back to home
        </Link>
      </main>
    );
  }

  if (!session && !hasServiceRoleKey()) {
    return (
      <main
        style={{
          maxWidth: 640,
          margin: '80px auto',
          padding: '32px',
          background: '#161b22',
          border: '4px solid #C5A059',
          borderRadius: 12,
          color: '#00FFFF',
          lineHeight: 1.6,
        }}
      >
        <h1 style={{ color: '#FFFF00', fontSize: 28, marginBottom: 16 }}>
          Dev Trial Reset
        </h1>
        <p style={{ marginBottom: 16 }}>
          To reset your 1-hour trial for testing, choose one option:
        </p>
        <ol style={{ paddingLeft: 24, marginBottom: 24 }}>
          <li style={{ marginBottom: 12 }}>
            <strong style={{ color: '#FFFFFF' }}>Sign in first</strong>, then return here:
            <br />
            <Link href={SIGN_IN_PATH} style={{ color: '#C5A059' }}>
              Go sign in with Google
            </Link>
            {' → then visit '}
            <Link href="/dev/reset" style={{ color: '#C5A059' }}>
              /dev/reset
            </Link>
          </li>
          <li>
            <strong style={{ color: '#FFFFFF' }}>Or</strong> add{' '}
            <code style={{ color: '#FFFF00' }}>SUPABASE_SERVICE_ROLE_KEY</code>{' '}
            to <code style={{ color: '#FFFF00' }}>.env.local</code> so reset works without sign-in.
          </li>
        </ol>
        {params.error && (
          <p style={{ color: '#FF6B6B', marginBottom: 16 }}>{params.error}</p>
        )}
        <Link href="/" style={{ color: '#00FFFF', fontWeight: 'bold' }}>
          ← Back to home
        </Link>
      </main>
    );
  }

  try {
    await resetTestUser(TEST_EMAIL, supabase);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Reset failed';
    redirect(`/dev/reset?error=${encodeURIComponent(message)}`);
  }

  const cookieStore = await cookies();
  const trialCookie = createTrialStartCookie(new Date().toISOString());
  cookieStore.set(trialCookie.name, trialCookie.value, trialCookie.options);

  redirect(CHAT_PATH);
}
