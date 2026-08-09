#!/usr/bin/env node
/**
 * Restore Supabase table data from a JSON export folder.
 *
 * Usage:
 *   node FULL-SAAS-BACKUP/restore-supabase-data.mjs FULL-SAAS-BACKUP/snapshots/supabase-data-YYYY-MM-DDTHH-MM-SS
 *
 * WARNING: Upserts into profiles and site_stats. Appends chat_requests.
 * Test on a staging Supabase project first if possible.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

config({ path: join(projectRoot, '.env.local') });
config({ path: join(projectRoot, '.env') });

const exportDir = process.argv[2];

if (!exportDir || !existsSync(exportDir)) {
  console.error('Usage: node FULL-SAAS-BACKUP/restore-supabase-data.mjs <export-folder>');
  process.exit(1);
}

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
  process.env.SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function loadJson(name) {
  const path = join(exportDir, `${name}.json`);
  if (!existsSync(path)) {
    console.log(`  — skip ${name} (file not found)`);
    return null;
  }
  return JSON.parse(readFileSync(path, 'utf8'));
}

console.log(`Restoring from ${exportDir}\n`);

const profiles = loadJson('profiles');
if (profiles?.length) {
  const { error } = await supabase.from('profiles').upsert(profiles, { onConflict: 'id' });
  console.log(error ? `  ✗ profiles: ${error.message}` : `  ✓ profiles: ${profiles.length} rows upserted`);
}

const siteStats = loadJson('site_stats');
if (siteStats?.length) {
  const { error } = await supabase.from('site_stats').upsert(siteStats, { onConflict: 'key' });
  console.log(error ? `  ✗ site_stats: ${error.message}` : `  ✓ site_stats: ${siteStats.length} rows upserted`);
}

const chatRequests = loadJson('chat_requests');
if (chatRequests?.length) {
  const { error } = await supabase.from('chat_requests').upsert(chatRequests, { onConflict: 'id' });
  console.log(
    error ? `  ✗ chat_requests: ${error.message}` : `  ✓ chat_requests: ${chatRequests.length} rows upserted`
  );
}

console.log('\nRestore complete. auth.users must be recovered separately via Supabase Dashboard backups.');
