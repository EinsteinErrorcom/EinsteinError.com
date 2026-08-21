#!/usr/bin/env node
/**
 * Fail if runtime code or public assets reference retired MAX-LIT routes.
 */
import { execSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

const FORBIDDEN_ROUTES = [
  '/checkout11',
  '/checkout9',
  '/trialexpired10',
  '/trialexpired9',
  '/timeexpired12',
  '/timeexpired11',
  '/timeexpired10',
  '/maxchatbox8',
  '/chat8',
  '/chat9',
  '/pricing',
  '/spare12',
];

const ALLOWLIST = new Set([
  'USER-FLOWS.md',
  'RESTORE-POINT.md',
  'scripts/audit-route-links.mjs',
]);

function isAllowed(relPath, line) {
  if (ALLOWLIST.has(relPath)) {
    return true;
  }
  if (relPath.startsWith('FULL-SAAS-BACKUP/')) {
    return true;
  }
  if (line.includes('lib/stripe/pricing')) {
    return true;
  }
  if (line.includes('PaymentCheckout')) {
    return true;
  }
  if (line.includes('pricing-checkout-page')) {
    return true;
  }
  if (line.includes('checkout.stripe.com')) {
    return true;
  }
  return false;
}

function scan() {
  const cmd = `rg -n --glob '!FULL-SAAS-BACKUP/**' --glob '!node_modules/**' --glob '!.next/**' ${FORBIDDEN_ROUTES.map((r) => `'${r}'`).join(' ')} ${ROOT} 2>/dev/null || true`;
  const output = execSync(cmd, { encoding: 'utf8', cwd: ROOT }).trim();
  if (!output) {
    return [];
  }

  return output.split('\n').filter(Boolean).flatMap((line) => {
    const match = line.match(/^([^:]+):(\d+):(.*)$/);
    if (!match) {
      return [{ file: line, line: 0, text: line }];
    }
    const [, file, lineNo, text] = match;
    const rel = path.relative(ROOT, file);
    if (isAllowed(rel, text)) {
      return [];
    }
    return [{ file: rel, line: Number(lineNo), text: text.trim() }];
  });
}

const hits = scan();

if (hits.length === 0) {
  console.log('Route link audit: OK (no forbidden legacy paths in runtime/public code).');
  process.exit(0);
}

console.error('Route link audit: FAILED — forbidden legacy paths found:\n');
for (const hit of hits) {
  console.error(`  ${hit.file}:${hit.line}  ${hit.text}`);
}
console.error('\nUse CHECKOUT_PATH (/checkout10) and CHAT_PATH (/maxchatbox9) from lib/trial-gate.ts.');
process.exit(1);
