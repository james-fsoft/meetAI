import { createClient } from "@supabase/supabase-js";

// Service-role client — server-only. Bypasses RLS so admins can read/update
// every profile. NEVER import this into client components.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

// Admin allowlist (comma-separated env override, else these defaults).
export const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS || "james.fsoft@gmail.com,james.le@sotatek.com,pttuanh197@gmail.com"
)
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const isAdmin = (email?: string | null) =>
  !!email && ADMIN_EMAILS.includes(email.toLowerCase());
