'use client';

import { useUsersOnsiteCount } from '@/components/site-presence-provider';

export function UsersOnsiteDisplay() {
  const count = useUsersOnsiteCount();

  return (
    <div className="users-onsite-box" aria-live="polite">
      <p className="users-onsite-box__label">Users Onsite</p>
      <p className="users-onsite-box__value">
        {count > 0 ? count : '—'}
      </p>
    </div>
  );
}
