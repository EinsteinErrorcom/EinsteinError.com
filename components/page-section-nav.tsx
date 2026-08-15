type PageSectionNavProps = {
  hidePage?: 2 | 3 | 4 | 5 | 6 | 7 | 8;
};

const PAGE_LINKS_ROW1 = [
  { page: 2, href: "/page2", label: "PAGE2" },
  { page: 3, href: "/page3", label: "PAGE3" },
  { page: 4, href: "/page4", label: "PAGE4" },
] as const;

const PAGE_LINKS_ROW2 = [
  { page: 5, href: "/page5", label: "PAGE5" },
  { page: 6, href: "/page6", label: "PAGE6" },
  { page: 7, href: "/page7", label: "PAGE7" },
  { page: 8, href: "/page8", label: "PAGE8" },
] as const;

function PageSectionRow({
  links,
  hidePage,
}: {
  links: readonly { page: number; href: string; label: string }[];
  hidePage?: PageSectionNavProps["hidePage"];
}) {
  const visibleLinks = links.filter(({ page }) => page !== hidePage);

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <span className="page-nav__sections-row">
      {visibleLinks.map(({ page, href, label }) => (
        <a key={page} className="page-nav__section" href={href}>
          {label}
        </a>
      ))}
    </span>
  );
}

export function PageSectionNav({ hidePage }: PageSectionNavProps) {
  return (
    <span className="page-nav__sections">
      <PageSectionRow links={PAGE_LINKS_ROW1} hidePage={hidePage} />
      <PageSectionRow links={PAGE_LINKS_ROW2} hidePage={hidePage} />
    </span>
  );
}
