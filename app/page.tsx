import MeetingApp from "./MeetingApp";
import { createClient } from "@/lib/supabase-server";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <MeetingApp email={user?.email ?? ""} />;
}
