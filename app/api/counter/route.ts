import {
  TRUTH_COUNTER_COOKIE,
  TRUTH_COUNTER_FALLBACK,
  TRUTH_COUNTER_KEY,
} from "@/lib/truth-counter";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function readCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_stats")
      .select("value")
      .eq("key", TRUTH_COUNTER_KEY)
      .maybeSingle();

    if (!error && typeof data?.value === "number") {
      return data.value;
    }
  } catch {
    // Fall through to service role read below.
  }

  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from("site_stats")
      .select("value")
      .eq("key", TRUTH_COUNTER_KEY)
      .maybeSingle();

    if (!error && typeof data?.value === "number") {
      return data.value;
    }
  } catch {
    // Table may not exist until migration is applied.
  }

  return TRUTH_COUNTER_FALLBACK;
}

export async function GET() {
  const count = await readCount();
  return NextResponse.json({ count });
}

export async function POST() {
  const cookieStore = await cookies();

  if (cookieStore.get(TRUTH_COUNTER_COOKIE)?.value === "1") {
    const count = await readCount();
    return NextResponse.json({ count, incremented: false });
  }

  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin.rpc("increment_truth_counter");

    if (error) {
      throw error;
    }

    const count = typeof data === "number" ? data : await readCount();
    const response = NextResponse.json({ count, incremented: true });
    response.cookies.set(TRUTH_COUNTER_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } catch {
    const count = await readCount();
    return NextResponse.json({ count, incremented: false });
  }
}
