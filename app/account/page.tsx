import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { usagePayload } from "@/lib/usage";
import AccountClient from "./AccountClient";

export const dynamic = "force-dynamic";

export default async function Account() {
  if (!supabaseConfigured()) redirect("/login");
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let plan = "free";
  let usage = usagePayload("free", 0, 0);
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("profiles")
      .select("plan,seconds_today,day_key,seconds_month,month_key,bonus_minutes")
      .eq("id", user.id).single();
    if (data) {
      plan = data.plan || "free";
      const today = new Date().toISOString().slice(0, 10);
      const mkey = today.slice(0, 7);
      const secToday = data.day_key === today ? (data.seconds_today || 0) : 0;
      const secMonth = data.month_key === mkey ? (data.seconds_month || 0) : 0;
      usage = usagePayload(plan, secToday, secMonth, data.bonus_minutes || 0);
    }
  } catch { /* columns may be missing — fall back to defaults */ }

  return <AccountClient email={user.email || ""} usage={usage} />;
}
