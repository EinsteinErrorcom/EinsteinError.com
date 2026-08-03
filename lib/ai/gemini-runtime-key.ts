import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const RUNTIME_KEY_FILE = '.gemini-key.local';

export function getRuntimeGeminiKey(): string | null {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const path = resolve(process.cwd(), RUNTIME_KEY_FILE);
  if (!existsSync(path)) {
    return null;
  }

  const value = readFileSync(path, 'utf8').trim();
  return value || null;
}

export function getRuntimeGeminiKeyPath(): string {
  return resolve(process.cwd(), RUNTIME_KEY_FILE);
}
