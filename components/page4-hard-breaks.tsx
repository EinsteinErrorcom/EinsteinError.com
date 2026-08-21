'use client';

import {
  computeLineSegments,
  flattenInlineNodes,
  PAGE4_LINE_LENGTH,
  sliceTextAtRange,
  type TextSlice,
  wrappersAtIndex,
} from '@/lib/page4-break-text';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

const BLOCK_SELECTOR = [
  '.page4-content-25px .f-medium',
  '.page4-content-25px .f-x-large',
  '.page4-content-25px .f-large',
  '.page4-content-25px .f-small',
  '.page4-content-25px u',
  '.page4-content-25px .page4-society-shifts__prompt',
  '.page4-content-25px .page4-society-shifts__intro',
  '.page4-content-25px .page4-society-shifts__list li',
  '.page4-content-25px .page4-society-shifts__delimiter',
  '.page4-content-25px .page4-society-shifts__calculations-lead',
  '.page4-content-25px .slideshow-section div[style]',
].join(', ');

const SKIP_SELECTOR =
  'figure, script, style, .page4-pumpkin-divider-wrap, .site-header, .page-end-footer, textarea, input, button, img';

function isManualBreak(node: Node): node is HTMLBRElement {
  return (
    node.nodeType === Node.ELEMENT_NODE &&
    (node as Element).tagName === 'BR' &&
    !(node as Element).classList.contains('page4-auto-break')
  );
}

function isAutoBreak(node: Node): boolean {
  return (
    node.nodeType === Node.ELEMENT_NODE &&
    (node as Element).tagName === 'BR' &&
    (node as Element).classList.contains('page4-auto-break')
  );
}

function isBlockLikeChild(node: Node): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE) return false;
  const element = node as Element;
  if (element.tagName === 'BR') return false;
  if (element.classList.contains('spacer')) return true;
  if (element.classList.contains('page4-hard-break-line')) return false;
  if (element.hasAttribute('aria-hidden') && element.tagName === 'DIV') return true;
  if (element.tagName === 'FIGURE') return true;
  if (element.tagName === 'DIV' && !element.classList.contains('page4-society-shifts__answered')) {
    return true;
  }
  return false;
}

function cloneWrapperStack(wrappers: Element[]): Element[] {
  return wrappers.map((wrapper) => wrapper.cloneNode(false) as Element);
}

function appendStyledText(
  parent: Element,
  text: string,
  globalStart: number,
  slices: TextSlice[],
) {
  if (!text) return;

  let localStart = 0;
  while (localStart < text.length) {
    const globalIndex = globalStart + localStart;
    const wrappers = wrappersAtIndex(slices, globalIndex);

    let localEnd = localStart + 1;
    while (localEnd < text.length) {
      const nextWrappers = wrappersAtIndex(slices, globalStart + localEnd);
      if (nextWrappers.length !== wrappers.length) break;
      if (
        nextWrappers.some(
          (wrapper, index) =>
            wrapper.tagName !== wrappers[index]?.tagName ||
            wrapper.className !== wrappers[index]?.className ||
            wrapper.getAttribute('style') !== wrappers[index]?.getAttribute('style'),
        )
      ) {
        break;
      }
      localEnd += 1;
    }

    const chunk = text.slice(localStart, localEnd);
    let target: Element = parent;
    for (const wrapper of cloneWrapperStack(wrappers)) {
      target.appendChild(wrapper);
      target = wrapper;
    }
    target.appendChild(document.createTextNode(chunk));
    localStart = localEnd;
  }
}

function buildLineElement(
  start: number,
  end: number,
  fullText: string,
  slices: TextSlice[],
): HTMLSpanElement {
  const line = document.createElement('span');
  line.className = 'page4-hard-break-line';
  appendStyledText(line, sliceTextAtRange(fullText, start, end), start, slices);
  return line;
}

function createAutoBreak(): HTMLBRElement {
  const br = document.createElement('br');
  br.className = 'page4-auto-break';
  return br;
}

function createManualBreak(): HTMLBRElement {
  const br = document.createElement('br');
  br.className = 'page4-manual-break';
  return br;
}

type ContainerPiece =
  | { kind: 'run'; nodes: Node[] }
  | { kind: 'manualBr'; node: HTMLBRElement }
  | { kind: 'block'; element: HTMLElement };

function collectContainerPieces(container: Element): ContainerPiece[] {
  const pieces: ContainerPiece[] = [];
  let run: Node[] = [];

  const flushRun = () => {
    if (run.length === 0) return;
    pieces.push({ kind: 'run', nodes: run });
    run = [];
  };

  container.childNodes.forEach((child) => {
    if (isManualBreak(child)) {
      flushRun();
      pieces.push({ kind: 'manualBr', node: child });
      return;
    }

    if (isAutoBreak(child)) {
      return;
    }

    if (isBlockLikeChild(child)) {
      flushRun();
      if (child instanceof HTMLElement) {
        pieces.push({ kind: 'block', element: child });
      }
      return;
    }

    run.push(child);
  });

  flushRun();
  return pieces;
}

