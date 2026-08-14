import { getNextSitePagePath } from '@/lib/site-pages';
import type { ReactNode } from 'react';

type PageEndFooterProps = {
  pageNumber: number;
  leadText?: ReactNode;
};

export function PageEndFooter({ pageNumber, leadText }: PageEndFooterProps) {
  const nextPath = getNextSitePagePath(pageNumber);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      {nextPath ? (
        <a
          href={nextPath}
          style={{
            fontWeight: 'bold',
            fontStyle: 'italic',
            color: '#00FFFF',
            fontSize: '25px',
            textDecoration: 'none',
          }}
        >
          {leadText}
          {leadText ? (
            <>
              <br />
              <br />
            </>
          ) : null}
          Click&nbsp;&nbsp;to&nbsp;&nbsp;Next&nbsp;&nbsp;
          <span style={{ color: '#FFFFFF' }}>Page&nbsp;{pageNumber + 1}</span>{' '}
          &rarr;
          <br />
          <br />
          Einstein Error . com
        </a>
      ) : null}
      <div className="spacer" style={{ height: '50px' }}></div>
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
