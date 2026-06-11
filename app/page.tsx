import MeetingApp from "./MeetingApp";
import { createClient, supabaseConfigured } from "@/lib/supabase-server";
import { isAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export default async function Home() {
  let email = "";
  let plan = "free";
  let admin = false;
  if (supabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      email = user?.email ?? "";
      admin = isAdmin(user?.email);
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .single();
        if (data?.plan) plan = data.plan;
      }
    } catch {
      // profiles table may not exist yet — fall back to the free plan
    }
  }
  return <MeetingApp email={email} plan={plan} admin={admin} />;
}
