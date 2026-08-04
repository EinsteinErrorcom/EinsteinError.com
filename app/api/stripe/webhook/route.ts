import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { markUserSubscribed } from '@/lib/stripe/subscription';
import { getStripeClient } from '@/lib/stripe/stripe-service';

export const runtime = 'nodejs';

function getWebhookSecret(): string | null {
  return (
    process.env.STRIPE_WEBHOOK_SIGNING_SECRET?.trim() ||
    process.env.STRIPE_WEBHOOK_SECRET?.trim() ||
    null
  );
}

export async function POST(req: Request) {
  const webhookSecret = getWebhookSecret();
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SIGNING_SECRET is not configured' },
      { status: 503 }
    );
  }

  let stripe: Stripe;
  try {
    stripe = getStripeClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe is not configured';
    return NextResponse.json({ error: message }, { status: 503 });
  }

  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid webhook signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId =
        session.metadata?.supabase_user_id ?? session.client_reference_id ?? null;

      if (userId) {
        await markUserSubscribed(userId);
      }
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const userId = paymentIntent.metadata.supabase_user_id;

      if (userId) {
        await markUserSubscribed(userId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[stripe/webhook]', err);
    const message = err instanceof Error ? err.message : 'Webhook handler failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
