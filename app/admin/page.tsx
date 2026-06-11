import { createClient, supabaseConfigured } from "@/lib/supabase-server";
import { createAdminClient, isAdmin } from "@/lib/supabase-admin";
import AdminTable from "./AdminTable";

export const dynamic = "force-dynamic";

function Denied({ msg }: { msg: string }) {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "'Inter',system-ui,sans-serif", background: "#f5f7fc", padding: 24 }}>
      <div style={{ background: "#fff", border: "1px solid #e3e8f2", borderRadius: 18, padding: "34px 30px", textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🔒</div>
        <h1 style={{ fontSize: 18, fontWeight: 900, color: "#0a1124", marginBottom: 8 }}>Không có quyền</h1>
        <p style={{ fontSize: 14, color: "#5b6b8c", lineHeight: 1.55 }}>{msg}</p>
        <a href="/" style={{ display: "inline-block", marginTop: 18, fontSize: 13, fontWeight: 700, color: "#1f6bff", textDecoration: "none" }}>← Về app</a>
      </div>
    </main>
  );
}

export default async function Admin() {
  if (!supabaseConfigured()) return <Denied msg="Supabase chưa được cấu hình." />;

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <Denied msg="Vui lòng đăng nhập bằng tài khoản admin." />;
  if (!isAdmin(user.email)) return <Denied msg="Tài khoản của bạn không phải admin." />;

  const admin = createAdminClient();
  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id,email,plan,created_at")
    .order("created_at", { ascending: false });

  if (error) return <Denied msg={"Lỗi đọc dữ liệu: " + error.message} />;

  return <AdminTable profiles={profiles || []} me={user.email || ""} />;
}
