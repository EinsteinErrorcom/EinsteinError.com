import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const PAGE7_PATH = resolve(process.cwd(), 'content/page7.txt');

function isDevRouteAllowed() {
  return process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV !== 'production';
}

const saveBodySchema = z.object({
  content: z.string(),
});

export async function GET() {
  if (!isDevRouteAllowed()) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  const content = readFileSync(PAGE7_PATH, 'utf8').replace(/\r\n/g, '\n');
  return NextResponse.json({ content });
}

export async function POST(req: Request) {
  if (!isDevRouteAllowed()) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  let body: z.infer<typeof saveBodySchema>;
  try {
    body = saveBodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  writeFileSync(PAGE7_PATH, body.content.replace(/\r\n/g, '\n'), 'utf8');

  return NextResponse.json({ ok: true });
}
