import { getRuntimeGeminiKey } from './gemini-runtime-key';

export function getGeminiApiKeys(): string[] {
  const runtimeKey = getRuntimeGeminiKey();
  const raw = process.env.GEMINI_API_KEY?.trim();
  const envKeys = raw
    ? raw.split(',').map((key) => key.trim()).filter(Boolean)
    : [];

  const ordered = runtimeKey ? [runtimeKey, ...envKeys] : envKeys;
  return [...new Set(ordered)];
}
