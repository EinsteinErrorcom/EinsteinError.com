import fs from 'fs';
import path from 'path';

const PAGE8_IMAGE_DIR = path.join(process.cwd(), 'public/page8');
const IMAGE_PATTERN = /\.(png|jpe?g|gif|webp)$/i;

function imageSortKey(filename: string): number {
  const match = filename.match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
}

/** Image filenames in numeric order (1.png, 2.png, … 10.png, …). */
export function listPage8Images(): string[] {
  if (!fs.existsSync(PAGE8_IMAGE_DIR)) {
    return [];
  }

  return fs
    .readdirSync(PAGE8_IMAGE_DIR)
    .filter((name) => IMAGE_PATTERN.test(name))
    .sort((a, b) => {
      const diff = imageSortKey(a) - imageSortKey(b);
      return diff !== 0 ? diff : a.localeCompare(b);
    });
}