function buildProcessedHtml(
  fullText: string,
  manualBreakOffsets: number[],
  slices: TextSlice[],
): string {
  const lineSegments = computeLineSegments(fullText, manualBreakOffsets, PAGE4_LINE_LENGTH);
  const holder = document.createElement('div');
  let autoBreakPending = false;

  for (const segment of lineSegments) {
    if (segment.type === 'manualBr') {
      holder.appendChild(createManualBreak());
      autoBreakPending = false;
      continue;
    }

    if (segment.end <= segment.start) continue;

    if (autoBreakPending) {
      holder.appendChild(createAutoBreak());
    }

    holder.appendChild(buildLineElement(segment.start, segment.end, fullText, slices));
    autoBreakPending = true;
  }

  return holder.innerHTML;
}

function buildProcessedHtmlFromPieces(textPieces: ContainerPiece[]): string {
  let fullText = '';
  const manualBreakOffsets: number[] = [];
  const slices: TextSlice[] = [];

  for (const piece of textPieces) {
    if (piece.kind === 'manualBr') {
      manualBreakOffsets.push(fullText.length);
      continue;
    }

    if (piece.kind === 'block') {
      continue;
    }

    const flat = flattenInlineNodes(piece.nodes);
    for (const offset of flat.forcedBreakOffsets) {
      manualBreakOffsets.push(fullText.length + offset);
    }
    for (const slice of flat.slices) {
      slices.push({
        start: fullText.length + slice.start,
        end: fullText.length + slice.end,
        wrappers: slice.wrappers,
      });
    }
    fullText += flat.text;
  }

  if (fullText.length === 0) return '';

  return buildProcessedHtml(fullText, manualBreakOffsets, slices);
}

function processDetachedContainer(container: HTMLElement) {
  if (container.dataset.page4Broken === 'true') return;
  if (container.closest(SKIP_SELECTOR)) return;

  Array.from(container.childNodes)
    .filter((child) => isBlockLikeChild(child))
    .forEach((child) => {
      if (child instanceof HTMLElement) {
        processDetachedContainer(child);
      }
    });

  const pieces = collectContainerPieces(container);
  if (pieces.length === 0) {
    container.dataset.page4Broken = 'true';
    return;
  }

  const outputParts: string[] = [];
  let textPieces: ContainerPiece[] = [];

  const flushTextPieces = () => {
    if (textPieces.length === 0) return;
    const html = buildProcessedHtmlFromPieces(textPieces);
    if (html) outputParts.push(html);
    textPieces = [];
  };

  for (const piece of pieces) {
    if (piece.kind === 'block') {
      flushTextPieces();
      outputParts.push(piece.element.outerHTML);
      continue;
    }
    textPieces.push(piece);
  }

  flushTextPieces();

  if (outputParts.length === 0) {
    container.dataset.page4Broken = 'true';
    return;
  }

  container.innerHTML = outputParts.join('');
  container.dataset.page4Broken = 'true';
}

function breakAllTextInDetachedRoot(root: Element) {
  root.querySelectorAll(BLOCK_SELECTOR).forEach((block) => {
    const nestedInAnotherBlock = block.parentElement?.closest(BLOCK_SELECTOR);
    if (nestedInAnotherBlock) return;

    const detachedRoot = document.createElement('div');
    detachedRoot.innerHTML = (block as HTMLElement).innerHTML;

    processDetachedContainer(detachedRoot);

    (block as HTMLElement).innerHTML = detachedRoot.innerHTML;
    block.setAttribute('data-page4-broken', 'true');
  });
}

function buildBrokenHtml(sourceHtml: string): string {
  const working = document.createElement('div');
  working.className = 'page4-content-25px';
  working.innerHTML = sourceHtml;
  breakAllTextInDetachedRoot(working);
  return working.innerHTML;
}

interface Page4HardBreaksProps {
  children: ReactNode;
}

export function Page4HardBreaks({ children }: Page4HardBreaksProps) {
  const sourceRef = useRef<HTMLDivElement>(null);
  const [brokenHtml, setBrokenHtml] = useState<string | null>(null);

  useLayoutEffect(() => {
    const source = sourceRef.current;
    if (!source) return;
    const next = buildBrokenHtml(source.innerHTML);
    setBrokenHtml((prev) => (prev === next ? prev : next));
  }, [children]);

  if (brokenHtml === null) {
    return (
      <div ref={sourceRef} className="page4-content-25px" suppressHydrationWarning>
        {children}
      </div>
    );
  }

  return (
    <div
      className="page4-content-25px"
      suppressHydrationWarning
      data-page4-breaks-applied="true"
    >
      <div ref={sourceRef} hidden suppressHydrationWarning>
        {children}
      </div>
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: brokenHtml }} />
    </div>
  );
}
