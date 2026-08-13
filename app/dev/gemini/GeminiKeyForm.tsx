'use client';

import { useState } from 'react';

type Props = {
  initialOk: boolean;
  initialMessage: string;
};

export default function GeminiKeyForm({ initialOk, initialMessage }: Props) {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState(initialOk ? 'Gemini is working.' : initialMessage);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(initialOk);

  const saveKey = async () => {
    if (!apiKey.trim() || loading) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/dev/gemini-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };

      if (!res.ok) {
        setOk(false);
        setStatus(data.error ?? 'Key test failed');
        return;
      }

      setOk(true);
      setStatus(data.message ?? 'Gemini key saved.');
      setApiKey('');
    } catch {
      setOk(false);
      setStatus('Could not save key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-[#B89047] p-4 bg-black/20">
      <h2 className="text-lg font-semibold text-[#B89047]">Paste a working Gemini key</h2>
      <p className="text-sm text-gray-300">
        Create one at Google AI Studio using <strong>Create in new project</strong> (not the
        depleted MAX-LIT project). Paste it here — takes effect immediately, no restart needed.
      </p>

      <div
        className={`rounded border p-3 text-sm ${
          ok ? 'border-green-500 text-green-200' : 'border-red-500 text-red-200'
        }`}
      >
        {status}
      </div>

      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Paste GEMINI_API_KEY here (AQ... or AIza...)"
        className="w-full rounded bg-[#161b22] border border-[#B89047] p-3 text-white"
      />

      <button
        type="button"
        onClick={() => void saveKey()}
        disabled={loading || !apiKey.trim()}
        className="w-full rounded bg-[#00FFFF] text-black font-bold p-3 disabled:opacity-50"
      >
        {loading ? 'Testing key...' : 'Save and activate key'}
      </button>
    </div>
  );
}
