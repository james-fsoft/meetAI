import type { Metadata } from "next";
import ConceptFrame from "./ConceptFrame";
import MeetingApp from "./MeetingApp";
import { createClient, supabaseConfigured } from "@/lib/supabase-server";
import { isAdmin } from "@/lib/supabase-admin";
import { effectivePlan } from "@/lib/usage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { en: "/", vi: "/vi", ko: "/ko", "x-default": "/" },
  },
};

/**
 * "/" is the landing page; "/?app=1" is the meeting app itself — every button
 * that opens the app (and the /meeting and /app redirects) carries that flag.
 */
export default async function Home({
  searchParams,
}: {
  searchParams?: { app?: string };
}) {
  if (searchParams?.app !== "1") {
    return <ConceptFrame src="/concept-en.html" title="Flash Meet — live meeting translation" />;
  }

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
        const { data } = await supabase.from("profiles").select("plan, trial_until").eq("id", user.id).single();
        plan = effectivePlan(data?.plan, data?.trial_until);
      }
    } catch {
      // profile may not exist yet — fall back gracefully
    }
  }
  return <MeetingApp email={email} plan={plan} admin={admin} />;
}
