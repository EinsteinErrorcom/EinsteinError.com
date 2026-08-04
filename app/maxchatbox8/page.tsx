import Chatbox from '@/components/chat/Chatbox';
import { fulfillCheckoutSession } from '@/lib/stripe/subscription';
import { createClient } from '@/lib/supabase/server';
import { isTourMode } from '@/lib/site-tour';
import {
  CHAT_PATH,
  fetchProfileTrial,
  shouldRedirectToPricing,
  SIGN_IN_PATH,
  TRIAL_EXPIRED_PATH,
} from '@/lib/trial-gate';
import { redirect } from 'next/navigation';

type MaxChatbox8PageProps = {
  searchParams: Promise<{ session_id?: string; tour?: string }>;
};

export default async function MaxChatbox8Page({ searchParams }: MaxChatbox8PageProps) {
  const params = await searchParams;

  if (isTourMode(params.tour)) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-[#00FFFF]">AI Chat Window</h1>
        <p style={{ color: '#FFFF00', fontStyle: 'italic', marginBottom: '24px' }}>
          Tour preview — sign-in and chat are disabled on this page.
        </p>
        <div
          data-tour-block="true"
          className="w-full max-w-2xl mx-auto h-[600px] bg-[#161b22] border-4 border-[#C5A059] rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="p-4 bg-[#0d1117] border-b border-[#C5A059] text-center text-[#00FFFF] font-bold italic">
            MAX-LIT Chatbox preview
          </div>
          <div className="flex-1 p-4 text-[#00FFFF] text-left">
            <p>After Google Sign-In, users ask physics questions here.</p>
            <p style={{ marginTop: '16px', color: '#C5A059' }}>
              Example: &quot;What is the velocity of gravity in mAZ physics?&quot;
            </p>
          </div>
        </div>
      </main>
    );
  }

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
