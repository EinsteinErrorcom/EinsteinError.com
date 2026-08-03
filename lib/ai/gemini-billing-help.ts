/** User-facing guidance when Gemini returns quota / rate-limit errors. */

export const GEMINI_PREPAY_DEPLETED_MESSAGE =
  'Gemini prepay credits are depleted on this Google project. AI Studio prepay is not available on all billing accounts.';

export const GEMINI_RATE_LIMIT_MESSAGE =
  'Gemini free-tier limit reached (requests or tokens per minute/day). Your key is valid — Google is temporarily blocking more calls.';

export const GEMINI_QUOTA_FIX_STEPS = [
  'Check usage at https://ai.dev/rate-limit — see when limits reset.',
  'Wait 1–60 minutes (rate limits) or until tomorrow (daily free-tier cap), then try again.',
  'Enable billing on your Gemini project: https://console.cloud.google.com/billing — link account 0169AB-0BF2CC-E62896 to the project that owns your API key.',
  'Or paste a fresh key at /dev/gemini from https://aistudio.google.com/apikey (Default Gemini Project).',
  'Or set AI_PROVIDER=openai, anthropic, or grok with the matching API key.',
];

export function formatGeminiQuotaHelp(reason: 'rate-limit' | 'prepay' | 'generic' = 'generic'): string {
  const headline =
    reason === 'prepay'
      ? GEMINI_PREPAY_DEPLETED_MESSAGE
      : reason === 'rate-limit'
        ? GEMINI_RATE_LIMIT_MESSAGE
        : 'Gemini API quota or rate limit exceeded.';

  return `${headline}\n\n${GEMINI_QUOTA_FIX_STEPS.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
}

export function classifyGeminiQuotaError(message: string): 'rate-limit' | 'prepay' | 'generic' {
  if (
    message.includes('prepayment credits') ||
    message.includes('prepay credits')
  ) {
    return 'prepay';
  }

  if (
    message.includes('exceeded your current quota') ||
    message.includes('rate-limits') ||
    message.includes('rate limit') ||
    message.includes('Too Many Requests')
  ) {
    return 'rate-limit';
  }

  return 'generic';
}

export function isGeminiQuotaError(message: string): boolean {
  return (
    message.includes('429') ||
    message.includes('Too Many Requests') ||
    message.includes('prepayment credits') ||
    message.includes('RESOURCE_EXHAUSTED') ||
    message.includes('quota exhausted') ||
    message.includes('exceeded your current quota') ||
    message.includes('Gemini API quota') ||
    message.includes('Gemini free-tier') ||
    message.includes('Gemini prepay')
  );
}

export function isGeminiConfigError(message: string): boolean {
  return (
    isGeminiQuotaError(message) ||
    message.includes('GEMINI_API_KEY') ||
    message.includes('not configured')
  );
}

export function formatGeminiErrorForChat(message: string): string {
  if (!isGeminiQuotaError(message)) {
    return message;
  }

  const reason = classifyGeminiQuotaError(message);
  const short =
    reason === 'rate-limit'
      ? `${GEMINI_RATE_LIMIT_MESSAGE}\n\nWait a few minutes and try again, or check https://ai.dev/rate-limit`
      : formatGeminiQuotaHelp(reason);

  return short;
}
