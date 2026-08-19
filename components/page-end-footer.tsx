import { getNextSitePagePath } from '@/lib/site-pages';
import type { ReactNode } from 'react';

type PageEndFooterProps = {
  pageNumber: number;
  leadText?: ReactNode;
  /** Tighter footer for checkout tail (no top margin / lead spacer) */
  compact?: boolean;
  /** Override default “Next Page N” link label */
  nextLabel?: ReactNode;
  /** Override default next-page href */
  nextHref?: string;
};

export function PageEndFooter({
  pageNumber,
  leadText,
  compact,
  nextLabel,
  nextHref,
}: PageEndFooterProps) {
  const nextPath = nextHref ?? getNextSitePagePath(pageNumber);

  return (
    <div
      className="page-end-footer"
      style={{ textAlign: 'center', marginTop: compact ? 0 : '100px' }}
    >
      {nextPath ? (
        <a
          href={nextPath}
          className="page-end-footer__next-link"
        >
          {leadText}
          {leadText ? (
            <>
              <br />
              <br />
            </>
          ) : null}
          {nextLabel ?? (
            <>
              Click&nbsp;&nbsp;to&nbsp;&nbsp;Next&nbsp;&nbsp;
              <span style={{ color: '#FFFFFF' }}>Page&nbsp;{pageNumber + 1}</span>{' '}
              &rarr;
            </>
          )}
        </a>
      ) : null}
      <br />
      <br />
      <span className="page-end-footer__brand">Einstein Error . com</span>
      <br />
      {!compact ? <div className="spacer" style={{ height: '50px' }}></div> : null}
      <span
        style={{
          fontWeight: 'bold',
          fontStyle: 'italic',
          color: '#FF0000',
          fontSize: '25px',
        }}
      >
        END&nbsp; of&nbsp; PAGE {pageNumber}
      </span>
      <div className="spacer" style={{ height: '100px' }}></div>
    </div>
  );
}
