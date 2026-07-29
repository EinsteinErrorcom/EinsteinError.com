const PLACEHOLDER_VALUES = new Set([
  "your-anon-key",
  "your-project.supabase.co",
  "https://your-project.supabase.co",
  "supabase_project_url",
  "supabase_publishable_key",
]);

export function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (
    PLACEHOLDER_VALUES.has(supabaseUrl) ||
    PLACEHOLDER_VALUES.has(supabaseAnonKey)
  ) {
    return null;
  }

  try {
    const parsedUrl = new URL(supabaseUrl);
    if (!parsedUrl.hostname.endsWith(".supabase.co")) {
      return null;
    }
  } catch {
    return null;
  }

  if (!supabaseAnonKey.startsWith("eyJ")) {
    return null;
  }

  return { supabaseUrl, supabaseAnonKey };
}

export const SUPABASE_CONFIG_ERROR =
  "Sign-in is not configured yet. Add your Supabase URL and anon key, then redeploy.";
