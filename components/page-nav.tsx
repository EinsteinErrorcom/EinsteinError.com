import { PageNavLabel } from "@/components/page-nav-label";
import { PageSectionNav } from "@/components/page-section-nav";

type PageNavProps = {
  page: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  className?: string;
};

export function PageNav({ page, className }: PageNavProps) {
  const navClassName = [
    "page-nav",
    page === 1 ? "page-nav--home" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={navClassName} aria-label="Page navigation">
      <PageNavLabel page={page} />
      {page > 1 && (
        <a className="page-nav__home" href="/">
          HOME
        </a>
      )}
      {page === 1 ? (
        <PageSectionNav />
      ) : (
        <PageSectionNav hidePage={page} />
      )}
    </nav>
  );
}
