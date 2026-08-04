import { createClient } from '@supabase/supabase-js';
import { getStripeClient } from '@/lib/stripe/stripe-service';

function getServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase service role credentials are not configured');
  }

  return createClient(url, serviceRoleKey);
}

export async function markUserSubscribed(userId: string) {
  const supabase = getServiceRoleClient();
  const { error } = await supabase
    .from('profiles')
    .update({ is_subscribed: true })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to update profile subscription: ${error.message}`);
  }
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

  await markUserSubscribed(userId);
  return true;
}
