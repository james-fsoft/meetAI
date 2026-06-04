import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// Google redirects here with ?code=...; exchange it for a session cookie, then go home.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL(next, url.origin));
}
