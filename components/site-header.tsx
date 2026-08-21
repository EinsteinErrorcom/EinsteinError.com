import { ContactBar } from "@/components/contact-bar";
import { PageNavLabel } from "@/components/page-nav-label";
import { CHECKOUT_PATH } from "@/lib/trial-gate";

type SiteHeaderProps = {
  page: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};

export function SiteHeader({ page }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__page-label">
        <PageNavLabel page={page} />
      </div>
      <figure className="media media--banner">
        <a href={CHECKOUT_PATH} data-checkout-banner="true">
          <img
            src="/TITLE2.png"
            alt="Einstein Error Title Banner"
            width={700}
            height={150}
            loading="eager"
            decoding="async"
          />
        </a>
      </figure>
      <ContactBar page={page} />
    </header>
  );
}
