import { getPageLink, PageLinkLabel } from '@/components/page-link-label';
import { getNextSitePagePath } from '@/lib/site-pages';
import { CHECKOUT_PATH } from '@/lib/trial-gate';
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
  const nextPageLink = getPageLink(pageNumber + 1);

  const footerTopMargin = compact ? 0 : pageNumber === 9 ? '50px' : '100px';

  return (
    <div
      className="page-end-footer"
      style={{ textAlign: 'center', marginTop: footerTopMargin }}
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
            nextPageLink ? (
              <>
                <PageLinkLabel
                  prefix={nextPageLink.prefix}
                  suffix={nextPageLink.suffix}
                  trailingLabel={nextPageLink.trailingLabel}
                  hidePrefix={nextPageLink.hidePrefix}
                />
                {!nextPageLink.hidePrefix ? (
                  <>
                    {' '}
                    &rarr;
                  </>
                ) : null}
              </>
            ) : (
              <>
                Click&nbsp;&nbsp;to&nbsp;&nbsp;Next&nbsp;&nbsp;
                <span style={{ color: '#FFFFFF' }}>Page&nbsp;{pageNumber + 1}</span>{' '}
                &rarr;
              </>
            )
          )}
        </a>
      ) : null}
      {pageNumber === 9 ? <br /> : (
        <>
          <br />
          <br />
        </>
      )}
      <span className="page-end-footer__brand">Einstein Error . com</span>
      <br />
      {!compact ? <div className="spacer" style={{ height: '50px' }}></div> : null}
      {pageNumber === 9 ? (
        <>
          <a href={CHECKOUT_PATH} className="page-end-footer__prices-link">
            Go&nbsp;To&nbsp;
            <span className="page-end-footer__prices-arrow">&rarr;</span>
            {'\u00A0'}
            PRICES
          </a>
          <br />
          <br />
        </>
      ) : null}
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
      <div
        className="spacer"
        style={{ height: pageNumber === 9 ? '40px' : '100px' }}
      ></div>
    </div>
  );
}
