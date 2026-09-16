import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { usagePayload } from "@/lib/usage";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My profile",
  robots: { index: false, follow: false },
};

// Personal home: who you are, the minutes left on your plan, your meeting
// history and what Flash Meet did with it. Every number comes from the user's
// own profile row and saved meetings — nothing is illustrative.
export default async function Profile() {
  if (!supabaseConfigured()) redirect("/login");
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let usage = usagePayload("free", 0, 0);
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("profiles")
      .select("plan,seconds_today,day_key,seconds_month,month_key,bonus_minutes,trial_until")
      .eq("id", user.id).single();
    if (data) {
      const today = new Date().toISOString().slice(0, 10);
      const mkey = today.slice(0, 7);
      const secToday = data.day_key === today ? (data.seconds_today || 0) : 0;
      const secMonth = data.month_key === mkey ? (data.seconds_month || 0) : 0;
      usage = usagePayload(data.plan || "free", secToday, secMonth, data.bonus_minutes || 0);
    }
  } catch { /* columns may be missing — fall back to the free defaults */ }

  const meta = (user.user_metadata || {}) as Record<string, string>;
  return (
    <ProfileClient
      email={user.email || ""}
      name={meta.full_name || meta.name || ""}
      avatar={meta.avatar_url || meta.picture || ""}
      since={user.created_at || ""}
      usage={usage}
    />
  );
}
