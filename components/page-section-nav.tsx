type PageSectionNavProps = {
  hidePage?: 2 | 3 | 4 | 5 | 6 | 7 | 8;
};

const PAGE_LINKS = [
  { page: 2, href: "/page2", label: "PAGE2" },
  { page: 3, href: "/page3", label: "PAGE3" },
  { page: 4, href: "/page4", label: "PAGE4" },
  { page: 5, href: "/page5", label: "PAGE5" },
  { page: 6, href: "/page6", label: "PAGE6" },
  { page: 7, href: "/page7", label: "PAGE7" },
  { page: 8, href: "/page8", label: "PAGE8" },
] as const;

export function PageSectionNav({ hidePage }: PageSectionNavProps) {
  return (
    <span className="page-nav__sections">
      {PAGE_LINKS.filter(({ page }) => page !== hidePage).map(({ page, href, label }) => (
        <a key={page} className="page-nav__section" href={href}>
          {label}
        </a>
      ))}
    </span>
  );
}
