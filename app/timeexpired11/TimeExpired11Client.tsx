'use client';

import { CHECKOUT_PATH } from '@/lib/trial-gate';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function TimeExpired11Client() {
  const router = useRouter();

  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '24px 16px',
        boxSizing: 'border-box',
      }}
    >
      <button
        type="button"
        onClick={() => router.push(CHECKOUT_PATH)}
        aria-label="Time expired — click to purchase MAX-LIT access"
        style={{
          border: 'none',
          background: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'block',
          width: '500px',
          maxWidth: '100%',
        }}
      >
        <Image
          src="/TIMEEXPIRED.png"
          alt="Time Expired — Click to purchase MAX-LIT access"
          width={500}
          height={800}
          priority
          style={{
            width: '500px',
            height: '800px',
            maxWidth: '100%',
            objectFit: 'contain',
          }}
        />
      </button>
    </main>
  );
}
