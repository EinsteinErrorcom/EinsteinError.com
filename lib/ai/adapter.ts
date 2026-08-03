import { getActiveProvider } from './config';
import { generateDevMockResponse, isDevMockFallbackEnabled } from './dev-mock';
import { isGeminiConfigError, isGeminiQuotaError } from './gemini-billing-help';
import { anthropicAdapter } from './providers/anthropic';
import { geminiAdapter } from './providers/gemini';
import { grokAdapter, openaiAdapter } from './providers/openai-compatible';
import { MASTER_SYSTEM_INSTRUCTIONS } from './system-instructions';
import type { AIProvider, AIProviderAdapter } from './types';

export class AIAdapterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIAdapterError';
  }
}

/** @deprecated Use AIAdapterError */
export { AIAdapterError as GeminiAdapterError };

const PROVIDER_REGISTRY: Record<AIProvider, AIProviderAdapter> = {
  gemini: geminiAdapter,
  openai: openaiAdapter,
  anthropic: anthropicAdapter,
  grok: grokAdapter,
};

function getProviderAdapter(provider: AIProvider): AIProviderAdapter {
  return PROVIDER_REGISTRY[provider];
}

function shouldUseDevMockFallback(message: string): boolean {
  return (
    isGeminiQuotaError(message) ||
    isGeminiConfigError(message) ||
    message.includes('rate limit') ||
    message.includes('free-tier') ||
    message.includes('timed out')
  );
}

export async function processPrompt(userPrompt: string): Promise<string> {
  const provider = getActiveProvider();
  const adapter = getProviderAdapter(provider);

  try {
    return await adapter.generateResponse(userPrompt, MASTER_SYSTEM_INSTRUCTIONS);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : `${provider} request failed`;

    if (isDevMockFallbackEnabled() && shouldUseDevMockFallback(message)) {
      return generateDevMockResponse(userPrompt);
    }

    throw new AIAdapterError(message);
  }
}

export function getConfiguredProvider(): AIProvider {
  return getActiveProvider();
}
