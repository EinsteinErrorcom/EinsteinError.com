import fs from 'fs';
import path from 'path';

const PAGE7_NUMBERS_PATH = path.join(process.cwd(), 'content/page7-numbers.txt');

export function loadPage7Numbers(): string[] {
  if (!fs.existsSync(PAGE7_NUMBERS_PATH)) {
    return [];
  }

  return fs
    .readFileSync(PAGE7_NUMBERS_PATH, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
