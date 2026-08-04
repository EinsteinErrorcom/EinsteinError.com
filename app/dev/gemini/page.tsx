import Link from 'next/link';
import { CHAT_PATH } from '@/lib/trial-gate';
import { GEMINI_QUOTA_FIX_STEPS } from '@/lib/ai/gemini-billing-help';
import { getGeminiApiKeys } from '@/lib/ai/gemini-keys';
import { testGeminiApiKey } from '@/lib/ai/test-gemini-key';
import GeminiKeyForm from './GeminiKeyForm';

export const dynamic = 'force-dynamic';

async function checkConfiguredKeys() {
  const keys = getGeminiApiKeys();

  if (keys.length === 0) {
    return {
      ok: false,
      message: 'No Gemini key configured',
      keyCount: 0,
    };
  }

  for (const key of keys) {
    const result = await testGeminiApiKey(key);
    if (result.ok) {
      return {
        ok: true,
        message: result.message,
        keyCount: keys.length,
      };
    }
  }

  const last = await testGeminiApiKey(keys[0]);
  return {
    ok: false,
    message: last.message,
    keyCount: keys.length,
  };
}

const STEPS = [
  {
    title: 'Step 1 — Create a new API key (different project)',
    body: (
      <>
        <p className="mb-3">
          Your current MAX-LIT project key is out of quota. You need a key from a{' '}
          <strong>different Google Cloud project</strong>.
        </p>
        <ol className="list-decimal list-inside space-y-2 mb-3">
          <li>
            Open{' '}
            <a
              className="text-[#00FFFF] underline font-semibold"
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
            >
              Google AI Studio → API Keys
            </a>
          </li>
          <li>
            Click <strong>Create API key</strong>
          </li>
          <li>
            Choose <strong>Default Gemini Project</strong> or{' '}
            <strong>Create API key in new project</strong>
          </li>
          <li>
            Do <strong>not</strong> reuse the depleted MAX-LIT project
          </li>
          <li>Copy the key (starts with <code>AIza...</code> or <code>AQ...</code>)</li>
        </ol>
        <a
          className="inline-block rounded bg-[#00FFFF] text-black font-bold px-4 py-2"
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noreferrer"
        >
          Open API Keys →
        </a>
      </>
    ),
  },
  {
    title: 'Step 2 — Paste the key here (do this now)',
    body: (
      <>
        <p className="mb-3">
          Paste the key below. The app will test it and save it to{' '}
          <code>.env.local</code> automatically — no manual editing needed.
        </p>
      </>
    ),
    showForm: true,
  },
  {
    title: 'Step 3 — Only if Step 1 key still fails',
    body: (
      <>
        <p className="mb-3">
          If AI Studio shows prepay as unavailable, link billing in Google Cloud instead:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Open{' '}
            <a
              className="text-[#00FFFF] underline"
              href="https://console.cloud.google.com/billing"
              target="_blank"
              rel="noreferrer"
            >
              Google Cloud Console → Billing
            </a>
          </li>
          <li>Link a billing account to your new Gemini project</li>
          <li>Create a fresh API key in that project and paste it in Step 2</li>
        </ol>
      </>
    ),
  },
  {
    title: 'Step 4 — Alternative: use a different AI provider',
    body: (
      <>
        <p className="mb-3">Skip Gemini entirely. In <code>.env.local</code> set:</p>
        <pre className="rounded bg-black/40 p-3 text-sm text-[#00FFFF] overflow-x-auto">
{`AI_PROVIDER=openai
OPENAI_API_KEY=sk-...`}
        </pre>
        <p className="mt-3 text-sm">
          Also works with <code>anthropic</code> + <code>ANTHROPIC_API_KEY</code> or{' '}
          <code>grok</code> + <code>XAI_API_KEY</code>.
        </p>
      </>
    ),
  },
];

export default async function DevGeminiPage() {
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
    return (
      <main className="min-h-screen bg-[#0d1117] text-white p-8">
        <p>Not available in production.</p>
      </main>
    );
  }

  const result = await checkConfiguredKeys();
  const mockEnabled = process.env.AI_DEV_MOCK_FALLBACK === 'true';

  return (
    <main className="min-h-screen bg-[#0d1117] text-white p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#C5A059]">Fix Gemini chat — step by step</h1>

      <div
        className={`rounded-lg border p-4 ${
          result.ok ? 'border-green-500 bg-green-950/30' : 'border-red-500 bg-red-950/30'
        }`}
      >
        <p className="font-semibold">
          {result.ok ? '✓ Gemini is working' : '✗ Current key is NOT working'}
        </p>
        <p className="mt-2 text-sm text-gray-300">{result.message}</p>
        <p className="mt-2 text-xs text-gray-400">Configured keys: {result.keyCount}</p>
      </div>

      {!result.ok && mockEnabled && (
        <div className="rounded-lg border border-blue-500 bg-blue-950/20 p-4 text-sm">
          <p className="font-semibold text-blue-200">Temporary: chat works in dev mock mode</p>
          <p className="mt-2 text-gray-300">
            Placeholder responses are enabled so you can test the UI while you complete Step 2
            below. Turn off mock mode after a real key works: set{' '}
            <code>AI_DEV_MOCK_FALLBACK=false</code> in .env.local.
          </p>
          <Link href={CHAT_PATH} className="mt-3 inline-block text-[#00FFFF] underline font-semibold">
            Open chat now →
          </Link>
        </div>
      )}

      {!result.ok && (
        <div className="rounded-lg border border-yellow-500 bg-yellow-950/20 p-4 text-sm text-yellow-100">
          <p className="font-semibold">Why the old key failed</p>
          <p className="mt-2">
            HTTP 429 — prepayment credits depleted on the MAX-LIT Google project. AI Studio
            prepay is not available on all billing accounts, so the fix is a key from a{' '}
            <strong>new project</strong>, not more credits on the old one.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {STEPS.map((step, index) => (
          <section
            key={step.title}
            className="rounded-lg border border-[#C5A059]/40 p-5 bg-black/20"
          >
            <h2 className="text-lg font-bold text-[#C5A059] mb-3">
              {index + 1}. {step.title.replace(/^Step \d+ — /, '')}
            </h2>
            {step.body}
            {step.showForm && (
              <GeminiKeyForm initialOk={result.ok} initialMessage={result.message} />
            )}
          </section>
        ))}
      </div>

      {result.ok && (
        <div className="rounded-lg border border-green-500 p-4 text-green-200">
          <p className="font-semibold">All set!</p>
          <p className="mt-2 text-sm">
            Set <code>AI_DEV_MOCK_FALLBACK=false</code> in .env.local and restart the dev server
            to use real Gemini responses only.
          </p>
        </div>
      )}

      <p className="text-sm pt-4 border-t border-gray-700">
        <Link href={CHAT_PATH} className="text-[#00FFFF] underline">
          Open chat
        </Link>
      </p>
    </main>
  );
}
