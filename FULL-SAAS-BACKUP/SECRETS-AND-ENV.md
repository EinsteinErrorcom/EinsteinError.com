# Environment Variables & Secrets

**Never commit real values to GitHub.** Store them in Vercel, `.env.local` (local only), and a password manager.

---

## Required for Production (Vercel)

| Variable | Where to get it | Used for |
|----------|-----------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | Auth, database |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public | Client auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role | Webhooks, purchases API, admin |
| `NEXT_PUBLIC_SITE_URL` | Set to `https://www.einsteinerror.com` | OAuth redirects |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google Cloud → Credentials → OAuth Web client | Google Sign-In button |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys → Secret | Server payments |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys → Publishable | Checkout UI |
| `STRIPE_WEBHOOK_SIGNING_SECRET` | Stripe → Webhooks → endpoint → Signing secret | Payment fulfillment |
| `GEMINI_API_KEY` | Google AI Studio → API keys | AI chat |
| `AI_PROVIDER` | Set to `gemini` | AI adapter |
| `GEMINI_CONTEXT_CACHE` | Set to `true` | Reduce token cost |
| `CHAT_RATE_LIMIT_PER_HOUR` | e.g. `20` | Abuse prevention |

---

## Local dev only (`.env.local`)

Same as production, plus optional overrides:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# AI_DEV_MOCK_FALLBACK=true   # optional: mock chat without Gemini quota
```

**Minimum to fix Purchases locally:** `SUPABASE_SERVICE_ROLE_KEY`

---

## Optional AI provider keys (if switching `AI_PROVIDER`)

| Variable | Provider |
|----------|----------|
| `OPENAI_API_KEY` | OpenAI |
| `ANTHROPIC_API_KEY` | Anthropic |
| `XAI_API_KEY` | xAI (Grok) |

---

## Legacy names — do NOT use in Vercel

| Old name | Use instead |
|----------|-------------|
| `SUPABASE_URL` | `NEXT_PUBLIC_SUPABASE_URL` |
| `SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `STRIPE_WEBHOOK_SECRET` | `STRIPE_WEBHOOK_SIGNING_SECRET` |

Code accepts legacy Supabase names as server fallback only.

---

## Google OAuth Client Secret

**Not an env var in this app** — stored in Supabase Dashboard:

Supabase → Authentication → Providers → Google → Client Secret

Copy from Google Cloud → Credentials → same Web client as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

---

## How to back up secrets safely

1. **Vercel:** Settings → Environment Variables → copy each value to 1Password / Bitwarden / encrypted note
2. **Supabase:** Settings → API → save URL, anon key, service_role key
3. **Stripe:** Developers → API keys + webhook signing secret
4. **Google:** Cloud Console → Credentials → Client ID + Client Secret
5. **Gemini:** AI Studio → API keys

**Never paste secrets in chat, email, or GitHub issues.**

---

## Template file

Copy `FULL-SAAS-BACKUP/templates/.env.example` to project root as `.env.local` and fill in values.
