import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NextResponse } from 'next/server';
import { getRuntimeGeminiKeyPath } from '@/lib/ai/gemini-runtime-key';
import { testGeminiApiKey } from '@/lib/ai/test-gemini-key';

function isDevRouteAllowed() {
  return process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV !== 'production';
}

function upsertEnvLine(content: string, key: string, value: string): string {
  const pattern = new RegExp(`^${key}=.*$`, 'm');
  const line = `${key}=${value}`;

  if (pattern.test(content)) {
    return content.replace(pattern, line);
  }

  return `${content.trimEnd()}\n${line}\n`;
}

function saveGeminiKey(apiKey: string) {
  writeFileSync(getRuntimeGeminiKeyPath(), `${apiKey.trim()}\n`, 'utf8');

  const envPath = resolve(process.cwd(), '.env.local');
  if (existsSync(envPath)) {
    const current = readFileSync(envPath, 'utf8');
    let updated = upsertEnvLine(current, 'GEMINI_API_KEY', apiKey.trim());
    updated = upsertEnvLine(updated, 'AI_DEV_MOCK_FALLBACK', 'false');
    writeFileSync(envPath, updated, 'utf8');
  }
}

export async function POST(req: Request) {
  if (!isDevRouteAllowed()) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  let apiKey = '';
  try {
    const body = (await req.json()) as { apiKey?: string };
    apiKey = body.apiKey?.trim() ?? '';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'apiKey is required' }, { status: 400 });
  }

  const test = await testGeminiApiKey(apiKey);
  if (!test.ok) {
    return NextResponse.json(
      { error: test.message, status: test.status },
      { status: 400 }
    );
  }

  saveGeminiKey(apiKey);

  return NextResponse.json({
    ok: true,
    message: 'Gemini key saved and active immediately. Mock mode disabled.',
  });
}

export async function GET() {
  if (!isDevRouteAllowed()) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  const keys = [
    ...(existsSync(getRuntimeGeminiKeyPath())
      ? [readFileSync(getRuntimeGeminiKeyPath(), 'utf8').trim()]
      : []),
    ...(process.env.GEMINI_API_KEY ?? '')
      .split(',')
      .map((key) => key.trim())
      .filter(Boolean),
  ];

  const uniqueKeys = [...new Set(keys.filter(Boolean))];
  if (uniqueKeys.length === 0) {
    return NextResponse.json({ ok: false, message: 'No Gemini key configured' });
  }

  for (const key of uniqueKeys) {
    const test = await testGeminiApiKey(key);
    if (test.ok) {
      return NextResponse.json({ ok: true, message: test.message, keyCount: uniqueKeys.length });
    }
  }

  const last = await testGeminiApiKey(uniqueKeys[0]);
  return NextResponse.json({
    ok: false,
    message: last.message,
    keyCount: uniqueKeys.length,
  });
}
