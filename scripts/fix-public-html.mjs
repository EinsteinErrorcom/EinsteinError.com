import fs from "fs";
import path from "path";
const htmlFiles = ["index.html", "page2.html", "page3.html", "page4.html"];

function fixHref(value) {
  if (value === "index.html") return "/";
  if (value.endsWith(".html")) return "/" + value.replace(/\.html$/, "");
  return value;
}

function dedupeImgTag(tag) {
  const match = tag.match(/^<img([\s\S]*?)>$/i);
  if (!match) return tag;
  const attrRegex =
    /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  const attrs = new Map();
  let m;
  while ((m = attrRegex.exec(match[1])) !== null) {
    attrs.set(m[1], m[2] ?? m[3] ?? m[4] ?? "");
  }
  const parts = [];
  for (const [key, value] of attrs) {
    let v = value;
    if (key === "href") v = fixHref(v);
    parts.push(`${key}="${v}"`);
  }
  return `<img ${parts.join(" ")} />`;
}

function fixHtmlFile(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  html = html.replace(/^```\s*$/gm, "");

  html = html.replace(/<img[\s\S]*?>/gi, (tag) => dedupeImgTag(tag.replace(/\/>$/, ">")));

  html = html.replace(/href="index\.html"/g, 'href="/"');
  html = html.replace(/href="page2\.html"/g, 'href="/page2"');
  html = html.replace(/href="page3\.html"/g, 'href="/page3"');
  html = html.replace(/href="page4\.html"/g, 'href="/page4"');

  if (!html.includes("</html>") && html.includes("</body>")) {
    html = html.replace(/<\/body>\s*$/i, "    </div>\n</body>\n</html>\n");
  }

  fs.writeFileSync(filePath, html);
}

for (const file of htmlFiles) {
  const filePath = path.join("public", file);
  if (fs.existsSync(filePath)) {
    fixHtmlFile(filePath);
  }
}
