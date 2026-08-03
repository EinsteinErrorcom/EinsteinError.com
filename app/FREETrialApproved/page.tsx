import FREETrialApprovedClient from "./FREETrialApprovedClient";
import { ensureUserProfile } from "@/app/actions/profile";
import { createClient } from "@/lib/supabase/server";
import {
  fetchProfileTrial,
  PRICING_PATH,
  shouldRedirectToPricing,
} from "@/lib/trial-gate";
import { redirect } from "next/navigation";

export default async function FREETrialApprovedPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const profileResult = await ensureUserProfile();
  if (profileResult.error) {
    redirect("/?auth=error&reason=profile");
  }

  const profile = await fetchProfileTrial(supabase, session.user.id);
  if (shouldRedirectToPricing(profile)) {
    redirect(PRICING_PATH);
  }

  return <FREETrialApprovedClient />;
}
