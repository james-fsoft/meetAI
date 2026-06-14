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
