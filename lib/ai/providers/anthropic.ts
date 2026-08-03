import { getProviderModel } from '../config';
import type { AIProviderAdapter } from '../types';

export const anthropicAdapter: AIProviderAdapter = {
  name: 'anthropic',

  async generateResponse(userPrompt, systemInstructions) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: getProviderModel('anthropic'),
        max_tokens: 4096,
        system: systemInstructions,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        body?.error?.message ??
        body?.message ??
        `Anthropic request failed (${res.status})`;
      throw new Error(message);
    }

    const textBlock = body?.content?.find(
      (block: { type?: string; text?: string }) => block.type === 'text'
    );

    if (!textBlock?.text) {
      throw new Error('Anthropic returned an empty response');
    }

    return textBlock.text;
  },
};
