"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const PLAN_LABEL: Record<string, string> = {
  free: "Free", pro: "Pro", business: "Business", enterprise: "Enterprise",
};

/**
 * Meeting AI — main shell: a slim signed-in bar above the meeting UI
 * (served from public/meeting.html inside an iframe).
 */
export default function MeetingApp({ email, plan = "free" }: { email?: string; plan?: string }) {
  const router = useRouter();

  async function signOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    router.push("/login");
    router.refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={bar}>
        <span style={brand}>🎙️ Meeting AI</span>
        <span style={{ flex: 1 }} />
        <a href="/pricing" style={planBadge(plan)} title="Quản lý gói">
          {PLAN_LABEL[plan] || "Free"}
        </a>
        {email && <span style={mail}>👤 {email}</span>}
        <button onClick={signOut} style={out}>Đăng xuất</button>
      </div>
      <iframe
        src="/meeting.html?v=24"
        title="Meeting AI"
        allow="microphone; display-capture; clipboard-write"
        style={{ border: "none", width: "100%", flex: 1, display: "block" }}
      />
    </div>
  );
}

const bar: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12, padding: "8px 16px",
  fontFamily: "'Inter',system-ui,sans-serif", fontSize: 13, color: "#5b6b8c",
  borderBottom: "1px solid #e3e8f2", background: "#fff",
};
const brand: React.CSSProperties = { fontWeight: 900, color: "#0a1124", letterSpacing: "-.03em" };
const mail: React.CSSProperties = { fontSize: 12.5 };
const out: React.CSSProperties = {
  border: "1.5px solid #e3e8f2", background: "#fff", color: "#0a1124", cursor: "pointer",
  fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 8,
};
const planBadge = (plan: string): React.CSSProperties => ({
  fontSize: 11, fontWeight: 800, letterSpacing: ".03em", textDecoration: "none",
  padding: "4px 10px", borderRadius: 20,
  color: plan === "free" ? "#5b6b8c" : "#1f6bff",
  background: plan === "free" ? "#f5f7fc" : "#eef4ff",
  border: `1px solid ${plan === "free" ? "#e3e8f2" : "#d3e0fb"}`,
});
