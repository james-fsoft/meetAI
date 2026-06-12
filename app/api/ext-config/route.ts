import { NextResponse } from "next/server";

// Public config the Chrome extension needs to start the Supabase OAuth flow.
// (anon key is a public client key — safe to expose.)
export function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  });
}
