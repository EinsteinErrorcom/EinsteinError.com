export const PAGE4_LINE_LENGTH = 31;

export type TextSlice = {
  start: number;
  end: number;
  wrappers: Element[];
};

export type LineSegment =
  | { type: 'line'; start: number; end: number }
  | { type: 'manualBr' };

const INLINE_TAGS = new Set([
  'SPAN',
  'SUP',
  'SUB',
  'U',
  'EM',
  'STRONG',
  'I',
  'B',
  'A',
]);

function isBreakableChar(char: string): boolean {
  return char === ' ' || char === '\u00A0';
}

function isStyledInline(element: Element): boolean {
  if (INLINE_TAGS.has(element.tagName)) return true;
  if (element.classList.contains('page4-line-override')) return true;
  return Array.from(element.classList).some((className) => className.startsWith('c-'));
}

/** Prefer spaces and punctuation near the limit — not mid-word every N chars. */
export function splitTextAtWordBoundaryRanges(
  text: string,
  maxLen = PAGE4_LINE_LENGTH,
): Array<{ start: number; end: number }> {
  if (!text) return [];

  const ranges: Array<{ start: number; end: number }> = [];
  let start = 0;

  while (start < text.length) {
    const remaining = text.length - start;
    if (remaining <= maxLen) {
      ranges.push({ start, end: text.length });
      break;
    }

    const windowEnd = start + maxLen;
    let breakAt = -1;
    let punctBreakAt = -1;
    let hyphenBreakAt = -1;

    for (let i = windowEnd; i > start; i -= 1) {
      const char = text[i - 1];

      if (isBreakableChar(char)) {
        breakAt = i;
        break;
      }

      if ((char === '.' || char === '!' || char === '?' || char === ',') && i - start <= maxLen) {
        punctBreakAt = i;
      }

      if (char === '-' && i - start <= maxLen) {
        hyphenBreakAt = i;
      }
    }

    let end =
      breakAt > start
        ? breakAt
        : punctBreakAt > start
          ? punctBreakAt
          : hyphenBreakAt > start
            ? hyphenBreakAt
            : windowEnd;

    while (end > start && isBreakableChar(text[end - 1] ?? '')) {
      end -= 1;
    }

    if (end <= start) {
      end = windowEnd;
    }

    ranges.push({ start, end });
    start = end;
    while (start < text.length && isBreakableChar(text[start] ?? '')) {
      start += 1;
    }
  }

  return enforceMaxLineLength(ranges, text.length, maxLen);
}

function enforceMaxLineLength(
  ranges: Array<{ start: number; end: number }>,
  textLength: number,
  maxLen: number,
): Array<{ start: number; end: number }> {
  const enforced: Array<{ start: number; end: number }> = [];

  for (const range of ranges) {
    const length = range.end - range.start;
    if (length <= maxLen) {
      enforced.push(range);
      continue;
    }

    let cursor = range.start;
    while (cursor < range.end) {
      const end = Math.min(cursor + maxLen, range.end);
      enforced.push({ start: cursor, end });
      cursor = end;
    }
  }

  if (enforced.length === 0 && textLength > 0) {
    enforced.push({ start: 0, end: textLength });
  }

  return enforced;
}

export function computeLineSegments(
  text: string,
  manualBreakOffsets: number[],
  maxLen = PAGE4_LINE_LENGTH,
): LineSegment[] {
  const sorted = manualBreakOffsets
    .filter((offset) => offset >= 0 && offset <= text.length)
    .slice()
    .sort((a, b) => a - b);

  const segments: LineSegment[] = [];
  let last = 0;

  for (const offset of sorted) {
    const chunk = text.slice(last, offset);
    for (const range of splitTextAtWordBoundaryRanges(chunk, maxLen)) {
      if (range.end <= range.start) continue;
      segments.push({ type: 'line', start: last + range.start, end: last + range.end });
    }
    segments.push({ type: 'manualBr' });
    last = offset;
  }

  const tail = text.slice(last);
  for (const range of splitTextAtWordBoundaryRanges(tail, maxLen)) {
    if (range.end <= range.start) continue;
    segments.push({ type: 'line', start: last + range.start, end: last + range.end });
  }

  return segments;
}

export function flattenInlineNodes(nodes: Node[]): {
  text: string;
  slices: TextSlice[];
  forcedBreakOffsets: number[];
} {
  let text = '';
  const slices: TextSlice[] = [];
  const forcedBreakOffsets: number[] = [];

  const walk = (node: Node, wrappers: Element[]) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const value = node.textContent ?? '';
      if (!value) return;
      slices.push({
        start: text.length,
        end: text.length + value.length,
        wrappers: [...wrappers],
      });
      text += value;
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as Element;
    if (element.tagName === 'BR' || element.classList.contains('page4-hard-break-line')) {
      return;
    }

    if (element.tagName === 'DIV') {
      if (element.classList.contains('spacer') || element.hasAttribute('aria-hidden')) {
        forcedBreakOffsets.push(text.length);
      }
      return;
    }

    element.childNodes.forEach((child) => walk(child, [...wrappers, element]));
  };

  nodes.forEach((node) => walk(node, []));
  return { text, slices, forcedBreakOffsets };
}

export function sliceTextAtRange(text: string, start: number, end: number): string {
  return text.slice(start, end);
}

export function wrappersAtIndex(slices: TextSlice[], index: number): Element[] {
  for (const slice of slices) {
    if (index >= slice.start && index < slice.end) {
      return slice.wrappers;
    }
  }
  return [];
}

export function splitTextAtWordBoundary(text: string, maxLen = PAGE4_LINE_LENGTH): string[] {
  return splitTextAtWordBoundaryRanges(text, maxLen).map(({ start, end }) =>
    text.slice(start, end),
  );
}
