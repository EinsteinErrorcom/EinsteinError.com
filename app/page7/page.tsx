import { Page7AlignedPre } from '@/components/page7/page7-aligned-pre';
import { PageEndFooter } from '@/components/page-end-footer';
import { SiteHeader } from '@/components/site-header';
import {
  loadPage7Content,
  parsePage7Hierarchy,
  parsePage7HierarchyBodyLines,
  parsePage7HierarchyIntroLines,
  parsePage7SummaryLines,
  toPage7RenderLines,
} from '@/lib/content/page7';

export default function Page7() {
  const raw = loadPage7Content();
  const summaryLines = parsePage7SummaryLines(raw);
  const hierarchy = parsePage7Hierarchy(raw);
  const hierarchyIntroLines = hierarchy ? parsePage7HierarchyIntroLines(hierarchy.intro) : [];
  const hierarchyBodyLines = hierarchy ? parsePage7HierarchyBodyLines(hierarchy.body) : [];

  return (
    <div className="page-wrapper">
      <main id="main-content" className="content-page page7">
        <SiteHeader page={7} />
        <br />
        <br />

        <h1 className="page7__title f-x-large">23 Parts of the Universe</h1>

        <section className="page7__summary" aria-label="Universe parts summary">
          <Page7AlignedPre
            className="page7__summary-body"
            lines={toPage7RenderLines(summaryLines)}
          />
        </section>

        {hierarchy ? (
          <section className="page7__hierarchy" aria-label="Universe construction hierarchy">
            <h2 className="page7__hierarchy-title">{hierarchy.title}</h2>

            {hierarchyIntroLines.length > 0 ? (
              <Page7AlignedPre
                className="page7__hierarchy-intro"
                lines={toPage7RenderLines(hierarchyIntroLines)}
              />
            ) : null}

            <Page7AlignedPre
              className="page7__hierarchy-body"
              lines={toPage7RenderLines(hierarchyBodyLines)}
            />
          </section>
        ) : null}

        <PageEndFooter pageNumber={7} />
      </main>
    </div>
  );
}
