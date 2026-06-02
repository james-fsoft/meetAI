"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

/**
 * Meeting AI — main shell.
 * A small signed-in user bar sits above the existing meeting UI (served from
 * public/meeting.html inside an iframe). Phase 3 will convert the iframe into
 * native React and move the AI calls behind the backend.
 */
export default function MeetingApp({ email }: { email?: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "14px",
          padding: "8px 18px", fontFamily: "'Inter',system-ui,sans-serif", fontSize: "13px",
          color: "#5b6b8c", borderBottom: "1px solid #e3e8f2", background: "#fff",
        }}
      >
        {email && <span>👤 {email}</span>}
        <button
          onClick={signOut}
          style={{
            border: "1.5px solid #e3e8f2", background: "#fff", color: "#0a1124", cursor: "pointer",
            fontFamily: "inherit", fontSize: "12px", fontWeight: 700, padding: "6px 14px",
            borderRadius: "8px",
          }}
        >
          Đăng xuất
        </button>
      </div>
      <iframe
        src="/meeting.html?v=16"
        title="Meeting AI"
        allow="microphone; display-capture; clipboard-write"
        style={{ border: "none", width: "100%", flex: 1, display: "block" }}
      />
    </div>
  );
}
