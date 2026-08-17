import { Page8Gallery } from '@/components/page8/page8-gallery';
import { Page8NumberList } from '@/components/page8/page8-number-list';
import { PageEndFooter } from '@/components/page-end-footer';
import { SiteHeader } from '@/components/site-header';
import { loadSortedPage8Numbers } from '@/lib/content/page8-numbers';
import { listPage8Images } from '@/lib/content/page8';

const PAGE8_INTRO = `This is SOLARMath.
The Perfect Mathematics that is derived from the Unification of ALL Physics Constants.
This Math is "Relative" to the Orbit-Time of the earth. This Math is NOT Subjective !
It is absolute according to our FINITE Universe which declares that
" Pi " is a FINITE 12 digit number.`;

export default function Page8() {
  const images = listPage8Images();
  const sortedNumbers = loadSortedPage8Numbers(PAGE8_INTRO);

  return (
    <div className="page-wrapper">
      <main id="main-content" className="content-page page8">
        <SiteHeader page={8} />
        <br />
        <br />

        <div className="page8__intro f-medium">
          This is SOLARMath.
          <br />
          The Perfect Mathematics that is derived from the Unification of ALL Physics Constants.
          <br />
          This Math is &quot;Relative&quot; to the Orbit-Time of the earth. This Math is NOT Subjective !
          <br />
          It is absolute according to our FINITE Universe which declares that
          <br />
          &quot; Pi &quot; is a FINITE 12 digit number.
        </div>

        <Page8Gallery images={images} />

        <Page8NumberList numbers={sortedNumbers} />

        <PageEndFooter pageNumber={8} nextLabel="HOME" nextHref="/" />
      </main>
    </div>
  );
}
