export const metadata = {
  title: "Điều khoản dịch vụ · Meeting AI",
  description: "Điều khoản dịch vụ của Meeting AI (meet.transflash.app).",
};

const UPDATED = "13/06/2026";

export default function Terms() {
  return (
    <main style={S.wrap}>
      <div style={S.box}>
        <a href="/" style={S.back}>← Về app</a>
        <h1 style={S.h1}>Điều khoản dịch vụ</h1>
        <p style={S.meta}>Cập nhật lần cuối: {UPDATED} · Áp dụng cho <b>meet.transflash.app</b> (“Meeting AI”).</p>

        <h2 style={S.h2}>1. Chấp nhận điều khoản</h2>
        <p style={S.p}>Khi truy cập hoặc sử dụng Meeting AI, bạn đồng ý với các điều khoản này. Nếu không đồng ý, vui lòng không sử dụng dịch vụ.</p>

        <h2 style={S.h2}>2. Mô tả dịch vụ</h2>
        <p style={S.p}>Meeting AI cung cấp phiên âm, dịch trực tiếp đa ngôn ngữ, tách giọng nói và tóm tắt cuộc họp bằng AI.
          Dịch vụ có thể thay đổi, nâng cấp hoặc tạm ngừng tính năng theo thời gian.</p>

        <h2 style={S.h2}>3. Tài khoản</h2>
        <p style={S.p}>Bạn đăng nhập bằng Google và chịu trách nhiệm cho hoạt động trong tài khoản của mình. Vui lòng giữ an toàn cho thiết bị và phiên đăng nhập.</p>

        <h2 style={S.h2}>4. Gói dịch vụ & thanh toán</h2>
        <ul style={S.ul}>
          <li>Các gói trả phí tính theo tháng, xử lý qua Lemon Squeezy.</li>
          <li>Bạn có thể nâng, hạ hoặc huỷ gói bất cứ lúc nào; gói hiện tại dùng đến hết chu kỳ đã thanh toán.</li>
          <li>Mỗi gói có hạn mức “phút dịch”; vượt hạn mức, tính năng dịch trực tiếp tạm dừng tới kỳ sau.</li>
        </ul>

        <h2 style={S.h2}>5. Sử dụng hợp lệ & sự đồng ý ghi âm</h2>
        <p style={S.p}><b>Quan trọng:</b> Bạn chịu trách nhiệm tuân thủ pháp luật về ghi âm và quyền riêng tư tại khu vực của mình.
          Trước khi ghi âm hoặc dịch một cuộc họp, bạn phải <b>thông báo và xin phép những người tham gia</b> theo quy định pháp luật hiện hành.
          Bạn không được dùng dịch vụ cho mục đích bất hợp pháp, theo dõi trái phép hoặc xâm phạm quyền của người khác.</p>

        <h2 style={S.h2}>6. Sở hữu nội dung</h2>
        <p style={S.p}>Nội dung bạn tạo ra (âm thanh, transcript, tóm tắt) thuộc về bạn. Bạn cấp cho chúng tôi quyền xử lý nội dung đó chỉ nhằm cung cấp dịch vụ.</p>

        <h2 style={S.h2}>7. Miễn trừ về độ chính xác</h2>
        <p style={S.p}>Phiên âm, dịch và tóm tắt do AI tạo ra có thể có sai sót và <b>không đảm bảo chính xác tuyệt đối</b>.
          Vui lòng tự kiểm chứng trước khi dùng cho quyết định quan trọng. Dịch vụ cung cấp “nguyên trạng” (as-is), không kèm bảo đảm.</p>

        <h2 style={S.h2}>8. Giới hạn trách nhiệm</h2>
        <p style={S.p}>Trong phạm vi pháp luật cho phép, Meeting AI không chịu trách nhiệm cho các thiệt hại gián tiếp, ngẫu nhiên hoặc hệ quả phát sinh từ việc sử dụng dịch vụ.</p>

        <h2 style={S.h2}>9. Tạm ngừng & chấm dứt</h2>
        <p style={S.p}>Chúng tôi có thể tạm ngừng hoặc chấm dứt quyền truy cập nếu bạn vi phạm điều khoản hoặc lạm dụng dịch vụ.</p>

        <h2 style={S.h2}>10. Thay đổi điều khoản</h2>
        <p style={S.p}>Điều khoản có thể được cập nhật; bản mới đăng tại trang này kèm ngày cập nhật. Việc tiếp tục sử dụng đồng nghĩa bạn chấp nhận bản mới.</p>

        <h2 style={S.h2}>11. Liên hệ</h2>
        <p style={S.p}>Câu hỏi về điều khoản: <b>support@transflash.app</b></p>

        <p style={S.foot}><a href="/privacy" style={S.link}>Chính sách bảo mật →</a></p>
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
