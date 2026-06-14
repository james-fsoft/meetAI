// Best-effort transactional email via Resend. If RESEND_API_KEY is not set,
// sending is skipped silently (the payment flow still records + shows in admin).
//   RESEND_API_KEY    Resend API key
//   EMAIL_FROM        verified sender, e.g. "Flash Meet <noreply@transflash.app>"

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return false;
  const from = process.env.EMAIL_FROM || "Flash Meet <noreply@transflash.app>";
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

// Simple branded wrapper so emails look consistent.
export function emailLayout(title: string, bodyHtml: string): string {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;color:#0a1124">
    <div style="font-size:18px;font-weight:800;margin-bottom:14px">🎙️ Flash Meet</div>
    <div style="background:#fff;border:1px solid #e3e8f2;border-radius:14px;padding:22px">
      <h2 style="font-size:17px;margin:0 0 12px">${title}</h2>
      ${bodyHtml}
    </div>
    <div style="font-size:12px;color:#9aa6bd;margin-top:14px">TransFlash · meet.transflash.app · support@transflash.app</div>
  </div>`;
}

type Pay = { id: string; email: string | null; plan: string; billing: string; amount: number; content: string };

// Sends the "order received" email to the user + the "new order" alert to admin,
// records which succeeded on the payment row, and returns the status. Used by
// both the create-order flow and the admin "resend" action.
export async function sendOrderEmails(admin: any, pay: Pay, fallbackEmail?: string | null) {
  const { fmtVnd, CONFIRM_HOURS } = await import("./billing");
  const amountStr = fmtVnd(pay.amount);
  const billLabel = pay.billing === "annual" ? "theo năm" : "theo tháng";
  const to = pay.email || fallbackEmail || "";

  const userOk = to ? await sendEmail(
    to, "Đã nhận yêu cầu thanh toán — Flash Meet",
    emailLayout("Cảm ơn bạn! 🎉", `
      <p style="font-size:14px;line-height:1.6;color:#33405c">Chúng tôi đã nhận được yêu cầu thanh toán gói <b>${pay.plan.toUpperCase()}</b> (${billLabel}).</p>
      <p style="font-size:14px;line-height:1.6;color:#33405c">Số tiền: <b>${amountStr}</b><br>Nội dung CK: <b>${pay.content}</b></p>
      <p style="font-size:14px;line-height:1.6;color:#33405c">Admin sẽ kiểm tra và kích hoạt gói cho bạn <b>trong vòng ${CONFIRM_HOURS} giờ</b>. Bạn sẽ nhận email khi gói được kích hoạt.</p>
      <p style="font-size:13px;color:#9aa6bd">Nếu đã chuyển khoản nhưng quá thời gian trên chưa được kích hoạt, vui lòng liên hệ support@transflash.app.</p>
    `)
  ) : false;

  const adminTo = process.env.ADMIN_NOTIFY_EMAIL || "support@transflash.app";
  const adminOk = await sendEmail(
    adminTo, `💰 Đơn chờ xác nhận: ${pay.plan.toUpperCase()} · ${amountStr}`,
    emailLayout("Có đơn thanh toán mới cần xác nhận", `
      <p style="font-size:14px;line-height:1.6;color:#33405c">
        Người dùng: <b>${pay.email || "—"}</b><br>
        Gói: <b>${pay.plan.toUpperCase()}</b> (${pay.billing})<br>
        Số tiền: <b>${amountStr}</b><br>
        Nội dung CK: <b>${pay.content}</b>
      </p>
      <p style="font-size:14px;color:#33405c">Vào trang Admin → Thanh toán để xác nhận.</p>
    `)
  );

  try {
    await admin.from("payments").update({
      user_email_sent: userOk, admin_email_sent: adminOk, last_email_at: new Date().toISOString(),
    }).eq("id", pay.id);
  } catch {}

  return { user: userOk, admin: adminOk };
}
