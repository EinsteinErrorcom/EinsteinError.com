'use client';

import { CHECKOUT_PATH } from '@/lib/trial-gate';
import { isTourMode, SITE_TOUR_QUERY } from '@/lib/site-tour';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TimeExpired11Client() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tourMode = isTourMode(searchParams.get(SITE_TOUR_QUERY));

  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '24px 16px',
        boxSizing: 'border-box',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {tourMode && (
        <p style={{ color: '#FFFF00', fontStyle: 'italic' }}>
          Tour preview — image click to checkout is disabled.
        </p>
      )}
      <button
        type="button"
        onClick={() => {
          if (!tourMode) {
            router.push(CHECKOUT_PATH);
          }
        }}
        data-tour-block={tourMode ? 'true' : undefined}
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
