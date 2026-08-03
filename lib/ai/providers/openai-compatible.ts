import { getProviderModel } from '../config';
import type { AIProviderAdapter } from '../types';

async function parseOpenAICompatibleResponse(res: Response, providerLabel: string) {
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      body?.error?.message ??
      body?.message ??
      `${providerLabel} request failed (${res.status})`;
    throw new Error(message);
  }

  const text = body?.choices?.[0]?.message?.content;
  if (!text || typeof text !== 'string') {
    throw new Error(`${providerLabel} returned an empty response`);
  }

  return text;
}

export const openaiAdapter: AIProviderAdapter = {
  name: 'openai',

  async generateResponse(userPrompt, systemInstructions) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: getProviderModel('openai'),
        messages: [
          { role: 'system', content: systemInstructions },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    return parseOpenAICompatibleResponse(res, 'OpenAI');
  },
};

export const grokAdapter: AIProviderAdapter = {
  name: 'grok',

  async generateResponse(userPrompt, systemInstructions) {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      throw new Error('XAI_API_KEY is not configured');
    }

    const res = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: getProviderModel('grok'),
        messages: [
          { role: 'system', content: systemInstructions },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    return parseOpenAICompatibleResponse(res, 'Grok');
  },
};
