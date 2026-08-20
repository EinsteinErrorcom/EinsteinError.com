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
  getAccessExpiredPath,
  shouldRedirectToPricing,
  SIGN_IN_PATH,
} from '@/lib/trial-gate';
import { resolveCountdownProps } from '@/lib/access';
import { redirect } from 'next/navigation';

type MaxChatbox9PageProps = {
  searchParams: Promise<{ session_id?: string; tour?: string }>;
};

export default async function MaxChatbox9Page({ searchParams }: MaxChatbox9PageProps) {
  const params = await searchParams;

  if (isTourMode(params.tour)) {
    return (
      <main className="p-8">
        <h1 className="max-lit-chatbox-page-title text-2xl font-bold mb-4">
          <span className="max-lit-chatbox-page-title__brand">MAX-LIT</span>
          <br />
          <span className="max-lit-chatbox-page-title__subline">
            Query{'\u00A0'.repeat(3)}Window
          </span>
        </h1>
        <p style={{ color: '#FFFF00', fontStyle: 'italic', marginBottom: '24px' }}>
          Tour preview — sign-in and chat are disabled on this page.
        </p>
        <div data-tour-block="true">
          <Chatbox
            embedded
            accessTier="trial"
            accessStartedAt={new Date().toISOString()}
          />
        </div>
        <PageEndFooter pageNumber={9} />
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
      console.error('[maxchatbox9] checkout fulfillment failed:', err);
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
        <a href={refreshPath} className="max-lit-chatbox-exit-signout font-bold underline">
          Refresh to open ChatBox
        </a>
        <PageEndFooter pageNumber={9} />
      </main>
    );
  }

  const profile = await fetchProfileTrial(supabase, user.id);
  if (profile && shouldRedirectToPricing(profile)) {
    redirect(getAccessExpiredPath(profile));
  }

  const countdown = profile ? resolveCountdownProps(profile) : null;

  return (
    <main className="p-8">
      <ChatExitLinks />
      <h1 className="max-lit-chatbox-page-title text-2xl font-bold mb-4">
        <span className="max-lit-chatbox-page-title__brand">MAX-LIT</span>
        <br />
        <span className="max-lit-chatbox-page-title__subline">
          Query{'\u00A0'.repeat(3)}Window
        </span>
      </h1>
      <Chatbox
        embedded
        historyUserId={user.id}
        accessTier={countdown?.accessTier}
        accessStartedAt={countdown?.accessStartedAt}
      />
      <PageEndFooter pageNumber={9} />
    </main>
  );
}
