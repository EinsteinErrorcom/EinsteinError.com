import { createClient } from "@supabase/supabase-js";

export function createServiceRoleClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase service role credentials are not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase Dashboard → Settings → API → service_role), then restart npm run dev."
    );
  }

  return createClient(url, serviceRoleKey);
}
