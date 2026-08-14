import { ContactBar } from "@/components/contact-bar";
import { PageEndFooter } from "@/components/page-end-footer";
import { PageNavLabel } from "@/components/page-nav-label";
import { PageSectionNav } from "@/components/page-section-nav";
import { CHECKOUT_PATH } from "@/lib/trial-gate";

export default function Page8() {
  return (
    <div className="page-wrapper">
      <main id="main-content">
        <header className="site-header">
          <PageNavLabel page={8} />
          <nav className="page-nav" aria-label="Page navigation">
            <a className="page-nav__home" href="/">HOME</a>
            <PageSectionNav hidePage={8} />
          </nav>
          <figure className="media media--banner"><a href={CHECKOUT_PATH}><img src="/TITLE2.png" alt="Einstein Error Title Banner" width="700" height="150" loading="eager" decoding="async" /></a></figure>
          <ContactBar />
        </header>
        <br/><br/>
        <div style={{ textAlign: "center", padding: "48px 16px" }}>
          <h1 style={{ color: "#00FFFF", fontSize: "28px", fontStyle: "italic" }}>Page 8</h1>
          <p style={{ color: "#FFFF00", marginTop: "24px", fontSize: "20px" }}>
            Content coming soon.
          </p>
          <p style={{ color: "#D0AB47", marginTop: "16px", fontSize: "18px", fontStyle: "italic" }}>
            Next: MAX-LIT AI ChatBox
          </p>
          <PageEndFooter pageNumber={8} />
        </div>
      </main>
    </div>
  );
}
