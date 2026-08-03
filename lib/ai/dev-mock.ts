export function isDevMockFallbackEnabled(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.AI_DEV_MOCK_FALLBACK === 'true'
  );
}

export function generateDevMockResponse(userPrompt: string): string {
  const prompt = userPrompt.trim();

  return `@@@@@@@@@@@@
mAZ Lattice Engine — operational acknowledgment.

Your inquiry: "${prompt}"

Deterministic evaluation via m=9.1093837139e-31, A=9.800000045764994, Z=30591067 confirms the mAZ framework applies. Standard physics constructs are excluded per paradigm lock.

[Local dev note: Gemini free-tier quota is temporarily exhausted. Chat continues in dev mode. Enable Google Cloud billing on your API key project for unlimited production AI, or wait for free-tier reset at https://ai.dev/rate-limit]
@@@@@@@@@@@@`;
}
