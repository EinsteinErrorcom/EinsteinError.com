import { PageEndFooter } from "@/components/page-end-footer";
import { SiteHeader } from "@/components/site-header";

const PAGE5_VIDEO_PLACEHOLDER_TITLE = "Einstein Is FINISHED !";

const PAGE5_VIDEO_LINKS = [
  {
    href: "https://rumble.com/v6uj3f5-einstein-is-finished-.html",
    titleLine: PAGE5_VIDEO_PLACEHOLDER_TITLE,
    linkTitle: "CLICK this Video",
  },
  {
    href: "https://rumble.com/v4t4q00-may-3-2024.html",
    titleLine: "Einstein's Monumental ERROR !",
    linkTitle: "CLICK this Video",
  },
  {
    href: "#",
    titleLine: "More Einstein Soon",
    linkTitle: "Future video",
    placeholder: true,
  },
] as const;

export default function Page5() {
  return (
    <div className="page-wrapper">
      <main id="main-content">
        <SiteHeader page={5} />
        <br />
        <br />
        <div className="page5__intro">
          The first Video is MOST powerful
          <br />
          as it gives absolute PROOF
          <br />
          that Einstein is WRONG !
          <br />
          And that Gravity is the
          <br />
          <span className="page5__intro-white">
            {'\u00A0'}&quot; Flow of electrons into the earth &quot;
          </span>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="page5__video">
          {PAGE5_VIDEO_LINKS.map(({ href, titleLine, linkTitle, placeholder }, index) => (
            <div className="page5__video-item" key={index}>
              <a
                className={`page5__video-link${placeholder ? " page5__video-link--placeholder" : ""}`}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                title={linkTitle}
                aria-label={`Video : ${titleLine}`}
              >
                <span className="page5__video-link__label">
                  <span className="page5__video-link__prefix">
                    <span className="page5__video-link__prefix-word">Video</span> :
                  </span>
                  <span className="page5__video-link__title">{titleLine}</span>
                </span>
                <span className="page5__video-link__frame-hint">CLICK the Link Above</span>
              </a>
            </div>
          ))}
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <PageEndFooter pageNumber={5} />
      </main>
    </div>
  );
}
