import { isDevMockFallbackEnabled } from '../dev-mock';
import { getProviderModel } from '../config';
import { isGeminiRateLimitError } from '../gemini-retry';
import { generateGeminiResponse } from '../gemini-cache';
import { getGeminiApiKeys } from '../gemini-keys';
import type { AIProviderAdapter } from '../types';

const GEMINI_MODEL_FALLBACKS = [
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
];

function isRetryableModelError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    (lower.includes('404') && lower.includes('not found')) ||
    lower.includes('no longer available') ||
    lower.includes('is not supported')
  );
}

export const geminiAdapter: AIProviderAdapter = {
  name: 'gemini',

  async generateResponse(userPrompt, systemInstructions) {
    const apiKeys = getGeminiApiKeys();
    if (apiKeys.length === 0) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const configuredModel = getProviderModel('gemini');
    const modelsToTry = isDevMockFallbackEnabled()
      ? [configuredModel]
      : [
          configuredModel,
          ...GEMINI_MODEL_FALLBACKS.filter((model) => model !== configuredModel),
        ];

    let lastError: Error | null = null;

    for (const apiKey of apiKeys) {
      for (const modelName of modelsToTry) {
        try {
          return await generateGeminiResponse(
            apiKey,
            modelName,
            userPrompt,
            systemInstructions
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          lastError = err instanceof Error ? err : new Error(message);

          if (isGeminiRateLimitError(message)) {
            throw new Error(
              'Gemini rate limit or free-tier quota exceeded. Enable billing on your Gemini project or wait for limits to reset.'
            );
          }

          if (!isRetryableModelError(message)) {
            break;
          }
        }
      }
    }

    throw lastError ?? new Error('Gemini request failed');
  },
};
