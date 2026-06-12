import { NextRequest, NextResponse } from "next/server";
import { userFromBearer } from "@/lib/auth-token";

// Returns the signed-in user's email + plan from a Supabase access token.
// Called by the Chrome extension to show login state.
export async function GET(req: NextRequest) {
  const u = await userFromBearer(req);
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ email: u.email, plan: u.plan });
}
