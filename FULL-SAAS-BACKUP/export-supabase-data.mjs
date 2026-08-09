#!/usr/bin/env node
/**
 * Export Supabase table data to JSON for disaster recovery.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (or env).
 * Does NOT export auth.users — use Supabase Dashboard → Database → Backups for that.
 *
 * Usage (from project root):
 *   node FULL-SAAS-BACKUP/export-supabase-data.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

config({ path: join(projectRoot, '.env.local') });
config({ path: join(projectRoot, '.env') });

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
  process.env.SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceRoleKey) {
  console.error(
    'Missing credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
  );
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = join(__dirname, 'snapshots', `supabase-data-${stamp}`);
mkdirSync(outDir, { recursive: true });

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TABLES = [
  {
    name: 'profiles',
    query: () => supabase.from('profiles').select('*').order('trial_start_at', { ascending: false }),
  },
  {
    name: 'site_stats',
    query: () => supabase.from('site_stats').select('*'),
  },
  {
    name: 'chat_requests',
    query: () =>
      supabase
        .from('chat_requests')
        .select('id, user_id, created_at')
        .order('created_at', { ascending: false })
        .limit(10000),
  },
];

const manifest = {
  exportedAt: new Date().toISOString(),
  supabaseUrl: url,
  tables: {},
  notes: [
    'auth.users is NOT included — export via Supabase Dashboard → Database → Backups.',
    'To restore: use FULL-SAAS-BACKUP/restore-supabase-data.mjs or manual SQL insert.',
  ],
};

console.log(`Exporting Supabase data to ${outDir}\n`);

for (const table of TABLES) {
  const { data, error } = await table.query();

  if (error) {
    console.error(`  ✗ ${table.name}: ${error.message}`);
    manifest.tables[table.name] = { error: error.message, rowCount: 0 };
    continue;
  }

  const rows = data ?? [];
  const filePath = join(outDir, `${table.name}.json`);
  writeFileSync(filePath, JSON.stringify(rows, null, 2));
  manifest.tables[table.name] = { rowCount: rows.length, file: `${table.name}.json` };
  console.log(`  ✓ ${table.name}: ${rows.length} rows → ${table.name}.json`);
}

writeFileSync(join(outDir, 'EXPORT-MANIFEST.json'), JSON.stringify(manifest, null, 2));

console.log(`\nDone. Copy this folder off-site with your .tar.gz backup:`);
console.log(`  ${outDir}`);
