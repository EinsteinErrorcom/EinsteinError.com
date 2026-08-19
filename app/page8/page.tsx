import { Page8Gallery } from '@/components/page8/page8-gallery';
import { PageEndFooter } from '@/components/page-end-footer';
import { SiteHeader } from '@/components/site-header';
import { SolarMathTM } from '@/components/solar-math-tm';
import { listPage8Images } from '@/lib/content/page8';

export default function Page8() {
  const images = listPage8Images();

  return (
    <div className="page-wrapper">
      <main id="main-content" className="content-page page8">
        <SiteHeader page={8} />
        <br />
        <br />

        <div className="page8__intro f-medium">
          This is{'\u00A0'.repeat(4)}<span className="page8__solar-math"><SolarMathTM /></span>
          <br />
          The Perfect Mathematics that is derived from the{' '}
          <span className="page8__intro-white">Unification of ALL Physics Constants</span>.
          <br />
          This Math is &quot;Relative&quot; to the Orbit-Time of the earth. This Math is
          <br />
          NOT Subjective !
          <br />
          It is absolute according to our
          <br />
          FINITE{'\u00A0'.repeat(2)}Universe{'\u00A0'.repeat(4)}which declares that
          <br />
          because all Circles are Polygons,
          <br />
          &quot; Pi &quot;{'\u00A0'.repeat(4)}is a{'\u00A0'.repeat(2)}FINITE
          <br />
          12 digit number.
        </div>

        <Page8Gallery images={images} />

        <PageEndFooter pageNumber={8} nextLabel="HOME" nextHref="/" />
      </main>
    </div>
  );
}
