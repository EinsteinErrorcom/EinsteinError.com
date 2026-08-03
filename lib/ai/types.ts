export const AI_PROVIDERS = ['gemini', 'openai', 'anthropic', 'grok'] as const;

export type AIProvider = (typeof AI_PROVIDERS)[number];

export interface AIProviderAdapter {
  readonly name: AIProvider;
  generateResponse(userPrompt: string, systemInstructions: string): Promise<string>;
}
