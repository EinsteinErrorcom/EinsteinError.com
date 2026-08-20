import type { ReactNode } from 'react';
import { SolarMathTM } from '@/components/solar-math-tm';
import { StyledEquals } from '@/components/styled-equals';

const W = '\u00A0\u00A0';

export type PageLink = {
  page: number;
  href: string;
  prefix: string;
  suffix: ReactNode;
  /** When set, prefix/equals/label render after suffix on the same line. */
  trailingLabel?: ReactNode;
  /** When true, render suffix only (no PAGE# = prefix block). */
  hidePrefix?: boolean;
};

export const PAGE_LINKS: readonly PageLink[] = [
  {
    page: 2,
    href: '/page2',
    prefix: 'PAGE2',
    hidePrefix: true,
    suffix: (
      <>
        {`of${W}Einstein's${W}ERROR${W}on${W}`}
        <span className="page-link-label__arrow">&rarr;{'\u00A0'}</span>
        <span className="page-link-label__gold">PAGE 2</span>
      </>
    ),
  },
  {
    page: 3,
    href: '/page3',
    prefix: 'PAGE3',
    suffix: `PROOFS${W}of${W}Einstein's${W}ERROR`,
  },
  { page: 4, href: '/page4', prefix: 'PAGE4', suffix: 'Amazing PHYSICS' },
  { page: 5, href: '/page5', prefix: 'PAGE5', suffix: `Videos${W}of${W}PROOF` },
  { page: 6, href: '/page6', prefix: 'PAGE6', suffix: `The${W}TRUE${W}Universe` },
  { page: 7, href: '/page7', prefix: 'PAGE7', suffix: `NUMBERS${W}Re:${W}the${W}True${W}Universe` },
  { page: 8, href: '/page8', prefix: 'PAGE8', suffix: <><SolarMathTM />{W}CHARTS</> },
];

const TAB_SIZE = 4;

function getTabGap(prefix: string) {
  const nextStop = Math.ceil(prefix.length / TAB_SIZE) * TAB_SIZE;
  return nextStop === prefix.length ? TAB_SIZE : nextStop - prefix.length;
}

export function getPageLink(page: number): PageLink | undefined {
  return PAGE_LINKS.find((link) => link.page === page);
}

type PageLinkLabelProps = {
  prefix: string;
  suffix: ReactNode;
  trailingLabel?: ReactNode;
  hidePrefix?: boolean;
};

export function PageLinkLabel({
  prefix,
  suffix,
  trailingLabel,
  hidePrefix,
}: PageLinkLabelProps) {
  const gap = getTabGap(prefix);
  const afterEqCount =
    prefix === 'PAGE8' ? 3 : prefix === 'HOME' ? gap - 1 : gap;
  const afterEq = '\u00A0'.repeat(afterEqCount);

  if (hidePrefix) {
    return <>{suffix}</>;
  }

  if (trailingLabel) {
    return (
      <>
        {suffix}
        {'\u00A0\u00A0\u00A0'}
        <span className="page-nav__prefix">{prefix}</span>
        {'\u00A0'.repeat(gap)}
        <StyledEquals />
        {afterEq}
        {trailingLabel}
      </>
    );
  }

  return (
    <>
      <span className="page-nav__prefix">{prefix}</span>
      {'\u00A0'.repeat(gap)}
      <StyledEquals />
      {afterEq}
      {suffix}
    </>
  );
}
