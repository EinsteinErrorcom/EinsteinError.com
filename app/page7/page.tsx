import { Page7Document } from '@/components/page7/page7-document';
import { PageEndFooter } from '@/components/page-end-footer';
import { SiteHeader } from '@/components/site-header';
import { loadPage7Content } from '@/lib/content/page7';
import Link from 'next/link';

export default function Page7() {
  const raw = loadPage7Content();
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="page-wrapper">
      <main id="main-content" className="content-page page7">
        <SiteHeader page={7} />
        <br />
        <br />

        {isDev ? (
          <p className="page7__edit-banner">
            <Link href="/dev/page7-edit">Edit this page visually</Link>
            {' — '}
            easier than editing the raw file or asking AI.
          </p>
        ) : null}

        <h1 className="page7__title f-x-large">23 Parts of the Universe</h1>

        <Page7Document raw={raw} />

        <PageEndFooter pageNumber={7} />
      </main>
    </div>
  );
}
