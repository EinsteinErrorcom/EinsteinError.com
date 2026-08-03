import { notFound } from 'next/navigation';

export default function TestPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <div style={{ padding: '50px' }}>
      <h1>Env Test (dev only)</h1>
      <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Loaded ✅' : 'Missing ❌'}</p>
      <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Loaded ✅' : 'Missing ❌'}</p>
      <p>Server AI key: never exposed to the client — check Vercel env only.</p>
    </div>
  );
}
