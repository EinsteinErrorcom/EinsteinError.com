import { NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe/stripe-service';
import { getPricingTier } from '@/lib/stripe/pricing';
import { createClient, getAuthenticatedUser } from '@/lib/supabase/server';
import { createPaymentIntentSchema } from '@/lib/validations/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createPaymentIntentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
        { status: 400 }
      );
    }

    const tier = getPricingTier(parsed.data.priceId);
    if (!tier) {
      return NextResponse.json({ error: 'Unknown price tier' }, { status: 400 });
    }

    const supabase = await createClient();
    const user = await getAuthenticatedUser(req, supabase);

    if (!user) {
      return NextResponse.json(
        { error: 'Sign in required before checkout' },
        { status: 401 }
      );
    }

    const paymentIntent = await createPaymentIntent({
      tier,
      userId: user.id,
      email: user.email,
    });

    if (!paymentIntent.client_secret) {
      return NextResponse.json(
        { error: 'Failed to initialize payment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: tier.amountCents,
      currency: tier.currency,
      label: tier.description,
    });
  } catch (err) {
    console.error('[stripe/create-payment-intent]', err);
    const message =
      err instanceof Error ? err.message : 'Failed to create payment intent';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
