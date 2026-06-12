export const metadata = {
  title: "Chính sách bảo mật · Meeting AI",
  description: "Chính sách bảo mật của Meeting AI (meet.transflash.app).",
};

const UPDATED = "13/06/2026";

export default function Privacy() {
  return (
    <main style={S.wrap}>
      <div style={S.box}>
        <a href="/" style={S.back}>← Về app</a>
        <h1 style={S.h1}>Chính sách bảo mật</h1>
        <p style={S.meta}>Cập nhật lần cuối: {UPDATED} · Áp dụng cho <b>meet.transflash.app</b> (“Meeting AI”, “chúng tôi”).</p>

        <p style={S.p}>Meeting AI là dịch vụ ghi âm, phiên âm, dịch trực tiếp và tóm tắt cuộc họp bằng AI.
          Chính sách này mô tả dữ liệu chúng tôi thu thập, cách sử dụng và quyền của bạn.</p>

        <h2 style={S.h2}>1. Dữ liệu chúng tôi thu thập</h2>
        <ul style={S.ul}>
          <li><b>Tài khoản:</b> địa chỉ email và tên hiển thị khi bạn đăng nhập bằng Google.</li>
          <li><b>Nội dung âm thanh:</b> âm thanh bạn ghi/tải lên được xử lý để phiên âm và dịch.</li>
          <li><b>Bản ghi & tóm tắt:</b> transcript và bản tóm tắt được lưu vào lịch sử tài khoản của bạn để bạn xem lại.</li>
          <li><b>Dữ liệu sử dụng:</b> số phút đã dùng, gói dịch vụ, thời điểm đăng nhập — để vận hành và áp hạn mức.</li>
        </ul>

        <h2 style={S.h2}>2. Cách chúng tôi sử dụng dữ liệu</h2>
        <ul style={S.ul}>
          <li>Cung cấp tính năng: phiên âm, dịch trực tiếp, tách giọng nói và tóm tắt.</li>
          <li>Quản lý tài khoản, gói dịch vụ và hạn mức sử dụng.</li>
          <li>Bảo mật, chống lạm dụng và cải thiện chất lượng dịch vụ.</li>
        </ul>
        <p style={S.p}>Chúng tôi <b>không bán</b> dữ liệu của bạn cho bên thứ ba.</p>

        <h2 style={S.h2}>3. Bên thứ ba xử lý dữ liệu</h2>
        <p style={S.p}>Để cung cấp dịch vụ, chúng tôi gửi một phần dữ liệu cần thiết tới các nhà cung cấp sau:</p>
        <ul style={S.ul}>
          <li><b>Google</b> — đăng nhập (OAuth).</li>
          <li><b>Soniox</b> — chuyển giọng nói thành văn bản và dịch trực tiếp.</li>
          <li><b>OpenAI</b> — tạo bản tóm tắt cuộc họp.</li>
          <li><b>Supabase</b> — xác thực và lưu trữ hồ sơ/lịch sử.</li>
          <li><b>Vercel</b> — hạ tầng lưu trữ ứng dụng.</li>
          <li><b>Lemon Squeezy</b> — xử lý thanh toán (khi bạn nâng cấp gói).</li>
        </ul>

        <h2 style={S.h2}>4. Lưu trữ & thời gian giữ dữ liệu</h2>
        <ul style={S.ul}>
          <li>Âm thanh được xử lý để phiên âm/dịch; chúng tôi không dùng nội dung của bạn để huấn luyện mô hình.</li>
          <li>Transcript và tóm tắt lưu trong lịch sử tài khoản cho đến khi bạn xóa (gói Free giữ 7 ngày).</li>
          <li>Bạn có thể xóa từng cuộc họp trong app bất cứ lúc nào.</li>
        </ul>

        <h2 style={S.h2}>5. Quyền của bạn</h2>
        <p style={S.p}>Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân, và rút lại sự đồng ý.
          Để xóa toàn bộ tài khoản và dữ liệu, liên hệ <b>support@transflash.app</b>.</p>

        <h2 style={S.h2}>6. Bảo mật</h2>
        <p style={S.p}>Dữ liệu được truyền qua kết nối mã hóa (HTTPS/WSS). Khóa API của nhà cung cấp được giữ phía máy chủ,
          không lộ ra trình duyệt. Tuy vậy, không hệ thống nào an toàn tuyệt đối.</p>

        <h2 style={S.h2}>7. Cookie</h2>
        <p style={S.p}>Chúng tôi dùng cookie cần thiết để duy trì phiên đăng nhập. Không dùng cookie quảng cáo.</p>

        <h2 style={S.h2}>8. Trẻ em</h2>
        <p style={S.p}>Dịch vụ không dành cho người dưới 16 tuổi.</p>

        <h2 style={S.h2}>9. Thay đổi chính sách</h2>
        <p style={S.p}>Chúng tôi có thể cập nhật chính sách này. Bản mới sẽ đăng tại trang này kèm ngày cập nhật.</p>

        <h2 style={S.h2}>10. Liên hệ</h2>
        <p style={S.p}>Mọi câu hỏi về bảo mật: <b>support@transflash.app</b></p>

        <p style={S.foot}><a href="/terms" style={S.link}>Điều khoản dịch vụ →</a></p>
      </div>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", background: "#f5f7fc", padding: "40px 20px 70px", fontFamily: "'Inter',system-ui,sans-serif", color: "#0a1124" },
  box: { maxWidth: 760, margin: "0 auto", background: "#fff", border: "1px solid #e3e8f2", borderRadius: 18, padding: "38px 40px", boxShadow: "0 20px 50px -36px rgba(10,17,36,.4)" },
  back: { fontSize: 13, fontWeight: 700, color: "#5b6b8c", textDecoration: "none" },
  h1: { fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", margin: "14px 0 6px" },
  meta: { fontSize: 13, color: "#9aa6bd", marginBottom: 22, lineHeight: 1.5 },
  h2: { fontSize: 17, fontWeight: 800, margin: "26px 0 8px" },
  p: { fontSize: 14.5, color: "#33405c", lineHeight: 1.7, margin: "0 0 8px" },
  ul: { fontSize: 14.5, color: "#33405c", lineHeight: 1.7, paddingLeft: 20, margin: "0 0 8px" },
  foot: { marginTop: 30, paddingTop: 18, borderTop: "1px solid #e3e8f2" },
  link: { color: "#1f6bff", fontWeight: 700, textDecoration: "none", fontSize: 14 },
};
