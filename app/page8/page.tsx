import { PageEndFooter } from "@/components/page-end-footer";
import { SiteHeader } from "@/components/site-header";

export default function Page8() {
  return (
    <div className="page-wrapper">
      <main id="main-content">
          <SiteHeader page={8} />
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
