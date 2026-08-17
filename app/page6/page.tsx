import { Page6Document } from '@/components/page6/page6-document';
import { PageEndFooter } from '@/components/page-end-footer';
import { SiteHeader } from '@/components/site-header';
import { loadPage6Content } from '@/lib/content/page6';

export default function Page6() {
  const raw = loadPage6Content();

  return (
    <div className="page-wrapper">
      <main id="main-content" className="content-page page6">
        <SiteHeader page={6} />

        <h1 className="page6__title f-x-large">
          Characteristics{'\u00A0'.repeat(2)}of{'\u00A0'.repeat(2)}our{'\u00A0'.repeat(2)}TRUE{'\u00A0'.repeat(2)}Universe
        </h1>

        <Page6Document raw={raw} />

        <PageEndFooter pageNumber={6} />
      </main>
    </div>
  );
}
