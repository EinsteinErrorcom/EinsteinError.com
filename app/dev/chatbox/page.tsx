import Chatbox from '@/components/chat/Chatbox';
import Link from 'next/link';
import { redirect } from 'next/navigation';

/** Localhost-only full chatbox preview — no Google sign-in required. */
export default function DevChatboxPage() {
  if (process.env.NODE_ENV !== 'development') {
    redirect('/');
  }

  const trialStartedAt = new Date().toISOString();

  return (
    <main className="p-8">
      <p
        style={{
          color: '#FFFF00',
          fontStyle: 'italic',
          marginBottom: '16px',
          textAlign: 'center',
          fontSize: '1.1rem',
        }}
      >
        Dev preview (localhost only) — full chatbox UI. Sign-in not required to view.
        {' '}
        AI replies need Google sign-in on{' '}
        <Link href="/maxchatbox9" style={{ color: '#00FFFF', textDecoration: 'underline' }}>
          /maxchatbox9
        </Link>
        .
      </p>
      <h1 className="max-lit-chatbox-page-title text-2xl font-bold mb-4 text-center">
        MAX-LIT{'\u00A0'.repeat(3)}Chat{'\u00A0'.repeat(3)}WINDOW
      </h1>
      <Chatbox embedded accessTier="trial" accessStartedAt={trialStartedAt} />
    </main>
  );
}
