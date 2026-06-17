import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "./supabase-admin";
import { effectivePlan } from "./usage";

export type TokenUser = { id: string; email: string | null; plan: string };

// Validates a Supabase access token from the Authorization header and returns
// the user + plan. Used by API routes called from the Chrome extension.
export async function userFromBearer(req: Request): Promise<TokenUser | null> {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  try {
    const sb = createClient(url, key);
    const { data: { user } } = await sb.auth.getUser(token);
    if (!user) return null;
    let plan = "free";
    try {
      const admin = createAdminClient();
      const { data } = await admin.from("profiles").select("plan, trial_until").eq("id", user.id).single();
      plan = effectivePlan(data?.plan, data?.trial_until);
    } catch {}
    return { id: user.id, email: user.email ?? null, plan };
  } catch {
    return null;
  }
}
