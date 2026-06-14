import MeetingApp from "./MeetingApp";
import { createClient, supabaseConfigured } from "@/lib/supabase-server";
import { isAdmin } from "@/lib/supabase-admin";
import { usagePayload } from "@/lib/usage";

export const dynamic = "force-dynamic";

export default async function Home() {
  let email = "";
  let plan = "free";
  let admin = false;
  let usage: ReturnType<typeof usagePayload> | null = null;
  if (supabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      email = user?.email ?? "";
      admin = isAdmin(user?.email);
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("plan,seconds_today,day_key,seconds_month,month_key")
          .eq("id", user.id)
          .single();
        if (data?.plan) plan = data.plan;
        if (data) {
          const today = new Date().toISOString().slice(0, 10);
          const mkey = today.slice(0, 7);
          const secToday = data.day_key === today ? (data.seconds_today || 0) : 0;
          const secMonth = data.month_key === mkey ? (data.seconds_month || 0) : 0;
          usage = usagePayload(plan, secToday, secMonth);
        }
      }
    } catch {
      // profiles/usage columns may not exist yet — fall back gracefully
    }
  }
  return <MeetingApp email={email} plan={plan} admin={admin} usage={usage} />;
}
