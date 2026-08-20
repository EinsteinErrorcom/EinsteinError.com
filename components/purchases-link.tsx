'use client';

import {
  fetchGeniusesStats,
  formatFreeTrialsText,
  formatPurchasesText,
  type GeniusesStats,
} from '@/lib/purchases';
import { useCallback, useEffect, useState } from 'react';

type PurchasesLinkProps = {
  className?: string;
};

const EMPTY_STATS: GeniusesStats = {
  purchases: [],
  freeTrials: [],
  freeTrialCount: 0,
};

export function PurchasesLink({ className }: PurchasesLinkProps) {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState<GeniusesStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closePanel = useCallback(() => {
    setOpen(false);
  }, []);

  const openPanel = useCallback(async () => {
    setOpen(true);
    setLoading(true);
    setError(null);

    try {
      const nextStats = await fetchGeniusesStats();
      setStats(nextStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Geniuses stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closePanel, open]);

  return (
    <>
      <button
        type="button"
        className={className ?? 'site-tour-start-link'}
        onClick={() => void openPanel()}
      >
        Geniuses
      </button>

      {open ? (
        <div
          className="purchases-float"
          role="dialog"
          aria-modal="true"
          aria-label="Geniuses who understand the Power of PURE ( mAZ ) Physics calculations"
          onClick={closePanel}
        >
          <div
            className="purchases-float__panel"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="purchases-float__title">
              Geniuses who understand the Power
              <br />
              of PURE ( mAZ ) Physics calculations.
            </h2>
            {loading && <p className="purchases-float__status">Loading Geniuses stats…</p>}
            {error && <p className="purchases-float__error">{error}</p>}
            {!loading && !error && (
              <div className="purchases-float__columns">
                <div className="purchases-float__column">
                  <h3 className="purchases-float__column-title">Paid Purchases</h3>
                  <textarea
                    readOnly
                    className="purchases-float__textarea"
                    value={formatPurchasesText(stats.purchases)}
                    aria-label="Paid purchase list"
                  />
                </div>
                <div className="purchases-float__column">
                  <h3 className="purchases-float__column-title">FREE Trial Click-Thrus</h3>
                  <textarea
                    readOnly
                    className="purchases-float__textarea"
                    value={formatFreeTrialsText(stats.freeTrials, stats.freeTrialCount)}
                    aria-label="FREE Trial click-through count and list"
                  />
                </div>
              </div>
            )}
            <button type="button" className="purchases-float__close" onClick={closePanel}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
