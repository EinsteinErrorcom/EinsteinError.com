'use client';

import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useState } from 'react';

export function ChatExitLinks() {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.assign('/');
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <nav
      aria-label="Chat navigation"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '16px',
        fontSize: '18px',
        fontWeight: 'bold',
        fontStyle: 'italic',
      }}
    >
      <Link href="/" style={{ color: '#00FFFF', textDecoration: 'underline' }}>
        Home
      </Link>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        disabled={signingOut}
        className="max-lit-chatbox-exit-signout"
        style={{
          background: 'transparent',
          border: 'none',
          textDecoration: 'underline',
          cursor: signingOut ? 'default' : 'pointer',
          font: 'inherit',
        }}
      >
        {signingOut ? 'Signing out...' : 'Sign out'}
      </button>
    </nav>
  );
}
