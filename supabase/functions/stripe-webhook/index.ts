// stripe-webhook.ts
import { Stripe } from 'https://esm.sh/stripe@14.21.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

export const handler = async (req: Request): Promise<Response> => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("No signature header", { status: 400 });
  }

  // 1. Get the raw text body (CRITICAL for signature verification)
  const body = await req.text();

  // 2. Fetch the new environment variable name
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET');

  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  let event;
  try {
    // 3. Verify the signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 4. Handle the event
  console.log(`Successfully processed event: ${event.type}`);
  return new Response(JSON.stringify({ received: true }), { status: 200 });
};