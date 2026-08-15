import { PageNavLabel } from "@/components/page-nav-label";
import { PageSectionNav } from "@/components/page-section-nav";

type PageNavProps = {
  page: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  className?: string;
};

export function PageNav({ page, className }: PageNavProps) {
  return (
    <nav
      className={className ? `page-nav ${className}` : "page-nav"}
      aria-label="Page navigation"
    >
      <PageNavLabel page={page} />
      {page > 1 && (
        <a className="page-nav__home" href="/">
          HOME
        </a>
      )}
      <PageSectionNav hidePage={page > 1 ? page : undefined} />
    </nav>
  );
}
