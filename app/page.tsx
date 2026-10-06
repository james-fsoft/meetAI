import type { Metadata } from "next";
import { redirect } from "next/navigation";
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
  searchParams?: { app?: string; code?: string; next?: string };
}) {
  // Supabase sends the OAuth code to its Site URL when it will not accept our redirect,
  // and that is this page. Hand the code to the callback instead of dropping the sign-in.
  if (searchParams?.code) {
    const qs = new URLSearchParams({ code: searchParams.code, next: searchParams.next || "/?app=1" });
    redirect(`/auth/callback?${qs.toString()}`);
  }

  let email = "";
  let plan = "free";
  let admin = false;
  let signed = false;
  if (supabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      signed = !!user;
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
  if (searchParams?.app !== "1") {
    return <ConceptFrame src={`/concept-en.html${signed ? "?signed=1" : ""}`} title="Flash Meet — live meeting translation" />;
  }
  return <MeetingApp email={email} plan={plan} admin={admin} />;
}
