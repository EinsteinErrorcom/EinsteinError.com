import { createClient } from '@supabase/supabase-js';
import {
  getAccessTierFromPriceId,
  type AccessTier,
} from '@/lib/access';
import { getStripeClient } from '@/lib/stripe/stripe-service';

function getServiceRoleClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase service role credentials are not configured');
  }

  return createClient(url, serviceRoleKey);
}

type GrantPaidAccessInput = {
  userId: string;
  accessTier: AccessTier;
};

export async function grantPaidAccess({ userId, accessTier }: GrantPaidAccessInput) {
  const supabase = getServiceRoleClient();
  const accessStartedAt = new Date().toISOString();
  const { error } = await supabase
    .from('profiles')
    .update({
      is_subscribed: true,
      access_tier: accessTier,
      trial_start_at: accessStartedAt,
    })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to update profile subscription: ${error.message}`);
  }
}

export async function markUserSubscribed(userId: string, priceId?: string | null) {
  const accessTier = priceId ? getAccessTierFromPriceId(priceId) : null;
  await grantPaidAccess({
    userId,
    accessTier: accessTier ?? 'paid_3h',
  });
}

export async function fulfillCheckoutSession(
  checkoutSessionId: string,
  expectedUserId: string
): Promise<boolean> {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);

  if (session.payment_status !== 'paid') {
    return false;
  }

  const userId =
    session.metadata?.supabase_user_id ?? session.client_reference_id ?? null;

  if (!userId || userId !== expectedUserId) {
    return false;
  }

  const priceId = session.metadata?.price_id ?? null;
  await markUserSubscribed(userId, priceId);
  return true;
}
