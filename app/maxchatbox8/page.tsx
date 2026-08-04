import Chatbox from '@/components/chat/Chatbox';
import { fulfillCheckoutSession } from '@/lib/stripe/subscription';
import { createClient } from '@/lib/supabase/server';
import {
  CHAT_PATH,
  fetchProfileTrial,
  shouldRedirectToPricing,
  SIGN_IN_PATH,
  TRIAL_EXPIRED_PATH,
} from '@/lib/trial-gate';
import { redirect } from 'next/navigation';

type MaxChatbox8PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function MaxChatbox8Page({ searchParams }: MaxChatbox8PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect(SIGN_IN_PATH);
  }

  if (params.session_id) {
    try {
      const fulfilled = await fulfillCheckoutSession(
        params.session_id,
        session.user.id
      );
      if (fulfilled) {
        redirect(CHAT_PATH);
      }
    } catch (err) {
      console.error('[maxchatbox8] checkout fulfillment failed:', err);
    }
  }

  const profile = await fetchProfileTrial(supabase, session.user.id);
  if (shouldRedirectToPricing(profile)) {
    redirect(TRIAL_EXPIRED_PATH);
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-[#00FFFF]">AI Chat Window</h1>
      <Chatbox embedded historyUserId={session.user.id} />
    </main>
  );
}
