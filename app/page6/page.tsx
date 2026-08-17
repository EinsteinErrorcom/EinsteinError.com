import { Page6Document } from '@/components/page6/page6-document';
import { PageEndFooter } from '@/components/page-end-footer';
import { SiteHeader } from '@/components/site-header';
import { loadPage6Content } from '@/lib/content/page6';
import Link from 'next/link';

export default function Page6() {
  const raw = loadPage6Content();
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="page-wrapper">
      <main id="main-content" className="content-page page6">
        <SiteHeader page={6} />
        <br />
        <br />

        {isDev ? (
          <p className="page6__edit-banner">
            <Link href="/dev/page6-edit">Edit this page visually</Link>
            {' — '}
            easier than editing the raw file or asking AI.
          </p>
        ) : null}

        <h1 className="page6__title f-x-large">23 Parts of the Universe</h1>

        <Page6Document raw={raw} />

        <PageEndFooter pageNumber={6} />
      </main>
    </div>
  );
}
