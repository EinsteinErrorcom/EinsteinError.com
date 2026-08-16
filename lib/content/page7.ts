import fs from 'fs';
import path from 'path';

export type Page7SummaryItem = {
  number: string;
  text: string;
};

export type Page7Hierarchy = {
  title: string;
  intro: string;
  body: string;
};

const PAGE7_PATH = path.join(process.cwd(), 'content/page7.txt');
const HIERARCHY_MARKER = 'Construction Hierarchy of the Universe';
const PAGE7_TAB_INDENT = 3;
const PAGE7_CONTINUATION_TABS = 8;

const PAGE7_SUMMARY_NUMBERED_LINE = /^(\d+)(\s*-\s*)(.*)$/;
const PAGE7_HIERARCHY_PRIMARY_LINE =
  /^(Universe|\d+[A-Za-z][A-Za-z0-9 ()]*)\s*=\s*/;

function getPage7PrimaryIndent(): string {
  return '\t'.repeat(PAGE7_TAB_INDENT);
}

function getPage7ContinuationIndent(): string {
  return '\t'.repeat(PAGE7_TAB_INDENT + PAGE7_CONTINUATION_TABS);
}

function isPage7HierarchyPrimaryLine(line: string): boolean {
  return PAGE7_HIERARCHY_PRIMARY_LINE.test(line.trimStart());
}

export function indentWithTabs(text: string, tabs = PAGE7_TAB_INDENT): string {
  const prefix = '\t'.repeat(tabs);

  return text
    .split('\n')
    .map((line) => (line.trim() === '' ? '' : `${prefix}${line}`))
    .join('\n');
}

export function loadPage7Content(): string {
  return fs.readFileSync(PAGE7_PATH, 'utf8').replace(/\r\n/g, '\n');
}

export function getPage7SummaryText(raw: string): string {
  const hierarchyIndex = raw.indexOf(HIERARCHY_MARKER);
  const summaryText = hierarchyIndex >= 0 ? raw.slice(0, hierarchyIndex) : raw;

  return summaryText.replace(/\s+$/u, '');
}

export type Page7SummaryLine =
  | { kind: 'blank' }
  | { kind: 'numbered'; indent: string; number: string; separator: string; text: string }
  | { kind: 'continuation'; indent: string; text: string };

export function parsePage7SummaryLines(raw: string): Page7SummaryLine[] {
  return getPage7SummaryText(raw).split('\n').map((line) => {
    if (line.trim() === '') {
      return { kind: 'blank' as const };
    }

    const numberedMatch = line.match(PAGE7_SUMMARY_NUMBERED_LINE);
    if (numberedMatch) {
      return {
        kind: 'numbered' as const,
        indent: getPage7PrimaryIndent(),
        number: numberedMatch[1],
        separator: numberedMatch[2],
        text: numberedMatch[3],
      };
    }

    return {
      kind: 'continuation' as const,
      indent: getPage7ContinuationIndent(),
      text: line.trimStart(),
    };
  });
}

export type Page7HierarchyLine =
  | { kind: 'blank' }
  | { kind: 'primary'; indent: string; text: string }
  | { kind: 'continuation'; indent: string; text: string };

export function parsePage7HierarchyBodyLines(body: string): Page7HierarchyLine[] {
  return body.split('\n').map((line) => {
    if (line.trim() === '') {
      return { kind: 'blank' as const };
    }

    const trimmed = line.trimStart();
    if (isPage7HierarchyPrimaryLine(line)) {
      return {
        kind: 'primary' as const,
        indent: getPage7PrimaryIndent(),
        text: trimmed,
      };
    }

    return {
      kind: 'continuation' as const,
      indent: getPage7ContinuationIndent(),
      text: trimmed,
    };
  });
}

export type Page7RenderLine =
  | { kind: 'blank' }
  | { kind: 'primary'; text: string; number?: string; separator?: string }
  | { kind: 'continuation'; text: string };

export function toPage7RenderLines(
  lines: Array<Page7SummaryLine | Page7HierarchyLine>,
): Page7RenderLine[] {
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

export function parsePage7HierarchyIntroLines(intro: string): Page7HierarchyLine[] {
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
        indent: getPage7PrimaryIndent(),
        text: trimmed,
      };
    }

    return {
      kind: 'continuation' as const,
      indent: getPage7ContinuationIndent(),
      text: trimmed,
    };
  });
}

/** @deprecated Use getPage7SummaryText for full multi-line summary blocks */
export function parsePage7Summary(raw: string): Page7SummaryItem[] {
  return getPage7SummaryText(raw)
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
    .filter((item): item is Page7SummaryItem => item !== null);
}

export function parsePage7Hierarchy(raw: string): Page7Hierarchy | null {
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
