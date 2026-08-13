type PageNavLabelProps = {
  page: 1 | 2 | 3 | 4 | 5 | 6 | 7;
};

export function PageNavLabel({ page }: PageNavLabelProps) {
  return (
    <p className="page-nav__label page-nav__label--top">
      Page {page} of 7
    </p>
  );
}
