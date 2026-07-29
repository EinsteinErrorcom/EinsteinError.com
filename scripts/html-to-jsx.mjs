import fs from "fs";
import path from "path";
import { parse } from "node-html-parser";

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function cssToJsxStyle(cssString) {
  const style = {};
  for (const decl of cssString.split(";")) {
    const colonIdx = decl.indexOf(":");
    if (colonIdx === -1) continue;
    let prop = decl.slice(0, colonIdx).trim();
    const value = decl.slice(colonIdx + 1).trim();
    if (!prop || !value) continue;
    prop = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    style[prop] = value;
  }
  return style;
}

function styleObjectToJsx(style) {
  const entries = Object.entries(style);
  if (entries.length === 0) return null;
  const parts = entries.map(([k, v]) => {
    const escaped = String(v).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    return `${k}: '${escaped}'`;
  });
  return `{ ${parts.join(", ")} }`;
}

function escapeJsxText(text) {
  return text
    .replace(/&(?!([a-zA-Z]+|#\d+|#x[\da-fA-F]+);)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
}

function fixHref(value) {
  if (value === "index.html") return "/";
  if (value.endsWith(".html")) return "/" + value.replace(/\.html$/, "");
  return value;
}

function fixSrc(value) {
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/") ||
    value.startsWith("data:")
  ) {
    return value;
  }
  return "/" + value;
}

function escapeAttr(value) {
  return value.replace(/"/g, "&quot;");
}

function renderAttributes(node) {
  const parts = [];
  const seen = new Map();

  for (const [rawKey, rawValue] of Object.entries(node.attributes)) {
    seen.set(rawKey, rawValue);
  }

  for (const [rawKey, rawValue] of seen) {
    let key = rawKey;
    let value = rawValue;

    if (key === "class") key = "className";
    if (key === "for") key = "htmlFor";
    if (key === "href") value = fixHref(value);
    if (key === "src") value = fixSrc(value);

    if (key === "style") {
      const jsxStyle = styleObjectToJsx(cssToJsxStyle(value));
      if (jsxStyle) parts.push(`style={${jsxStyle}}`);
      continue;
    }

    parts.push(`${key}="${escapeAttr(value)}"`);
  }

  return parts.length ? " " + parts.join(" ") : "";
}

function renderNode(node, indent = "") {
  if (node.nodeType === 3) {
    const text = node.text ?? node.rawText;
    if (!text || !text.trim()) return "";
    return indent + escapeJsxText(text);
  }

  if (node.nodeType !== 1) return "";

  const tag = node.rawTagName?.toLowerCase() ?? node.tagName?.toLowerCase();
  if (!tag) return "";

  if (tag === "html" || tag === "head" || tag === "body") {
    return node.childNodes.map((child) => renderNode(child, indent)).join("");
  }

  if (tag === "script" || tag === "style") return "";

  const attrs = renderAttributes(node);
  const isVoid = VOID_TAGS.has(tag);

  const childContent = node.childNodes
    .map((child) => renderNode(child, indent + "  "))
    .filter(Boolean)
    .join("\n");

  if (isVoid) {
    return `${indent}<${tag}${attrs} />`;
  }

  if (!childContent) {
    return `${indent}<${tag}${attrs}></${tag}>`;
  }

  if (childContent.includes("\n")) {
    return `${indent}<${tag}${attrs}>\n${childContent}\n${indent}</${tag}>`;
  }

  return `${indent}<${tag}${attrs}>${childContent.trim()}</${tag}>`;
}

function extractPageContent(html) {
  let cleaned = html.replace(/^```\s*$/gm, "");

  const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : cleaned;

  const root = parse(bodyHtml, {
    lowerCaseTagName: true,
    comment: false,
    voidTag: {
      tags: [...VOID_TAGS],
      closingSlash: true,
    },
  });

  const wrapper = root.querySelector(".page-wrapper");
  const source = wrapper ?? root;

  return source.childNodes
    .map((child) => renderNode(child, "      "))
    .filter(Boolean)
    .join("\n");
}

function wrapComponent(name, jsxBody) {
  return `export default function ${name}() {
  return (
    <div className="page-wrapper">
${jsxBody}
    </div>
  );
}
`;
}

const pages = [
  { html: "index.html", out: "app/page.tsx", component: "Home" },
  { html: "page2.html", out: "app/page2/page.tsx", component: "Page2" },
  { html: "page3.html", out: "app/page3/page.tsx", component: "Page3" },
  { html: "page4.html", out: "app/page4/page.tsx", component: "Page4" },
];

const rootDir = path.resolve(".");

for (const page of pages) {
  const htmlPath = path.join(rootDir, "public", page.html);
  if (!fs.existsSync(htmlPath)) {
    console.warn(`Skipping ${page.html} (not found)`);
    continue;
  }
  const html = fs.readFileSync(htmlPath, "utf8");
  const jsxBody = extractPageContent(html);
  const component = wrapComponent(page.component, jsxBody);
  const outPath = path.join(rootDir, page.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, component);
}
