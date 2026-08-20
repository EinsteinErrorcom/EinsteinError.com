'use client';

import { useUsersOnsiteCount } from '@/components/site-presence-provider';

export function UsersOnsiteDisplay() {
  const count = useUsersOnsiteCount();

  return (
    <h1 className="site-counter-heading" aria-live="polite">
      Users&nbsp;&nbsp;Onsite
      <br />
      &nbsp;&nbsp;=&nbsp;&nbsp;{' '}
      <span className="site-counter-value">
        {count > 0 ? count : '—'}
      </span>
    </h1>
  );
}
