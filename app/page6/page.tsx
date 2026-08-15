import { PageEndFooter } from "@/components/page-end-footer";
import { SiteHeader } from "@/components/site-header";

export default function Page6() {
  return (
    <div className="page-wrapper">
      <main id="main-content">
          <SiteHeader page={6} />
        <br/><br/>
        <div style={{ textAlign: "center", padding: "48px 16px" }}>
          <h1 style={{ color: "#00FFFF", fontSize: "28px", fontStyle: "italic" }}>Page 6</h1>
          <p style={{ color: "#FFFF00", marginTop: "24px", fontSize: "20px" }}>
            Content coming soon.
          </p>
          <PageEndFooter pageNumber={6} />
        </div>
      </main>
    </div>
  );
}
