import { createHash } from 'node:crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  GoogleAICacheManager,
  type CachedContent,
} from '@google/generative-ai/server';

type CacheEntry = {
  content: CachedContent;
  expiresAt: number;
};

const cacheStore = new Map<string, CacheEntry>();

const GEMINI_REQUEST_TIMEOUT_MS = 20_000;

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${GEMINI_REQUEST_TIMEOUT_MS / 1000}s`));
    }, GEMINI_REQUEST_TIMEOUT_MS);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

function hashInstructions(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}

function isContextCacheEnabled(): boolean {
  return process.env.GEMINI_CONTEXT_CACHE !== 'false';
}

async function generatePlain(
  apiKey: string,
  modelName: string,
  userPrompt: string,
  systemInstructions: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemInstructions,
  });

  const result = await withTimeout(
    model.generateContent(userPrompt),
    'Gemini request'
  );
  const text = result.response.text();

  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return text;
}

async function getOrCreateCache(
  apiKey: string,
  modelName: string,
  systemInstructions: string
): Promise<CachedContent> {
  const cacheKey = `${modelName}:${hashInstructions(systemInstructions)}`;
  const existing = cacheStore.get(cacheKey);

  if (existing && existing.expiresAt > Date.now()) {
    return existing.content;
  }

  const manager = new GoogleAICacheManager(apiKey);
  const created = await manager.create({
    model: modelName,
    displayName: 'max-lit-system-instructions',
    systemInstruction: systemInstructions,
    contents: [{ role: 'user', parts: [{ text: 'Initialize mAZ context.' }] }],
    ttlSeconds: 3600,
  });

  if (!created.name) {
    throw new Error('Gemini cache creation returned no cache name');
  }

  const content = created;
  cacheStore.set(cacheKey, {
    content,
    expiresAt: Date.now() + 55 * 60 * 1000,
  });

  return content;
}

export async function generateGeminiResponse(
  apiKey: string,
  modelName: string,
  userPrompt: string,
  systemInstructions: string
): Promise<string> {
  const shouldCache =
    isContextCacheEnabled() && systemInstructions.trim().length >= 500;

  if (!shouldCache) {
    return generatePlain(apiKey, modelName, userPrompt, systemInstructions);
  }

  try {
    const cachedContent = await getOrCreateCache(apiKey, modelName, systemInstructions);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModelFromCachedContent(cachedContent, {
      model: modelName,
    });

    const result = await withTimeout(
    model.generateContent(userPrompt),
    'Gemini request'
  );
    const text = result.response.text();

    if (!text) {
      throw new Error('Gemini returned an empty response');
    }

    return text;
  } catch {
    return generatePlain(apiKey, modelName, userPrompt, systemInstructions);
  }
}
