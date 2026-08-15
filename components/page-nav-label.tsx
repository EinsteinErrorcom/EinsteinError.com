type PageNavLabelProps = {
  page: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};

export function PageNavLabel({ page }: PageNavLabelProps) {
  return <span className="page-nav__label">Page {page} of 8</span>;
}
