import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase-server";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meeting calendar",
  robots: { index: false, follow: false },
};

// Signed-in only: every meeting a user ends is summarized and saved to
// public.meetings; this page lays them out on a calendar.
export default async function Dashboard() {
  if (!supabaseConfigured()) redirect("/login");
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <DashboardClient email={user.email || ""} />;
}
