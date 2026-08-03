export function isGeminiRateLimitError(message: string): boolean {
  return (
    message.includes('429') ||
    message.includes('Too Many Requests') ||
    message.includes('RESOURCE_EXHAUSTED') ||
    message.includes('exceeded your current quota') ||
    message.includes('rate limit') ||
    message.includes('rate-limits')
  );
}
