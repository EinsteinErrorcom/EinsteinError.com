'use client';

import { useLayoutEffect, useRef } from 'react';
import type { Page7RenderLine } from '@/lib/content/page7';

type Page7AlignedPreProps = {
  lines: Page7RenderLine[];
  className: string;
};

function getPage7CssNumber(element: Element | null, property: string, fallback: number): number {
  if (!element) {
    return fallback;
  }

  const styles = getComputedStyle(element);
  return Number.parseFloat(styles.getPropertyValue(property)) || fallback;
}

function measureLetterPadding(primaryElement: HTMLElement, letterIndex: number): number {
  const primaryLeft = primaryElement.getBoundingClientRect().left;
  const walker = document.createTreeWalker(primaryElement, NodeFilter.SHOW_TEXT);

  let textNode: Text | null = null;
  let charIndex = 0;
  let letterCount = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const content = node.textContent ?? '';

    for (let index = 0; index < content.length; index += 1) {
      if (!/[A-Za-z]/.test(content[index])) {
        continue;
      }

      letterCount += 1;
      if (letterCount === letterIndex) {
        textNode = node;
        charIndex = index;
        break;
      }
    }

    if (textNode) {
      break;
    }
  }

  if (!textNode) {
    return primaryElement.getBoundingClientRect().width;
  }

  const range = document.createRange();
  range.setStart(textNode, charIndex);
  range.setEnd(textNode, charIndex + 1);

  return range.getBoundingClientRect().left - primaryLeft;
}

function findSecondWordSecondLetterIndex(fullText: string, prefixLength: number): number {
  let wordIndex = -1;
  let inWord = false;
  let letterInWord = 0;

  for (let index = 0; index < fullText.length; index += 1) {
    const charOffset = index + 1;

    if (charOffset <= prefixLength) {
      continue;
    }

    const character = fullText[index];

    if (/\s/u.test(character)) {
      if (inWord) {
        inWord = false;
      }
      continue;
    }

    if (!inWord) {
      inWord = true;
      wordIndex += 1;
      letterInWord = 0;
    }

    if (!/[A-Za-z]/u.test(character)) {
      continue;
    }

    letterInWord += 1;
    if (wordIndex === 1 && letterInWord === 2) {
      return charOffset;
    }
  }

  return prefixLength + 2;
}

function measurePaddingAtCharIndex(
  primaryElement: HTMLElement,
  targetCharIndex: number,
): number {
  const primaryLeft = primaryElement.getBoundingClientRect().left;
  const walker = document.createTreeWalker(primaryElement, NodeFilter.SHOW_TEXT);
  let charOffset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const content = node.textContent ?? '';

    for (let index = 0; index < content.length; index += 1) {
      charOffset += 1;

      if (charOffset === targetCharIndex) {
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + 1);
        return range.getBoundingClientRect().left - primaryLeft;
      }
    }
  }

  return measureLetterPadding(primaryElement, 2);
}

function measureNumberedSecondLinePadding(primaryElement: HTMLElement): number {
  const fullText = primaryElement.textContent ?? '';
  const prefixMatch = fullText.match(/^(\d+\s*-\s*)/);
  const prefixLength = prefixMatch?.[0].length ?? 0;
  const page7 = primaryElement.closest('.page7');
  const leftShift = getPage7CssNumber(page7, '--page7-numbered-hang-left-shift', 16);
  const minChars = getPage7CssNumber(page7, '--page7-numbered-hang-min-chars', 8);
  const anchorIndex = findSecondWordSecondLetterIndex(fullText, prefixLength);
  const targetCharIndex = Math.max(minChars, anchorIndex - leftShift);

  return measurePaddingAtCharIndex(primaryElement, targetCharIndex);
}

function getBasePrimaryPadding(primaryElement: HTMLElement): number {
  return Number.parseFloat(getComputedStyle(primaryElement).paddingLeft) || 0;
}

function resetPrimaryLineStyles(primaryElement: HTMLElement): void {
  primaryElement.style.paddingLeft = '';
  primaryElement.style.textIndent = '';
}

function applyNumberedPrimaryHangIndent(primaryElement: HTMLElement, hangColumn: number): void {
  const basePadding = getBasePrimaryPadding(primaryElement);
  const hangOffset = hangColumn - basePadding;

  if (hangOffset <= 0) {
    resetPrimaryLineStyles(primaryElement);
    return;
  }

  primaryElement.style.paddingLeft = `${hangColumn}px`;
  primaryElement.style.textIndent = `${-hangOffset}px`;
}

function alignLines(container: HTMLElement): void {
  let currentPrimary: HTMLElement | null = null;
  let currentNumberedHangColumn: number | null = null;

  for (const child of container.children) {
    if (!(child instanceof HTMLElement)) {
      continue;
    }

    if (child.dataset.page7Line === 'primary') {
      currentPrimary = child;
      currentNumberedHangColumn = null;
      resetPrimaryLineStyles(child);

      if (child.dataset.page7Numbered === 'true') {
        const hangColumn = Math.max(
          getBasePrimaryPadding(child),
          measureNumberedSecondLinePadding(child),
        );
        applyNumberedPrimaryHangIndent(child, hangColumn);
        currentNumberedHangColumn = hangColumn;
      }

      continue;
    }

    if (child.dataset.page7Line === 'continuation' && currentPrimary) {
      if (currentNumberedHangColumn !== null) {
        child.style.paddingLeft = `${currentNumberedHangColumn}px`;
        continue;
      }

      child.style.paddingLeft = `${measureLetterPadding(currentPrimary, 2)}px`;
    }
  }
}

export function Page7AlignedPre({ lines, className }: Page7AlignedPreProps) {
  const containerRef = useRef<HTMLPreElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const updateAlignment = () => {
      alignLines(container);
    };

    updateAlignment();

    const observer = new ResizeObserver(updateAlignment);
    observer.observe(container);

    window.addEventListener('resize', updateAlignment);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateAlignment);
    };
  }, [lines]);

  return (
    <pre ref={containerRef} className={className}>
      {lines.map((line, index) => {
        if (line.kind === 'blank') {
          return '\n';
        }

        if (line.kind === 'primary') {
          return (
            <span
              key={index}
              data-page7-line="primary"
              data-page7-numbered={line.number ? 'true' : undefined}
              className="page7__summary-line page7__summary-line--primary page7__hierarchy-line page7__hierarchy-line--primary"
            >
              {line.number ? (
                <span className="page7__summary-number">{line.number}</span>
              ) : null}
              {line.separator}
              {line.text}
              {'\n'}
            </span>
          );
        }

        return (
          <span
            key={index}
            data-page7-line="continuation"
            className="page7__summary-line page7__summary-line--continuation page7__hierarchy-line page7__hierarchy-line--continuation"
          >
            {line.text}
            {'\n'}
          </span>
        );
      })}
    </pre>
  );
}
