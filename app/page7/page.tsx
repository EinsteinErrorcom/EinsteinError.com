import { Page7NumberList } from '@/components/page7/page7-number-list';
import { PageEndFooter } from '@/components/page-end-footer';
import { SiteHeader } from '@/components/site-header';
import { loadPage7Numbers } from '@/lib/content/page7-numbers';

export default function Page7() {
  const numbers = loadPage7Numbers();

  return (
    <div className="page-wrapper">
      <main id="main-content" className="content-page page7">
        <SiteHeader page={7} />
        <br />
        <br />

        <p className="page7__intro">
          These are the Fundamental Values of our Universe. They are completely relative.  When you
          increase or decrease any value, some other Value(s) MUST change.
          <br />
          Do not even try to argue these Values with any &quot;Standard&quot; Physics Values, you
          will simply be
          <br />
          <span className="page7__intro-warning">
            WASTING{'\u00A0\u00A0\u00A0\u00A0'}YOUR{'\u00A0\u00A0\u00A0\u00A0'}TIME.
          </span>
        </p>

        <Page7NumberList numbers={numbers} />

        <PageEndFooter pageNumber={7} />
      </main>
    </div>
  );
}
