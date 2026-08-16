import PaymentCheckout from '@/components/pricing/PaymentCheckout';
import { CheckoutSignInPrompt } from '@/components/checkout-sign-in-prompt';
import { PageEndFooter } from '@/components/page-end-footer';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { getGoogleClientId } from '@/lib/site-url';
import Link from 'next/link';
import { Suspense } from 'react';

/** MAX-LIT Secure Checkout — 3 Stripe tiers ($15 / $75 / $400) — Page 10 */
export default async function Checkout11Page() {
  let isSignedIn = false;

  if (getSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isSignedIn = Boolean(user);
  }

  const googleClientId = await getGoogleClientId();

  return (
    <main className="pricing-checkout-page">
      <div className="pricing-checkout-page__inner">
        <p className="pricing-checkout-page__expired-notice">
          Sorry, your Time has run out.
          <br />
          Choose an option below ...
        </p>
        <h1 className="pricing-checkout-page__title">
          MAX-LIT{'\u00A0'.repeat(4)}Secure{'\u00A0'.repeat(4)}CHECK-OUT
        </h1>
        {!isSignedIn ? (
          <CheckoutSignInPrompt googleClientId={googleClientId} />
        ) : null}
        <div className="pricing-checkout-page__checkout-block">
          <Suspense fallback={null}>
            <PaymentCheckout />
          </Suspense>
          <div className="pricing-checkout-page__tail">
            <Link href="/" className="pricing-checkout-page__home">
              HOME
            </Link>
            <PageEndFooter pageNumber={10} compact />
          </div>
        </div>
      </div>
    </main>
  );
}
