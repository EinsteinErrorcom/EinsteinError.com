import Chatbox from '@/components/chat/Chatbox';
import { ChatExitLinks } from '@/components/chat/ChatExitLinks';
import { PageEndFooter } from '@/components/page-end-footer';
import { fulfillCheckoutSession } from '@/lib/stripe/subscription';
import { createClient } from '@/lib/supabase/server';
import { isTourMode } from '@/lib/site-tour';
import {
  buildSignInPathWithCheckoutSession,
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
        <PageEndFooter pageNumber={8} />
      </main>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    if (params.session_id) {
      redirect(buildSignInPathWithCheckoutSession(params.session_id));
    }
    redirect(SIGN_IN_PATH);
  }

  if (params.session_id) {
    try {
      const fulfilled = await fulfillCheckoutSession(
        params.session_id,
        user.id
      );
      if (fulfilled) {
        redirect(CHAT_PATH);
      }
    } catch (err) {
      console.error('[maxchatbox8] checkout fulfillment failed:', err);
    }

    const profileAfterPayment = await fetchProfileTrial(supabase, user.id);
    if (!shouldRedirectToPricing(profileAfterPayment)) {
      redirect(CHAT_PATH);
    }

    const refreshPath = `${CHAT_PATH}?session_id=${encodeURIComponent(params.session_id)}`;
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-[#00FFFF]">Activating your payment</h1>
        <p style={{ color: '#FFFF00', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.6 }}>
          Your Stripe payment was received. We are activating your MAX-LIT access now.
        </p>
        <p style={{ color: '#00FFFF', marginBottom: '24px', lineHeight: 1.6 }}>
          If chat does not open within a minute, refresh this page or contact us on WhatsApp (+17802707009).
        </p>
        <a href={refreshPath} style={{ color: '#C5A059', fontWeight: 'bold', textDecoration: 'underline' }}>
          Refresh to open ChatBox
        </a>
        <PageEndFooter pageNumber={8} />
      </main>
    );
  }

  const profile = await fetchProfileTrial(supabase, user.id);
  if (shouldRedirectToPricing(profile)) {
    redirect(TRIAL_EXPIRED_PATH);
  }

  return (
    <main className="p-8">
      <ChatExitLinks />
      <h1 className="text-2xl font-bold mb-4 text-[#00FFFF]">AI Chat Window</h1>
      <Chatbox embedded historyUserId={user.id} />
      <PageEndFooter pageNumber={8} />
    </main>
  );
}
