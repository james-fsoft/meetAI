import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// Google redirects here with ?code=...; exchange it for a session cookie, then go home.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/?app=1";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    // A failed exchange used to look like a successful sign-in that simply did nothing.
    if (error) return NextResponse.redirect(new URL("/login?error=session", url.origin));
  }
  return NextResponse.redirect(new URL(next, url.origin));
}
