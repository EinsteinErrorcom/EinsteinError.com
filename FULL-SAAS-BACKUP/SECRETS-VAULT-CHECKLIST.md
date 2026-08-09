# Secrets Vault Checklist — zzzbestmaxlit

**Fill this in offline.** Store the completed copy in a password manager, encrypted USB, or printed safe — **never in GitHub or chat.**

Date completed: _______________  
Completed by: _______________

---

## 1. GitHub

| Item | Value |
|------|-------|
| Account email | |
| Username / org | EinsteinErrorcom |
| Repo URL | https://github.com/EinsteinErrorcom/EinsteinError.com |
| Default branch | main |
| 2FA recovery codes location | |
| Personal access token (if any) | |

---

## 2. Vercel

| Item | Value |
|------|-------|
| Login email | |
| Team / account name | alwho-9360s-projects |
| Project name | zzzbestmaxlit |
| Project URL | https://vercel.com/alwho-9360s-projects/zzzbestmaxlit |

### Environment variables (Production + Preview)

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | |
| `SUPABASE_SERVICE_ROLE_KEY` | |
| `NEXT_PUBLIC_SITE_URL` | https://www.einsteinerror.com |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | |
| `STRIPE_SECRET_KEY` | |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | |
| `STRIPE_WEBHOOK_SIGNING_SECRET` | |
| `GEMINI_API_KEY` | |
| `AI_PROVIDER` | gemini |
| `GEMINI_CONTEXT_CACHE` | true |
| `CHAT_RATE_LIMIT_PER_HOUR` | 20 |

Optional (only if used):

| Variable | Value |
|----------|-------|
| `OPENAI_API_KEY` | |
| `ANTHROPIC_API_KEY` | |
| `XAI_API_KEY` | |

### Domains

| Domain | DNS provider login | Notes |
|--------|-------------------|-------|
| www.einsteinerror.com | | Primary |
| einsteinerror.com | | Redirect to www |
| www.einsteingravity.com | | Alias |
| einsteingravity.com | | Redirect to www |
| zzzbestmaxlit.vercel.app | | Vercel default |

---

## 3. Supabase

| Item | Value |
|------|-------|
| Login email | |
| Organization | |
| Project name | |
| Project ref (subdomain) | |
| Region | |
| Database password (if set) | |

### API keys (Settings → API)

| Key | Value |
|-----|-------|
| Project URL | |
| anon public | |
| service_role | |

### Auth (Authentication → Providers → Google)

| Item | Value |
|------|-------|
| Google Client ID | |
| Google Client Secret | |

### Auth URL config

| Item | Value |
|------|-------|
| Site URL | https://www.einsteinerror.com |
| Redirect URLs | (list all — see SECRETS-AND-ENV.md) |

### Database backup location

| Item | Value |
|------|-------|
| Last Supabase data export date | |
| Export file path | FULL-SAAS-BACKUP/snapshots/supabase-data-____________/ |
| Supabase Dashboard backup enabled? | Yes / No |

---

## 4. Stripe

| Item | Value |
|------|-------|
| Login email | |
| Account ID | |
| Mode | Live / Test |

### API keys (Developers → API keys)

| Key | Value |
|-----|-------|
| Publishable key (live) | |
| Secret key (live) | |
| Publishable key (test) | |
| Secret key (test) | |

### Webhook (Developers → Webhooks)

| Item | Value |
|------|-------|
| Endpoint URL | https://www.einsteinerror.com/api/stripe/webhook |
| Signing secret | |
| Events enabled | checkout.session.completed, payment_intent.succeeded |

### Products (reference — also in code)

| Item | Value |
|------|-------|
| Product ID | prod_V0AXYbWwPdLkwz |
| $15 price ID | price_1U0ACSC39oHx6wOFTQfZCCTF |
| $75 price ID | price_1U0ACSC39oHx6wOFWoJosDHi |
| $400 price ID | price_1U0ACSC39oHx6wOFgtNTWLNV |

---

## 5. Google Cloud (OAuth)

| Item | Value |
|------|-------|
| Login email | |
| Project name | |
| OAuth Web client name | |
| Client ID | |
| Client Secret | |

Authorized JavaScript origins and redirect URIs: see `SECRETS-AND-ENV.md` or `.env.example`.

---

## 6. Google AI Studio (Gemini)

| Item | Value |
|------|-------|
| Login email | |
| API key(s) | |
| Billing account linked? | Yes / No |
| Cloud billing alerts URL | https://console.cloud.google.com/billing/budgets |

---

## 7. Domain registrar / DNS

| Domain | Registrar login | Nameservers |
|--------|-----------------|-------------|
| einsteinerror.com | | |
| einsteingravity.com | | |

---

## 8. Contact & support (on-site)

| Item | Value |
|------|-------|
| WhatsApp | +17802707009 |
| Email | wild.book0719@fastmail.com |
| Fastmail login | |

---

## 9. Local machine

| Item | Value |
|------|-------|
| Project path | /Users/ALZ/Desktop/MAX-LITMASTER/zzzbestmaxlit |
| Node.js version | |
| Last full backup archive | FULL-SAAS-BACKUP/snapshots/zzzbestmaxlit-____________.tar.gz |
| Last Supabase data export | FULL-SAAS-BACKUP/snapshots/supabase-data-____________/ |

---

## 10. Recovery test log

Run once per quarter — check when done:

| Step | Date tested | Pass? |
|------|-------------|-------|
| Clone GitHub or extract `.tar.gz` | | |
| `npm install && npm run build` | | |
| Restore `.env.local` from this vault | | |
| `npm run dev` — home page loads | | |
| Google sign-in works | | |
| Purchases text box loads | | |
| Chat works | | |
| Production domains return 200 | | |
| Supabase data export script run | | |

---

## Storage locations (check all that apply)

- [ ] Password manager (1Password / Bitwarden / etc.)
- [ ] Encrypted USB drive (location: _______________)
- [ ] iCloud / Google Drive encrypted archive (location: _______________)
- [ ] Printed copy in safe (location: _______________)
- [ ] Second computer (location: _______________)

**Reminder:** The `.tar.gz` code backup + this completed checklist + Supabase data export = full recovery kit.
