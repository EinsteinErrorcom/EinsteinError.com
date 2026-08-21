import { NextResponse } from 'next/server';
import { getPricingTier } from '@/lib/stripe/pricing';
import {
  createCheckoutSession,
  formatStripeError,
  resolveSiteUrl,
} from '@/lib/stripe/stripe-service';
import { createClient, getAuthenticatedUser } from '@/lib/supabase/server';
import { createCheckoutSessionSchema } from '@/lib/validations/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createCheckoutSessionSchema.safeParse(body);

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

    const session = await createCheckoutSession({
      tier,
      userId: user.id,
      email: user.email,
      siteUrl: resolveSiteUrl(req),
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to initialize Stripe checkout' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[stripe/create-checkout-session]', err);
    return NextResponse.json(
      { error: formatStripeError(err) },
      { status: 500 }
    );
  }
}
