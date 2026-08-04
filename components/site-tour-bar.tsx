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

    if (window.opener && !window.opener.closed) {
      window.close();
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.delete(SITE_TOUR_QUERY);
    window.location.replace(`${url.pathname}${url.search}`);
  };

  return (
    <div className="site-tour-float" role="region" aria-label="Site tour navigation">
      <p className="site-tour-float__title">
        Site Tour — {step ? step.label : 'Off route'} ({displayIndex}/{SITE_TOUR_STEPS.length})
      </p>
      <p className="site-tour-float__note">Preview only — nothing activates.</p>
      <div className="site-tour-float__actions">
        {prev ? (
          <Link href={getTourHref(prev.path)} className="site-tour-float__btn">
            Previous
          </Link>
        ) : (
          <span className="site-tour-float__btn site-tour-float__btn--disabled">Previous</span>
        )}
        {next ? (
          <Link
            href={getTourHref(next.path)}
            className="site-tour-float__btn site-tour-float__btn--primary"
          >
            Next
          </Link>
        ) : (
          <button
            type="button"
            className="site-tour-float__btn site-tour-float__btn--primary"
            onClick={exitTour}
          >
            Finish
          </button>
        )}
        <button type="button" className="site-tour-float__btn site-tour-float__btn--exit" onClick={exitTour}>
          Exit
        </button>
      </div>
    </div>
  );
}

export function SiteTourStartLink({ className }: { className?: string }) {
  return (
    <a
      href={getTourHref('/')}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? 'site-tour-start-link'}
    >
      Site Tour
    </a>
  );
}
