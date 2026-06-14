// Best-effort transactional email via Resend. If RESEND_API_KEY is not set,
// sending is skipped silently (the payment flow still records + shows in admin).
//   RESEND_API_KEY    Resend API key
//   EMAIL_FROM        verified sender, e.g. "Flash Meet <noreply@transflash.app>"

// Returns the real outcome incl. the Resend error so failures can be surfaced.
export async function sendEmailDetailed(to: string, subject: string, html: string): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY chưa cấu hình" };
  if (!to) return { ok: false, error: "thiếu địa chỉ nhận" };
  const from = process.env.EMAIL_FROM || "Flash Meet <noreply@transflash.app>";
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (r.ok) return { ok: true };
    let detail = "";
    try { const d = await r.json(); detail = d.message || d.error || JSON.stringify(d); } catch {}
    return { ok: false, error: `Resend ${r.status}: ${detail}` };
  } catch (e: any) {
    return { ok: false, error: e?.message || "network error" };
  }
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  return (await sendEmailDetailed(to, subject, html)).ok;
}

const LOGO_URL = "https://meet.transflash.app/email-logo.png";
const FONT = "-apple-system,'Segoe UI',Inter,Roboto,Arial,sans-serif";

type LayoutOpts = { preheader?: string; cta?: { text: string; url: string } };

// Professional, table-based responsive email shell (works in Gmail/Apple/Outlook).
export function emailLayout(title: string, bodyHtml: string, opts: LayoutOpts = {}): string {
  const cta = opts.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 4px">
         <tr><td align="center" bgcolor="#1f6bff" style="border-radius:11px">
           <a href="${opts.cta.url}" style="display:inline-block;padding:13px 28px;font-family:${FONT};font-size:14px;font-weight:800;color:#ffffff;text-decoration:none;border-radius:11px">${opts.cta.text}</a>
         </td></tr>
       </table>` : "";
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${opts.preheader}</div>` : "";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef1f7">
${preheader}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f7;padding:30px 14px">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
      <tr><td align="center" style="padding-bottom:20px">
        <img src="${LOGO_URL}" width="40" height="40" alt="Flash Meet" style="vertical-align:middle;border:0">
        <span style="font-family:${FONT};font-size:21px;font-weight:800;color:#0a1124;letter-spacing:-.02em;vertical-align:middle;margin-left:10px">Flash Meet</span>
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e6eaf2;border-radius:18px;padding:32px 32px 28px;box-shadow:0 18px 40px -28px rgba(10,17,36,.4)">
        <h1 style="font-family:${FONT};font-size:20px;font-weight:800;color:#0a1124;margin:0 0 16px;letter-spacing:-.02em">${title}</h1>
        ${bodyHtml}
        ${cta}
      </td></tr>
      <tr><td align="center" style="padding:20px 12px 0;font-family:${FONT}">
        <div style="font-size:12.5px;color:#8a96ac;line-height:1.7">
          <b style="color:#5b6b8c">TransFlash</b> · Flash Meet — dịch họp trực tiếp & tóm tắt AI<br>
          <a href="https://meet.transflash.app" style="color:#1f6bff;text-decoration:none">meet.transflash.app</a> &nbsp;·&nbsp;
          <a href="mailto:support@transflash.app" style="color:#1f6bff;text-decoration:none">support@transflash.app</a><br>
          <a href="https://meet.transflash.app/privacy" style="color:#9aa6bd;text-decoration:none">Chính sách bảo mật</a> &nbsp;·&nbsp;
          <a href="https://meet.transflash.app/terms" style="color:#9aa6bd;text-decoration:none">Điều khoản dịch vụ</a>
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

// A clean key/value box for order details.
export function infoBox(rows: [string, string][]): string {
  const cells = rows.map(([l, v], i) => {
    const border = i < rows.length - 1 ? "border-bottom:1px solid #eef2f9;" : "";
    return `<tr>
      <td style="padding:12px 16px;font-family:${FONT};font-size:13px;color:#7b88a3;font-weight:600;${border}">${l}</td>
      <td align="right" style="padding:12px 16px;font-family:${FONT};font-size:14.5px;color:#0a1124;font-weight:800;${border}">${v}</td>
    </tr>`;
  }).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f9fc;border:1px solid #e6eaf2;border-radius:12px;margin:8px 0 4px">${cells}</table>`;
}

const P = `font-family:${FONT};font-size:14.5px;line-height:1.65;color:#3a4660;margin:0 0 14px`;
const para = (html: string) => `<p style="${P}">${html}</p>`;

type Pay = { id: string; email: string | null; plan: string; billing: string; amount: number; content: string };

// Sends the "order received" email to the user + the "new order" alert to admin,
// records which succeeded on the payment row, and returns the status. Used by
// both the create-order flow and the admin "resend" action.
export async function sendOrderEmails(admin: any, pay: Pay, fallbackEmail?: string | null) {
  const { fmtVnd, CONFIRM_HOURS } = await import("./billing");
  const amountStr = fmtVnd(pay.amount);
  const billLabel = pay.billing === "annual" ? "theo năm" : "theo tháng";
  const to = pay.email || fallbackEmail || "";

  const userRes = to ? await sendEmailDetailed(
    to, "Đã nhận yêu cầu thanh toán — Flash Meet",
    emailLayout("Cảm ơn bạn! Chúng tôi đã nhận yêu cầu 🎉",
      para(`Chúng tôi đã ghi nhận yêu cầu thanh toán của bạn và đang chờ đối soát chuyển khoản.`) +
      infoBox([
        ["Gói", `${pay.plan.toUpperCase()} · ${billLabel}`],
        ["Số tiền", amountStr],
        ["Nội dung CK", pay.content],
      ]) +
      para(`Admin sẽ kiểm tra và <b style="color:#0a1124">kích hoạt gói trong vòng ${CONFIRM_HOURS} giờ</b>. Bạn sẽ nhận thêm một email khi gói được kích hoạt.`) +
      `<p style="font-family:${FONT};font-size:12.5px;color:#9aa6bd;line-height:1.6;margin:0">Đã chuyển khoản nhưng quá thời gian trên chưa được kích hoạt? Liên hệ <a href="mailto:support@transflash.app" style="color:#1f6bff;text-decoration:none">support@transflash.app</a>.</p>`,
      { preheader: `Yêu cầu gói ${pay.plan.toUpperCase()} (${amountStr}) đã được ghi nhận.` })
  ) : { ok: false, error: "không có email khách" };

  const adminTo = process.env.ADMIN_NOTIFY_EMAIL || "support@transflash.app";
  const adminRes = await sendEmailDetailed(
    adminTo, `💰 Đơn chờ xác nhận: ${pay.plan.toUpperCase()} · ${amountStr}`,
    emailLayout("Có đơn thanh toán mới cần xác nhận",
      para(`Một khách hàng vừa báo đã chuyển khoản. Vui lòng đối soát và xác nhận.`) +
      infoBox([
        ["Người dùng", pay.email || "—"],
        ["Gói", `${pay.plan.toUpperCase()} · ${pay.billing}`],
        ["Số tiền", amountStr],
        ["Nội dung CK", pay.content],
      ]),
      { cta: { text: "Mở trang Admin →", url: "https://meet.transflash.app/admin" } })
  );

  try {
    await admin.from("payments").update({
      user_email_sent: userRes.ok, admin_email_sent: adminRes.ok, last_email_at: new Date().toISOString(),
    }).eq("id", pay.id);
  } catch {}

  return { user: userRes.ok, admin: adminRes.ok, userError: userRes.error, adminError: adminRes.error };
}
