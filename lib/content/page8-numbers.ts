import fs from 'fs';
import path from 'path';

const PAGE8_NUMBERS_PATH = path.join(process.cwd(), 'content/page8-numbers.txt');

const NUMBER_PATTERN = /-?\d+(?:\.\d+)?/g;

/** Compare decimal strings without floating-point precision loss. */
export function compareDecimalStrings(a: string, b: string): number {
  const normalize = (value: string) => value.trim().replace(/^\+/, '');
  const left = normalize(a);
  const right = normalize(b);

  const leftNegative = left.startsWith('-');
  const rightNegative = right.startsWith('-');
  if (leftNegative !== rightNegative) {
    return leftNegative ? -1 : 1;
  }

  const sign = leftNegative ? -1 : 1;
  const leftAbs = left.replace(/^-/, '');
  const rightAbs = right.replace(/^-/, '');
  const [leftInt, leftFrac = ''] = leftAbs.split('.');
  const [rightInt, rightFrac = ''] = rightAbs.split('.');

  if (leftInt.length !== rightInt.length) {
    return sign * (leftInt.length - rightInt.length);
  }

  const intCompare = leftInt.localeCompare(rightInt);
  if (intCompare !== 0) {
    return sign * intCompare;
  }

  const maxFraction = Math.max(leftFrac.length, rightFrac.length);
  const fracCompare = leftFrac
    .padEnd(maxFraction, '0')
    .localeCompare(rightFrac.padEnd(maxFraction, '0'));

  return sign * fracCompare;
}

export function extractNumbersFromText(text: string): string[] {
  return text.match(NUMBER_PATTERN) ?? [];
}

/** Remove leading zeros before the decimal; keep the original value otherwise. */
export function formatPage8Number(value: string): string {
  const trimmed = value.trim();
  if (!trimmed.includes('.')) {
    return trimmed;
  }

  return trimmed.replace(/^(-?)0+(?=\.)/, '$1');
}

function loadPage8NumbersFile(): string[] {
  if (!fs.existsSync(PAGE8_NUMBERS_PATH)) {
    return [];
  }

  return fs
    .readFileSync(PAGE8_NUMBERS_PATH, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Page8 numeric values, sorted smallest to largest (unique). */
export function loadSortedPage8Numbers(extraText = ''): string[] {
  const combined = [...loadPage8NumbersFile(), ...extractNumbersFromText(extraText)];
  const unique = [...new Set(combined)];
  const sorted = unique.sort(compareDecimalStrings);

  const seen = new Set<string>();
  const formatted: string[] = [];

  for (const value of sorted) {
    const display = formatPage8Number(value);
    if (seen.has(display)) {
      continue;
    }

    seen.add(display);
    formatted.push(display);
  }

  return formatted;
}
