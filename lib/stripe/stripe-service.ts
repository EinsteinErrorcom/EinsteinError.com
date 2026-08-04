import Stripe from 'stripe';
import type { PricingTier } from '@/lib/stripe/pricing';
import { CHAT_PATH, CHECKOUT_PATH } from '@/lib/trial-gate';

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

    if (!secretKey) {
      throw new Error(
        'STRIPE_NOT_CONFIGURED: Add STRIPE_SECRET_KEY to .env.local (Stripe Dashboard → API keys → Secret key).'
      );
    }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}

function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    return siteUrl.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
}

type CheckoutSessionInput = {
  tier: PricingTier;
  userId: string;
  email?: string | null;
};

export async function createCheckoutSession({
  tier,
  userId,
  email,
}: CheckoutSessionInput): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient();
  const siteUrl = getSiteUrl();

  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: tier.priceId, quantity: 1 }],
    success_url: `${siteUrl}${CHAT_PATH}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}${CHECKOUT_PATH}`,
    metadata: {
      supabase_user_id: userId,
      price_id: tier.priceId,
      product_label: tier.description,
    },
    client_reference_id: userId,
    ...(email ? { customer_email: email } : {}),
  });
}

type CreatePaymentIntentInput = {
  tier: PricingTier;
  userId: string;
  email?: string | null;
};

export async function createPaymentIntent({
  tier,
  userId,
  email,
}: CreatePaymentIntentInput): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();

  return stripe.paymentIntents.create({
    amount: tier.amountCents,
    currency: tier.currency,
    automatic_payment_methods: { enabled: true },
    metadata: {
      supabase_user_id: userId,
      price_id: tier.priceId,
      product_label: tier.description,
    },
    ...(email ? { receipt_email: email } : {}),
  });
}
