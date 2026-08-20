import Link from 'next/link';
import { PAGE_LINKS, PageLinkLabel } from '@/components/page-link-label';

const W = '\u00A0\u00A0';

type PageNavProps = {
  page: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  className?: string;
};

export function PageNav({ page, className }: PageNavProps) {
  const navClassName = ['page-nav', className].filter(Boolean).join(' ');
  const pageLinks = PAGE_LINKS.filter(({ page: linkPage }) => linkPage !== page);

  return (
    <nav className={navClassName} aria-label="Page navigation">
      <ul className="page-nav__list">
        <li>
          <Link className="page-nav__link page-nav__home" href="/">
            <PageLinkLabel prefix="HOME" suffix={`MAX-LIT${W}SUPERComputer`} />
          </Link>
        </li>
        {pageLinks.map(({ page: linkPage, href, prefix, suffix, trailingLabel, hidePrefix }) => (
          <li key={linkPage}>
            <Link className="page-nav__link" href={href}>
              <PageLinkLabel
                prefix={prefix}
                suffix={suffix}
                trailingLabel={trailingLabel}
                hidePrefix={hidePrefix}
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
