import Link from "next/link";
import { StyledEquals } from "@/components/styled-equals";

type PageNavProps = {
  page: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  className?: string;
};

type PageLink = {
  page: number;
  href: string;
  prefix: string;
  suffix: string;
};

const W = "\u00A0\u00A0";

const PAGE_LINKS: readonly PageLink[] = [
  { page: 2, href: "/page2", prefix: "PAGE2", suffix: `PROOFS${W}of${W}Einstein's${W}ERROR` },
  { page: 3, href: "/page3", prefix: "PAGE3", suffix: `PROOFS${W}of${W}Einstein's${W}ERROR` },
  { page: 4, href: "/page4", prefix: "PAGE4", suffix: "Amazing PHYSICS" },
  { page: 5, href: "/page5", prefix: "PAGE5", suffix: `Videos${W}of${W}PROOF` },
  { page: 6, href: "/page6", prefix: "PAGE6", suffix: `The${W}TRUE${W}Universe` },
  { page: 7, href: "/page7", prefix: "PAGE7", suffix: `Numbers${W}of${W}the${W}TRUE${W}Universe` },
  { page: 8, href: "/page8", prefix: "PAGE8", suffix: `SolarMath${W}CHARTS` },
];

const TAB_SIZE = 4;

function getTabGap(prefix: string) {
  const nextStop = Math.ceil(prefix.length / TAB_SIZE) * TAB_SIZE;
  return nextStop === prefix.length ? TAB_SIZE : nextStop - prefix.length;
}

function NavLinkLabel({ prefix, suffix }: { prefix: string; suffix: string }) {
  const gap = getTabGap(prefix);
  const afterEqCount =
    prefix === "PAGE8" ? 3 : prefix === "HOME" ? gap - 1 : gap;
  const afterEq = "\u00A0".repeat(afterEqCount);

  return (
    <>
      <span className="page-nav__prefix">{prefix}</span>
      {'\t'}
      <StyledEquals />
      {afterEq}
      {suffix}
    </>
  );
}

export function PageNav({ page, className }: PageNavProps) {
  const navClassName = ["page-nav", className].filter(Boolean).join(" ");
  const pageLinks = PAGE_LINKS.filter(({ page: linkPage }) => linkPage !== page);

  return (
    <nav className={navClassName} aria-label="Page navigation">
      <ul className="page-nav__list">
        <li>
          <Link className="page-nav__link page-nav__home" href="/">
            <NavLinkLabel prefix="HOME" suffix={`MAX-LIT${W}SUPERComputer`} />
          </Link>
        </li>
        {pageLinks.map(({ page: linkPage, href, prefix, suffix }) => (
          <li key={linkPage}>
            <Link className="page-nav__link" href={href}>
              <NavLinkLabel prefix={prefix} suffix={suffix} />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
