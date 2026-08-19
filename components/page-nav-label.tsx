import { PAGE_TITLES } from "@/lib/site-pages";
import { SolarMathTM } from "@/components/solar-math-tm";

type PageNavLabelProps = {
  page: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};

const LABEL_GAP = "\u00A0\u00A0\u00A0";

export function PageNavLabel({ page }: PageNavLabelProps) {
  return (
    <span className="page-nav__label">
      <span className="page-nav__label-numbers">Page {page} of 8</span>
      {LABEL_GAP}
      <span className="page-nav__label-title">
        {page === 8 ? (
          <>
            <SolarMathTM /> CHARTS
          </>
        ) : (
          PAGE_TITLES[page]
        )}
      </span>
    </span>
  );
}
