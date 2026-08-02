export default function TestPage() {
  return (
    <div style={{ padding: '50px' }}>
      <h1>Env Test</h1>
      <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Loaded ✅" : "Missing ❌"}</p>
      <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Loaded ✅" : "Missing ❌"}</p>
    </div>
  )
}
