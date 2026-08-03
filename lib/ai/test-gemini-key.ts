const DEFAULT_MODEL = 'gemini-flash-latest';

export async function testGeminiApiKey(apiKey: string, model = DEFAULT_MODEL) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Reply with exactly: ok' }] }],
      }),
      cache: 'no-store',
    }
  );

  const body = await res.text();

  if (res.ok) {
    return { ok: true as const, status: res.status, message: `Gemini OK (${model})` };
  }

  try {
    const parsed = JSON.parse(body) as { error?: { message?: string } };
    return {
      ok: false as const,
      status: res.status,
      message: parsed.error?.message ?? body.slice(0, 240),
    };
  } catch {
    return {
      ok: false as const,
      status: res.status,
      message: body.slice(0, 240),
    };
  }
}
