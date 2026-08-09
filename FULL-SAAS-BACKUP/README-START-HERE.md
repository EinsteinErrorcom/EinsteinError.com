# FULL SAAS BACKUP — zzzbestmaxlit (MAX-LIT)

**Purpose:** If this project is ever damaged, deleted, or lost, use this folder to **completely and immediately reproduce** the SaaS.

---

## What this folder contains

| Item | Purpose |
|------|---------|
| `README-START-HERE.md` | This file — start here |
| `RESTORE-FROM-SCRATCH.md` | Step-by-step rebuild (30–60 min) |
| `SECRETS-AND-ENV.md` | Every environment variable + where to find values |
| `SECRETS-VAULT-CHECKLIST.md` | **Blank form** — fill in offline with all secrets & account info |
| `SUPABASE-DATA-BACKUP.md` | Export/restore live database rows |
| `ARCHITECTURE.md` | Tech stack, routes, folder map, key files |
| `DATABASE.md` | Supabase migrations (run in order) |
| `STRIPE-AND-PAYMENTS.md` | Stripe products, prices, webhooks |
| `EXTERNAL-SERVICES.md` | Links to Vercel, Supabase, Google, Stripe dashboards |
| `RESTORE-POINT.md` | Quick reference (domains, env names, health checks) |
| `templates/.env.example` | Copy to `.env.local` for local dev |
| `reference/` | Stripe CSV, migration SQL copies |
| `export-full-backup.sh` | Script to create a portable code snapshot |
| `export-supabase-data.mjs` | Script to export Supabase table data to JSON |
| `restore-supabase-data.mjs` | Script to restore Supabase data from JSON export |
| `snapshots/` | Generated full backups (copy these off-site) |

---

## Fastest recovery path (recommended)

1. **Clone code from GitHub** (always the live source of truth):
   ```bash
   git clone https://github.com/EinsteinErrorcom/EinsteinError.com.git zzzbestmaxlit
   cd zzzbestmaxlit
   git checkout main
   ```

2. **Restore secrets** — see `SECRETS-AND-ENV.md`. Values live in:
   - Vercel → Project → Settings → Environment Variables
   - Supabase Dashboard → Settings → API
   - Stripe Dashboard → Developers → API keys / Webhooks
   - Google Cloud Console → Credentials

3. **Install and run locally:**
   ```bash
   npm install
   cp FULL-SAAS-BACKUP/templates/.env.example .env.local
   # Fill in .env.local from SECRETS-AND-ENV.md
   npm run dev
   ```

4. **Restore database** — run all migrations in `DATABASE.md` order in Supabase SQL Editor (or `supabase db push`).

5. **Redeploy Vercel** — push to `main` or Redeploy from dashboard.

6. **Verify** — both domains return HTTP 200:
   - https://www.einsteinerror.com
   - https://www.einsteingravity.com

---

## Create a fresh portable backup (do this monthly)

From the project root:

```bash
./FULL-SAAS-BACKUP/export-full-backup.sh
node FULL-SAAS-BACKUP/export-supabase-data.mjs
```

Then fill in or update `SECRETS-VAULT-CHECKLIST.md` (store in password manager, not GitHub).

This writes:
- `FULL-SAAS-BACKUP/snapshots/zzzbestmaxlit-*.tar.gz` — all code + assets
- `FULL-SAAS-BACKUP/snapshots/supabase-data-*/` — database rows (profiles, counter, etc.)

**Copy the `.tar.gz` to at least two places outside this Mac:**
- External USB drive
- iCloud / Google Drive / Dropbox
- Another computer

---

## What is NOT in GitHub (you must save separately)

These are **never committed** to GitHub for security. Store them in a password manager or encrypted backup:

- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SIGNING_SECRET`
- `GEMINI_API_KEY` (and other AI keys)
- Google OAuth **Client Secret** (in Supabase provider settings)
- Full `.env.local` / Vercel env export

**Action:** Export Vercel env vars periodically (Settings → Environment Variables → copy each value to your password manager).

---

## Current known-good state

| Field | Value |
|-------|-------|
| GitHub repo | https://github.com/EinsteinErrorcom/EinsteinError.com |
| Branch | `main` |
| Restore tag | `restore-2026-08-04` |
| Vercel project | https://vercel.com/alwho-9360s-projects/zzzbestmaxlit |
| Primary domain | https://www.einsteinerror.com |
| Alias domain | https://www.einsteingravity.com |

Update this table when you push major releases.

---

## Emergency contacts / accounts

| Service | Dashboard |
|---------|-----------|
| GitHub | https://github.com/EinsteinErrorcom |
| Vercel | https://vercel.com |
| Supabase | https://supabase.com/dashboard |
| Stripe | https://dashboard.stripe.com |
| Google Cloud | https://console.cloud.google.com |
| Google AI Studio | https://aistudio.google.com |

---

## Next step

Read **`RESTORE-FROM-SCRATCH.md`** for the full rebuild checklist.
