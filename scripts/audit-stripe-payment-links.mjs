#!/usr/bin/env node
/**
 * Audit Stripe Payment Links (including Buy Button backing links).
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_... node scripts/audit-stripe-payment-links.mjs
 *
 * Optional:
 *   EXPECTED_SUCCESS_URL=https://www.einsteinerror.com/maxchatbox9?session_id={CHECKOUT_SESSION_ID}
 */

const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
const expectedSuccessUrl =
  process.env.EXPECTED_SUCCESS_URL?.trim() ||
  'https://www.einsteinerror.com/maxchatbox9?session_id={CHECKOUT_SESSION_ID}';

if (!secretKey) {
  console.error('Missing STRIPE_SECRET_KEY. Run:');
  console.error('  STRIPE_SECRET_KEY=sk_live_... node scripts/audit-stripe-payment-links.mjs');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${secretKey}`,
};

async function stripeGet(path, searchParams = {}) {
  const url = new URL(`https://api.stripe.com/v1${path}`);
  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, { headers });
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error?.message || `Stripe API error (${response.status})`);
  }

  return body;
}

async function listAllPaymentLinks() {
  const links = [];
  let startingAfter;

  do {
    const page = await stripeGet('/payment_links', {
      limit: '100',
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    links.push(...page.data);
    startingAfter = page.has_more ? page.data.at(-1)?.id : undefined;
  } while (startingAfter);

  return links;
}

function describeAfterCompletion(link) {
  const completion = link.after_completion;
  if (!completion) {
    return { type: 'unknown', url: null };
  }

  if (completion.type === 'redirect') {
    return { type: 'redirect', url: completion.redirect?.url ?? null };
  }

  return { type: completion.type, url: null };
}

function isExpectedSuccessUrl(url) {
  if (!url) {
    return false;
  }

  return url === expectedSuccessUrl;
}

function printLink(link, index) {
  const { type, url } = describeAfterCompletion(link);
  const ok = type === 'redirect' && isExpectedSuccessUrl(url);
  const status = ok ? 'OK' : 'NEEDS FIX';

  console.log(`${index}. [${status}] ${link.id}`);
  console.log(`   active: ${link.active}`);
  console.log(`   url: ${link.url}`);
  console.log(`   after payment: ${type}${url ? `\n   redirect: ${url}` : ''}`);

  if (!ok) {
    console.log(`   expected: ${expectedSuccessUrl}`);
    if (!link.active) {
      console.log('   note: inactive link — safest fix is to leave it off and use /checkout10 only');
    } else {
      console.log('   fix: Stripe Dashboard → Payment Links → Edit → After payment → Redirect to URL');
    }
  }

  console.log('');
}

async function main() {
  console.log('Stripe Payment Link audit');
  console.log(`Expected success URL: ${expectedSuccessUrl}\n`);

  const links = await listAllPaymentLinks();

  if (links.length === 0) {
    console.log('No payment links found in this Stripe account.');
    return;
  }

  const needsFix = links.filter((link) => {
    const { type, url } = describeAfterCompletion(link);
    return !(type === 'redirect' && isExpectedSuccessUrl(url));
  });

  links.forEach((link, index) => printLink(link, index + 1));

  console.log('---');
  console.log(`Total payment links: ${links.length}`);
  console.log(`Need attention: ${needsFix.length}`);
  console.log('');
  console.log('Important: Stripe Buy Buttons are backed by Payment Links.');
  console.log('Edit the Payment Link (not the embed HTML) to change the success redirect.');
  console.log('');
  console.log('Recommended: deactivate legacy buy-button payment links and use /checkout10 only,');
  console.log('because /checkout10 attaches supabase_user_id so paid access activates correctly.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
