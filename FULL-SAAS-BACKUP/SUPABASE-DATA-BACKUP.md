# Supabase Data Backup & Restore

The code backup does **not** include live database rows. Use this guide to export and restore Supabase data.

---

## What gets exported

| Table | Contents |
|-------|----------|
| `profiles` | User IDs, trial dates, subscription status |
| `site_stats` | Truth counter value |
| `chat_requests` | Chat rate-limit log (last 10,000 rows) |

## What is NOT exported by the script

| Data | How to back up |
|------|----------------|
| `auth.users` (Google sign-in accounts) | Supabase Dashboard → Database → Backups |
| Full database dump | Supabase CLI: `supabase db dump --linked` |
| Storage buckets (if any) | Supabase Dashboard → Storage |

---

## Export (automated — recommended)

**Requires:** `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

```bash
node FULL-SAAS-BACKUP/export-supabase-data.mjs
```

Output: `FULL-SAAS-BACKUP/snapshots/supabase-data-YYYY-MM-DDTHH-MM-SS/`

Copy that folder off-site with your `.tar.gz` code backup.

---

## Export (manual — SQL Editor)

1. Supabase Dashboard → SQL → New query
2. Run queries in `reference/supabase-export.sql`
3. Download results as CSV/JSON
4. Save to `FULL-SAAS-BACKUP/snapshots/supabase-data-manual-YYYY-MM-DD/`

---

## Restore

**Requires:** Migrations already applied on target Supabase project.

```bash
node FULL-SAAS-BACKUP/restore-supabase-data.mjs FULL-SAAS-BACKUP/snapshots/supabase-data-YYYY-MM-DDTHH-MM-SS
```

This upserts `profiles` and `site_stats`. Test on a staging project first if possible.

**auth.users** must be restored from Supabase Dashboard backups — users cannot sign in with profiles alone.

---

## Recommended schedule

| Task | Frequency |
|------|-----------|
| Code snapshot (`export-full-backup.sh`) | Monthly or before major changes |
| Supabase data export (`export-supabase-data.mjs`) | Weekly |
| Update `SECRETS-VAULT-CHECKLIST.md` | When any secret changes |
| Recovery test (clone + build + dev) | Quarterly |

---

## Full recovery kit checklist

- [ ] `zzzbestmaxlit-*.tar.gz` (code + assets)
- [ ] `supabase-data-*/` folder (database rows)
- [ ] Completed `SECRETS-VAULT-CHECKLIST.md` (in password manager)
- [ ] Supabase Dashboard backup enabled
- [ ] Stripe dashboard access (payment history lives there)
