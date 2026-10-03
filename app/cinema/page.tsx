import type { Metadata } from "next";
import { createClient, supabaseConfigured } from "@/lib/supabase-server";
import { effectivePlan } from "@/lib/usage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cinema mode",
  description:
    "Read a live translation of the film you are watching: large captions on a black screen, with the brightness and text size you choose.",
  alternates: { canonical: "/cinema" },
};

/**
 * Cinema mode — a dark, caption-only screen for watching a film in another language.
 * The page itself is public/cinema.html; the session is handed to it the same way the
 * meeting app gets it, so the free minutes and plan limits are the same ones.
 */
export default async function Cinema() {
  let signed = false;
  let plan = "free";
  if (supabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      signed = !!user;
      if (user) {
        const { data } = await supabase.from("profiles").select("plan, trial_until").eq("id", user.id).single();
        plan = effectivePlan(data?.plan, data?.trial_until);
      }
    } catch {
      // not signed in, or the profile row is missing — guest limits apply
    }
  }
  const src = `/cinema.html?v=1${signed ? `&signed=1&plan=${encodeURIComponent(plan)}` : ""}`;
  return (
    <iframe
      src={src}
      title="Flash Meet — cinema mode"
      allow="microphone"
      style={{ border: 0, width: "100%", height: "100dvh", display: "block", background: "#000" }}
    />
  );
}
