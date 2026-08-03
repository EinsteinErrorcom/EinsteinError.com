import { config } from 'dotenv';
import { resolve } from 'node:path';

config({ path: resolve(process.cwd(), '.env.local') });

const keys = (process.env.GEMINI_API_KEY ?? '')
  .split(',')
  .map((key) => key.trim())
  .filter(Boolean);

if (keys.length === 0) {
  console.error('No GEMINI_API_KEY in .env.local');
  process.exit(1);
}

const model = process.env.AI_MODEL?.trim() || 'gemini-flash-latest';

for (const [index, key] of keys.entries()) {
  const label = keys.length > 1 ? `Key ${index + 1}` : 'Key';
  const prefix = key.startsWith('AQ.')
    ? 'AQ auth'
    : key.startsWith('AIza')
      ? 'AIza standard'
      : 'unknown format';

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Reply with exactly: ok' }] }],
      }),
    }
  );

  const body = await res.text();

  if (res.ok) {
    console.log(`${label} (${prefix}): OK`);
    process.exit(0);
  }

  console.error(`${label} (${prefix}): HTTP ${res.status}`);
  console.error(body.slice(0, 300));
}

console.error('\nAll Gemini keys failed. Create a new key: https://aistudio.google.com/apikey');
process.exit(1);
