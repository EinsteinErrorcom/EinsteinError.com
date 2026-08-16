'use client';

import {
  ACCESS_TIER_LABELS,
  getAccessDurationMs,
  getRemainingAccessMs,
  type AccessTier,
} from '@/lib/access';
import { CHECKOUT_PATH } from '@/lib/trial-gate';
import { useEffect, useState } from 'react';

type CountdownTimerBoxProps = {
  accessTier: AccessTier;
  accessStartedAt: string;
};

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  if (days > 0) {
    return `${days}d ${hh}:${mm}:${ss}`;
  }

  return `${hh}:${mm}:${ss}`;
}

function buildProfile(accessTier: AccessTier, accessStartedAt: string) {
  return {
    access_tier: accessTier,
    trial_start_at: accessStartedAt,
    is_subscribed: accessTier !== 'trial',
  };
}

export function CountdownTimerBox({
  accessTier,
  accessStartedAt,
}: CountdownTimerBoxProps) {
  const profile = buildProfile(accessTier, accessStartedAt);
  const tierLabel = ACCESS_TIER_LABELS[accessTier];
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const currentProfile = buildProfile(accessTier, accessStartedAt);
      const next = getRemainingAccessMs(currentProfile);
      setRemainingMs(next);

      if (next <= 0) {
        window.location.assign(CHECKOUT_PATH);
      }
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [accessTier, accessStartedAt]);

  const totalMs = getAccessDurationMs(profile);
  const progress =
    remainingMs === null
      ? 100
      : totalMs > 0
        ? Math.min(100, Math.max(0, (remainingMs / totalMs) * 100))
        : 0;

  return (
    <div className="max-lit-chatbox__timer rounded-lg bg-[#0d1117] px-4 py-3 text-center">
      <p className="max-lit-chatbox__timer-label text-xs font-bold uppercase tracking-wide">
        Count-Down Timer Box
      </p>
      <p className="text-[#00FFFF] font-bold italic mt-1">
        MAX-LIT Access
        <br />
        ={'\u00A0'.repeat(2)}
        {tierLabel}
      </p>
      <p
        className="text-[#FFFFFF] text-2xl font-bold tabular-nums mt-2"
        aria-live="polite"
      >
        {remainingMs === null ? '00:59:59' : formatRemaining(remainingMs)}
      </p>
      <div className="mt-2 h-2 w-full rounded bg-[#161b22] overflow-hidden">
        <div
          className="h-full bg-[#00FFFF] transition-[width] duration-1000 linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
