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

export function resolveSiteUrl(req?: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  if (req) {
    const forwardedHost = req.headers.get('x-forwarded-host');
    const forwardedProto = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();

    if (forwardedHost) {
      const host = forwardedHost.split(',')[0].trim();
      const proto =
        forwardedProto || (host.includes('localhost') ? 'http' : 'https');
      return `${proto}://${host}`;
    }

    try {
      return new URL(req.url).origin;
    } catch {
      // fall through to Vercel/local defaults
    }
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/$/, '')}`;
  }

  return 'http://localhost:3000';
}

export function formatStripeError(err: unknown): string {
  if (err instanceof Stripe.errors.StripeError) {
    if (err.statusCode === 404) {
      return `Stripe price or product not found (${err.message}). Check price IDs in lib/stripe/pricing.ts match your Stripe Dashboard and that STRIPE_SECRET_KEY uses the same mode (test vs live).`;
    }

    return err.message;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return 'Stripe request failed';
}

type CheckoutSessionInput = {
  tier: PricingTier;
  userId: string;
  email?: string | null;
  siteUrl?: string;
};

export async function createCheckoutSession({
  tier,
  userId,
  email,
  siteUrl,
}: CheckoutSessionInput): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient();
  const resolvedSiteUrl = siteUrl ?? resolveSiteUrl();

  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: tier.priceId, quantity: 1 }],
    success_url: `${resolvedSiteUrl}${CHAT_PATH}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${resolvedSiteUrl}${CHECKOUT_PATH}`,
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
