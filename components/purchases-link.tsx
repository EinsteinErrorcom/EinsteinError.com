'use client';

import { fetchPurchases, formatPurchasesText, type PurchaseRow } from '@/lib/purchases';
import { useCallback, useEffect, useState } from 'react';

type PurchasesLinkProps = {
  className?: string;
};

export function PurchasesLink({ className }: PurchasesLinkProps) {
  const [open, setOpen] = useState(false);
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
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
      const rows = await fetchPurchases();
      setPurchases(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load purchases');
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
            {loading && <p className="purchases-float__status">Loading purchases…</p>}
            {error && <p className="purchases-float__error">{error}</p>}
            {!loading && !error && (
              <>
                <textarea
                  readOnly
                  className="purchases-float__textarea"
                  value={formatPurchasesText(purchases)}
                  aria-label="Purchase list"
                />
              </>
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
