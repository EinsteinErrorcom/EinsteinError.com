type PageSectionNavProps = {
  hidePage?: 2 | 3 | 4 | 5 | 6 | 8;
};

type PageLink = {
  page: number;
  href: string;
  label: string;
};

const PAGE_LINKS: readonly PageLink[] = [
  { page: 2, href: "/page2", label: "PAGE2" },
  { page: 3, href: "/page3", label: "PAGE3" },
  { page: 4, href: "/page4", label: "PAGE4" },
  { page: 5, href: "/page5", label: "PAGE5" },
  { page: 6, href: "/page6", label: "PAGE6" },
  { page: 8, href: "/page8", label: "PAGE8" },
];

function getPageRows(hidePage?: PageSectionNavProps["hidePage"]) {
  if (hidePage === undefined || hidePage === 6 || hidePage === 8) {
    return {
      row1Pages: [2, 3, 4],
      row2Pages: [5, 6, 8],
    };
  }

  return {
    row1Pages: [2, 3, 4, 5],
    row2Pages: [6, 8],
  };
}

function PageSectionRow({
  pages,
  hidePage,
}: {
  pages: readonly number[];
  hidePage?: PageSectionNavProps["hidePage"];
}) {
  const visibleLinks = PAGE_LINKS.filter(
    ({ page }) => pages.includes(page) && page !== hidePage,
  );

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
  const { row1Pages, row2Pages } = getPageRows(hidePage);

  return (
    <span className="page-nav__sections">
      <PageSectionRow pages={row1Pages} hidePage={hidePage} />
      <PageSectionRow pages={row2Pages} hidePage={hidePage} />
    </span>
  );
}
