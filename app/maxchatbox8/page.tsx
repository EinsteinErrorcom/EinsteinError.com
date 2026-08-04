import Chatbox from '@/components/chat/Chatbox';
import { createClient } from '@/lib/supabase/server';
import {
  fetchProfileTrial,
  shouldRedirectToPricing,
  TRIAL_EXPIRED_PATH,
} from '@/lib/trial-gate';
import { redirect } from 'next/navigation';

export default async function MaxChatbox8Page() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
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
