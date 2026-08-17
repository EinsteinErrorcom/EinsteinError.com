import fs from 'fs';
import path from 'path';

export type Page6SummaryItem = {
  number: string;
  text: string;
};

export type Page6Hierarchy = {
  title: string;
  intro: string;
  body: string;
};

const PAGE6_PATH = path.join(process.cwd(), 'content/page6.txt');
export const PAGE6_HIERARCHY_MARKER = 'Construction Hierarchy of the Universe';
const HIERARCHY_MARKER = PAGE6_HIERARCHY_MARKER;
const PAGE6_TAB_INDENT = 3;
const PAGE6_CONTINUATION_TABS = 8;

const PAGE6_SUMMARY_NUMBERED_LINE = /^(\d+)(\s*-\s*)(.*)$/;
const PAGE6_HIERARCHY_PRIMARY_LINE =
  /^(Universe|\d+[A-Za-z][A-Za-z0-9 ()]*)\s*=\s*/;

function getPage6PrimaryIndent(): string {
  return '\t'.repeat(PAGE6_TAB_INDENT);
}

function getPage6ContinuationIndent(): string {
  return '\t'.repeat(PAGE6_TAB_INDENT + PAGE6_CONTINUATION_TABS);
}

function isPage6HierarchyPrimaryLine(line: string): boolean {
  return PAGE6_HIERARCHY_PRIMARY_LINE.test(line.trimStart());
}

export function indentWithTabs(text: string, tabs = PAGE6_TAB_INDENT): string {
  const prefix = '\t'.repeat(tabs);

  return text
    .split('\n')
    .map((line) => (line.trim() === '' ? '' : `${prefix}${line}`))
    .join('\n');
}

export function isPage6HierarchyTitleLine(line: string): boolean {
  return line.trim().startsWith(PAGE6_HIERARCHY_MARKER);
}

export function splitPage6DocumentLines(lines: string[]): Page6DocumentChunk[] {
  const chunks: Page6DocumentChunk[] = [];
  let currentLines: string[] = [];

  for (const line of lines) {
    if (isPage6HierarchyTitleLine(line)) {
      if (currentLines.length > 0) {
        chunks.push({ kind: 'pre', lines: currentLines });
        currentLines = [];
      }

      chunks.push({ kind: 'title', text: line.trim() });
      continue;
    }

    currentLines.push(line);
  }

  if (currentLines.length > 0) {
    chunks.push({ kind: 'pre', lines: currentLines });
  }

  return chunks;
}

export type Page6DocumentChunk =
  | { kind: 'pre'; lines: string[] }
  | { kind: 'title'; text: string };

export function loadPage6Content(): string {
  return fs.readFileSync(PAGE6_PATH, 'utf8').replace(/\r\n/g, '\n');
}

export function getPage6SummaryText(raw: string): string {
  const hierarchyIndex = raw.indexOf(HIERARCHY_MARKER);
  const summaryText = hierarchyIndex >= 0 ? raw.slice(0, hierarchyIndex) : raw;

  return summaryText.replace(/\s+$/u, '');
}

export type Page6SummaryLine =
  | { kind: 'blank' }
  | { kind: 'numbered'; indent: string; number: string; separator: string; text: string }
  | { kind: 'continuation'; indent: string; text: string };

export function parsePage6SummaryLines(raw: string): Page6SummaryLine[] {
  return getPage6SummaryText(raw).split('\n').map((line) => {
    if (line.trim() === '') {
      return { kind: 'blank' as const };
    }

    const numberedMatch = line.match(PAGE6_SUMMARY_NUMBERED_LINE);
    if (numberedMatch) {
      return {
        kind: 'numbered' as const,
        indent: getPage6PrimaryIndent(),
        number: numberedMatch[1],
        separator: numberedMatch[2],
        text: numberedMatch[3],
      };
    }

    return {
      kind: 'continuation' as const,
      indent: getPage6ContinuationIndent(),
      text: line.trimStart(),
    };
  });
}

export type Page6HierarchyLine =
  | { kind: 'blank' }
  | { kind: 'primary'; indent: string; text: string }
  | { kind: 'continuation'; indent: string; text: string };

export function parsePage6HierarchyBodyLines(body: string): Page6HierarchyLine[] {
  return body.split('\n').map((line) => {
    if (line.trim() === '') {
      return { kind: 'blank' as const };
    }

    const trimmed = line.trimStart();
    if (isPage6HierarchyPrimaryLine(line)) {
      return {
        kind: 'primary' as const,
        indent: getPage6PrimaryIndent(),
        text: trimmed,
      };
    }

    return {
      kind: 'continuation' as const,
      indent: getPage6ContinuationIndent(),
      text: trimmed,
    };
  });
}

export type Page6RenderLine =
  | { kind: 'blank' }
  | { kind: 'primary'; text: string; number?: string; separator?: string }
  | { kind: 'continuation'; text: string };

export function toPage6RenderLines(
  lines: Array<Page6SummaryLine | Page6HierarchyLine>,
): Page6RenderLine[] {
  return lines.map((line) => {
    if (line.kind === 'blank') {
      return { kind: 'blank' as const };
    }

    if (line.kind === 'numbered') {
      return {
        kind: 'primary' as const,
        number: line.number,
        separator: line.separator,
        text: line.text,
      };
    }

    if (line.kind === 'primary') {
      return {
        kind: 'primary' as const,
        text: line.text,
      };
    }

    return {
      kind: 'continuation' as const,
      text: line.text,
    };
  });
}

export function parsePage6HierarchyIntroLines(intro: string): Page6HierarchyLine[] {
  let sawPrimary = false;

  return intro.split('\n').map((line) => {
    if (line.trim() === '') {
      return { kind: 'blank' as const };
    }

    const trimmed = line.trimStart();
    if (!sawPrimary) {
      sawPrimary = true;
      return {
        kind: 'primary' as const,
        indent: getPage6PrimaryIndent(),
        text: trimmed,
      };
    }

    return {
      kind: 'continuation' as const,
      indent: getPage6ContinuationIndent(),
      text: trimmed,
    };
  });
}

/** @deprecated Use getPage6SummaryText for full multi-line summary blocks */
export function parsePage6Summary(raw: string): Page6SummaryItem[] {
  return getPage6SummaryText(raw)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(\d+)\s*-\s*(.+)$/);
      if (!match) {
        return null;
      }

      return { number: match[1], text: match[2] };
    })
    .filter((item): item is Page6SummaryItem => item !== null);
}

export function parsePage6Hierarchy(raw: string): Page6Hierarchy | null {
  const hierarchyIndex = raw.indexOf(HIERARCHY_MARKER);
  if (hierarchyIndex < 0) {
    return null;
  }

  const lines = raw.slice(hierarchyIndex).split('\n');
  const title = lines[0]?.trim() ?? '';
  const universeIndex = lines.findIndex((line) => /^Universe\s*=/.test(line.trim()));

  const introLines =
    universeIndex > 1 ? lines.slice(1, universeIndex).join('\n').replace(/\s+$/u, '') : '';

  const bodyLines = universeIndex >= 0 ? lines.slice(universeIndex) : lines.slice(1);

  return {
    title,
    intro: introLines,
    body: bodyLines.join('\n').replace(/\f/g, '\n\n').replace(/\s+$/u, ''),
  };
}
