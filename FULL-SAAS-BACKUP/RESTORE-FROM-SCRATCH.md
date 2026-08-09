# Restore zzzbestmaxlit From Scratch

Complete checklist to rebuild MAX-LIT if the project, Vercel, or Supabase is lost.

---

## Phase 1 — Recover source code

### Option A: GitHub (preferred)
```bash
git clone https://github.com/EinsteinErrorcom/EinsteinError.com.git zzzbestmaxlit
cd zzzbestmaxlit
git checkout main
# Or pin to a known tag:
# git checkout restore-2026-08-04
```

### Option B: Local snapshot
```bash
cd FULL-SAAS-BACKUP/snapshots
tar -xzf zzzbestmaxlit-*.tar.gz
cd zzzbestmaxlit-*
npm install
```

---

## Phase 2 — Node.js environment

**Requirements:** Node.js 20+ (LTS recommended), npm 10+

```bash
npm install
npm run build    # must succeed before deploy
```

---

## Phase 3 — Supabase (database + auth)

1. Create a new Supabase project (or use existing): https://supabase.com/dashboard
2. Note from **Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (server only, never client)

3. Run migrations **in this exact order** (see `DATABASE.md`):
   - `20260720152500_grant_profiles_access.sql`
   - `20260720160000_deny_by_default_rls.sql`
   - `20260802120000_chat_rate_limits.sql`
   - `20260803160000_truth_counter.sql`
   - `20260804140000_grant_profiles_service_role.sql`
   - `20260806190000_get_subscribed_purchases.sql`

4. **Authentication → Providers → Google**
   - Enable Google
   - Client ID: from Google Cloud (see `SECRETS-AND-ENV.md`)
   - Client Secret: from same Google OAuth Web client

5. **Authentication → URL Configuration**
   - Site URL: `https://www.einsteinerror.com`
   - Redirect URLs (add all):
     - `http://localhost:3000/auth/callback`
     - `https://www.einsteinerror.com/auth/callback`
     - `https://www.einsteingravity.com/auth/callback`
     - `https://zzzbestmaxlit.vercel.app/auth/callback`

6. Ensure `profiles` table exists with columns used by the app:
   - `id`, `is_subscribed`, `trial_start_at`, `trial_end_at`, etc.
   (Created by your original Supabase setup; migrations grant access.)

---

## Phase 4 — Google OAuth

Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Web client:

**Authorized JavaScript origins:**
- `http://localhost:3000`
- `https://www.einsteinerror.com`
- `https://einsteinerror.com`
- `https://www.einsteingravity.com`
- `https://einsteingravity.com`
- `https://zzzbestmaxlit.vercel.app`

**Authorized redirect URIs:**
- `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

---

## Phase 5 — Stripe

See `STRIPE-AND-PAYMENTS.md` for price IDs and webhook setup.

1. Stripe Dashboard → Developers → API keys
2. Create webhook endpoint: `https://www.einsteinerror.com/api/stripe/webhook`
3. Events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy signing secret → `STRIPE_WEBHOOK_SIGNING_SECRET` in Vercel

If using **existing** Stripe products (recommended), price IDs are already in `lib/stripe/pricing.ts`.

---

## Phase 6 — Vercel deploy

1. Import repo: https://vercel.com/new → GitHub → `EinsteinError.com`
2. Framework: Next.js (auto-detected)
3. Add **all** env vars from `SECRETS-AND-ENV.md` for Production + Preview
4. Domains:
   - `www.einsteinerror.com` (primary)
   - `www.einsteingravity.com` (alias)
5. Deploy → verify HTTP 200 on both domains

---

## Phase 7 — Local dev

```bash
cp FULL-SAAS-BACKUP/templates/.env.example .env.local
# Fill every value — see SECRETS-AND-ENV.md
npm run dev
# Open http://localhost:3000
```

Test:
- [ ] Home page loads
- [ ] Google sign-in works
- [ ] Truth counter shows a number
- [ ] Purchases text box loads (needs `SUPABASE_SERVICE_ROLE_KEY` locally)
- [ ] Chat works after sign-in (needs `GEMINI_API_KEY`)
- [ ] Checkout10 Stripe payment form loads

---

## Phase 8 — Post-restore verification

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://www.einsteinerror.com/
curl -s -o /dev/null -w "%{http_code}\n" https://www.einsteingravity.com/
curl -s https://www.einsteinerror.com/api/counter
curl -s https://www.einsteinerror.com/api/get-purchases
```

Expected: both domains `200`; counter returns JSON number; purchases returns JSON array (or 500 if service role missing on that environment).

---

## If only Vercel env vars were lost

1. Vercel → zzzbestmaxlit → Settings → Environment Variables
2. Re-enter every variable from `SECRETS-AND-ENV.md`
3. Deployments → ⋯ → Redeploy (Production)

No code changes needed.

---

## If only local `.env.local` was lost

1. Copy `FULL-SAAS-BACKUP/templates/.env.example` → `.env.local`
2. Fill values from Vercel dashboard or password manager
3. `npm run dev`
