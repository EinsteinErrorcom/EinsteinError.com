import { AI_PROVIDERS, type AIProvider } from './types';

export function getActiveProvider(): AIProvider {
  const configured = process.env.AI_PROVIDER?.toLowerCase().trim();

  if (configured && AI_PROVIDERS.includes(configured as AIProvider)) {
    return configured as AIProvider;
  }

  return 'gemini';
}

export function getProviderModel(provider: AIProvider): string {
  const override = process.env.AI_MODEL?.trim();
  if (override) {
    return override;
  }

  switch (provider) {
    case 'gemini':
      return 'gemini-flash-latest';
    case 'openai':
      return 'gpt-4o-mini';
    case 'anthropic':
      return 'claude-3-5-haiku-20241022';
    case 'grok':
      return 'grok-2-latest';
  }
}
