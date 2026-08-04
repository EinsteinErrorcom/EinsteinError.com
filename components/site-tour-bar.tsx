'use client';

import {
  getTourHref,
  getTourStep,
  getTourStepIndex,
  isTourMode,
  SITE_TOUR_QUERY,
  SITE_TOUR_STEPS,
  SITE_TOUR_STORAGE_KEY,
} from '@/lib/site-tour';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SiteTourBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fromQuery = isTourMode(searchParams.get(SITE_TOUR_QUERY));
    if (fromQuery) {
      sessionStorage.setItem(SITE_TOUR_STORAGE_KEY, '1');
      setVisible(true);
      return;
    }

    setVisible(sessionStorage.getItem(SITE_TOUR_STORAGE_KEY) === '1');
  }, [searchParams]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const blockTourActions = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (!target.closest('[data-tour-block="true"]')) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener('click', blockTourActions, true);
    return () => document.removeEventListener('click', blockTourActions, true);
  }, [visible]);

  if (!visible) {
    return null;
  }

  const stepIndex = getTourStepIndex(pathname);
  const step = getTourStep(pathname);
  const onTourRoute = stepIndex >= 0;
  const displayIndex = onTourRoute ? stepIndex + 1 : '—';
  const prev = onTourRoute && stepIndex > 0 ? SITE_TOUR_STEPS[stepIndex - 1] : null;
  const next = onTourRoute
    ? stepIndex < SITE_TOUR_STEPS.length - 1
      ? SITE_TOUR_STEPS[stepIndex + 1]
      : null
    : SITE_TOUR_STEPS[0];

  const exitTour = () => {
    sessionStorage.removeItem(SITE_TOUR_STORAGE_KEY);
    setVisible(false);
  };

  return (
    <div className="site-tour-bar" role="region" aria-label="Site tour navigation">
      <div className="site-tour-bar__inner">
        <p className="site-tour-bar__title">
          Site Tour — {step ? step.label : 'Off tour route'} ({displayIndex} of{' '}
          {SITE_TOUR_STEPS.length})
        </p>
        <p className="site-tour-bar__note">
          Preview only. Sign-in, checkout, and chat are disabled.
        </p>
        <div className="site-tour-bar__actions">
          {prev ? (
            <Link href={getTourHref(prev.path)} className="site-tour-bar__link">
              ← Previous
            </Link>
          ) : (
            <span className="site-tour-bar__link site-tour-bar__link--disabled">← Previous</span>
          )}
          {next ? (
            <Link href={getTourHref(next.path)} className="site-tour-bar__link site-tour-bar__link--primary">
              {onTourRoute ? 'Next →' : 'Back to tour start →'}
            </Link>
          ) : (
            <button type="button" className="site-tour-bar__link site-tour-bar__link--primary" onClick={exitTour}>
              Finish tour
            </button>
          )}
          <button type="button" className="site-tour-bar__exit" onClick={exitTour}>
            Exit tour
          </button>
        </div>
      </div>
    </div>
  );
}

export function SiteTourStartLink({ className }: { className?: string }) {
  return (
    <Link href={getTourHref('/')} className={className ?? 'site-tour-start-link'}>
      Start Site Tour (preview all pages — nothing activates)
    </Link>
  );
}
