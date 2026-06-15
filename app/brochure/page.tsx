"use client";

/* Printable product brochure for Flash Meet. Light, premium A4 layout designed
   to "Save as PDF" cleanly. Linked from the homepage preview. */

export default function Brochure() {
  const print = () => window.print();
  return (
    <div className="bx">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="bx-bar no-print">
        <a href="/" className="bx-back">← Quay lại</a>
        <div className="bx-bar-r">
          <span className="bx-hint">Trong hộp thoại in, chọn “Lưu dưới dạng PDF”.</span>
          <button className="bx-dl" onClick={print}><Pdf /> Tải PDF</button>
        </div>
      </div>

      {/* ── Page 1 ── */}
      <section className="bx-sheet">
        <header className="bx-head">
          <div className="bx-brand"><Logo /><span>Flash Meet</span></div>
          <span className="bx-url">meet.transflash.app</span>
        </header>

        <div className="bx-hero">
          <span className="bx-eyebrow">Dịch họp realtime · Việt · Hàn · Anh</span>
          <h1>Họp với đối tác Hàn Quốc,<br /><span className="bx-accent">không còn rào cản ngôn ngữ.</span></h1>
          <p className="bx-lead">
            Flash Meet dịch phụ đề trực tiếp trong cuộc họp, nhận diện người nói và tự động tạo
            tóm tắt, việc cần làm và quyết định ngay sau khi cuộc họp kết thúc.
          </p>
        </div>

        <div className="bx-demo">
          <div className="bx-demo-l">
            <div className="bx-demo-lb"><span className="bx-d" />Ji-ho Kim · 12:04</div>
            <div className="bx-ko">이번 주까지 제안서를 공유드리겠습니다.</div>
            <div className="bx-vi">Chúng tôi sẽ gửi proposal trong tuần này.</div>
          </div>
          <div className="bx-demo-r">
            <div className="bx-demo-hd">AI Meeting Notes</div>
            <div className="bx-k">Tóm tắt</div>
            <p>Đối tác cam kết gửi proposal trong tuần; chốt demo cuối tháng.</p>
            <div className="bx-k">Việc cần làm</div>
            <p>Soo Park — gửi proposal (T6) · Minh Lê — chuẩn bị demo</p>
          </div>
        </div>

        <div className="bx-feats">
          {[
            ["Phụ đề song ngữ realtime", "Dịch trực tiếp Việt / Hàn / Anh ngay trong lúc đang họp."],
            ["AI Meeting Notes", "Tự động tạo tóm tắt, quyết định, rủi ro và việc cần làm."],
            ["Speaker Recognition", "Biết ai nói gì, giúp biên bản rõ ràng và dễ tra cứu."],
            ["Works where you meet", "Google Meet, Zoom, Microsoft Teams, YouTube & Chrome Extension."],
          ].map(([t, d]) => (
            <div key={t} className="bx-feat">
              <div className="bx-feat-dot" />
              <div><b>{t}</b><span>{d}</span></div>
            </div>
          ))}
        </div>

        <footer className="bx-foot">Một giải pháp của TransFlash · meet.transflash.app</footer>
      </section>

      {/* ── Page 2 ── */}
      <section className="bx-sheet">
        <header className="bx-head">
          <div className="bx-brand"><Logo /><span>Flash Meet</span></div>
          <span className="bx-url">Cách hoạt động · Use cases · Bảng giá</span>
        </header>

        <h2 className="bx-h2">Từ cuộc họp đến kết quả rõ ràng — trong 3 bước</h2>
        <div className="bx-steps">
          {[
            ["01", "Kết nối cuộc họp / mở Extension", "Bắt đầu trên trình duyệt hoặc dịch ngay trong tab họp."],
            ["02", "Phụ đề song ngữ realtime", "Câu gốc và bản dịch hiển thị cạnh nhau, kèm người nói."],
            ["03", "Tóm tắt & biên bản tự động", "AI tổng hợp quyết định, việc cần làm, rủi ro — sẵn sàng gửi."],
          ].map(([n, t, d]) => (
            <div key={n} className="bx-step"><div className="bx-step-n">{n}</div><b>{t}</b><span>{d}</span></div>
          ))}
        </div>

        <h2 className="bx-h2">Thiết kế cho các đội làm việc xuyên ngôn ngữ</h2>
        <div className="bx-uc">
          {[
            ["Sales với đối tác Hàn Quốc", "Hiểu đúng yêu cầu, thống nhất next step, follow-up nhanh hơn."],
            ["Demo sản phẩm quốc tế", "Không bỏ lỡ feedback kỹ thuật, câu hỏi và quyết định của khách."],
            ["Đào tạo nội bộ đa ngôn ngữ", "Tự động tạo transcript và tài liệu tóm tắt cho cả team."],
          ].map(([t, d]) => (
            <div key={t} className="bx-uc-item"><b>{t}</b><span>{d}</span></div>
          ))}
        </div>

        <h2 className="bx-h2">Bảng giá</h2>
        <div className="bx-price">
          {[
            ["Free", "Miễn phí", "Phụ đề realtime · tóm tắt cơ bản"],
            ["Pro", "9,99 $/tháng", "1.000 phút dịch · AI Notes đầy đủ"],
            ["Business", "29,99 $/tháng", "5.000 phút dịch · nhiều tài khoản"],
          ].map(([n, p, d]) => (
            <div key={n} className="bx-plan"><div className="bx-plan-n">{n}</div><div className="bx-plan-p">{p}</div><span>{d}</span></div>
          ))}
        </div>

        <div className="bx-cta">
          <div>
            <b>Dùng thử miễn phí ngay hôm nay</b>
            <span>Không cần thẻ tín dụng · Cài đặt trong 1 phút</span>
          </div>
          <div className="bx-cta-url">meet.transflash.app</div>
        </div>

        <footer className="bx-foot">Một giải pháp của TransFlash · support@transflash.app</footer>
      </section>
    </div>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 100 100" width="24" height="24" aria-hidden>
      <path d="M22 8 H78 a16 16 0 0 1 16 16 V60 a16 16 0 0 1 -16 16 H50 l-20 18 v-18 H22 a16 16 0 0 1 -16 -16 V24 A16 16 0 0 1 22 8 Z" fill="#2563ff" />
      <g fill="#fff"><rect x="26" y="38" width="7.5" height="12" rx="3.75" /><rect x="39" y="29" width="7.5" height="30" rx="3.75" /><rect x="52" y="22" width="7.5" height="44" rx="3.75" /><rect x="65" y="32" width="7.5" height="24" rx="3.75" /></g>
    </svg>
  );
}
function Pdf() { return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>; }

const CSS = `
.bx{--ink:#0a1430;--mut:#5b6b8c;--acc:#2563ff;--acc2:#3b82f6;--hair:#e6ebf5;--soft:#f6f9ff;
  font-family:'Inter',system-ui,-apple-system,sans-serif;color:var(--ink);background:#eef2f9;min-height:100vh;
  -webkit-font-smoothing:antialiased;letter-spacing:-.012em;padding-bottom:40px}
.bx *{box-sizing:border-box}
.bx h1,.bx h2,.bx b{font-weight:800;letter-spacing:-.025em}

/* toolbar */
.bx-bar{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:16px;
  background:#0a1430;color:#fff;padding:12px 20px}
.bx-back{color:#cbd5e1;font-size:13.5px;font-weight:700;text-decoration:none}
.bx-bar-r{display:flex;align-items:center;gap:16px}
.bx-hint{font-size:12.5px;color:#94a3b8}
.bx-dl{display:inline-flex;align-items:center;gap:8px;background:var(--acc);color:#fff;border:none;cursor:pointer;
  font-family:inherit;font-size:14px;font-weight:700;border-radius:10px;padding:10px 18px}
.bx-dl:hover{background:#1d56e0}

/* A4 sheet */
.bx-sheet{width:210mm;min-height:296mm;margin:24px auto;background:#fff;padding:18mm 18mm 14mm;
  box-shadow:0 30px 60px -30px rgba(10,20,48,.35);position:relative;display:flex;flex-direction:column}
.bx-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:14px;border-bottom:1px solid var(--hair);margin-bottom:26px}
.bx-brand{display:flex;align-items:center;gap:9px;font-size:16px;font-weight:800}
.bx-url{font-size:12px;color:var(--mut);font-weight:600}

/* hero */
.bx-eyebrow{display:inline-block;font-size:11.5px;font-weight:700;color:var(--acc);background:#eaf1ff;border:1px solid #d6e4ff;
  border-radius:30px;padding:5px 12px;margin-bottom:16px}
.bx-hero h1{font-size:38px;line-height:1.1;margin:0 0 14px}
.bx-accent{color:var(--acc)}
.bx-lead{font-size:15.5px;color:#42506b;line-height:1.6;max-width:165mm;margin:0}

/* demo strip */
.bx-demo{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:24px 0 26px}
.bx-demo-l,.bx-demo-r{background:var(--soft);border:1px solid var(--hair);border-radius:14px;padding:16px 18px}
.bx-demo-lb{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:700;color:var(--mut);margin-bottom:8px}
.bx-d{width:7px;height:7px;border-radius:50%;background:var(--acc2)}
.bx-ko{font-size:13.5px;color:#42506b}
.bx-vi{font-size:15px;font-weight:700;margin-top:5px}
.bx-demo-hd{font-size:12px;font-weight:800;color:var(--acc);margin-bottom:10px}
.bx-k{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mut);margin:8px 0 4px}
.bx-demo-r p{font-size:13px;color:#42506b;line-height:1.5;margin:0}

/* features */
.bx-feats{display:grid;grid-template-columns:1fr 1fr;gap:14px 22px;margin-top:6px}
.bx-feat{display:flex;gap:11px}
.bx-feat-dot{flex-shrink:0;width:10px;height:10px;border-radius:3px;background:var(--acc);margin-top:5px}
.bx-feat b{display:block;font-size:14.5px;margin-bottom:2px}
.bx-feat span{font-size:12.5px;color:var(--mut);line-height:1.5}

.bx-foot{margin-top:auto;padding-top:22px;font-size:11.5px;color:var(--mut);text-align:center;font-weight:600}

/* page 2 */
.bx-h2{font-size:20px;margin:0 0 14px}
.bx-sheet .bx-h2:not(:first-of-type){margin-top:26px}
.bx-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.bx-step{background:var(--soft);border:1px solid var(--hair);border-radius:13px;padding:16px}
.bx-step-n{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;background:#eaf1ff;color:var(--acc);
  font-size:12px;font-weight:800;margin-bottom:11px}
.bx-step b{display:block;font-size:14px;margin-bottom:5px;line-height:1.3}
.bx-step span{font-size:12.5px;color:var(--mut);line-height:1.5}
.bx-uc{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.bx-uc-item{border:1px solid var(--hair);border-radius:13px;padding:16px}
.bx-uc-item b{display:block;font-size:14px;margin-bottom:5px;line-height:1.3}
.bx-uc-item span{font-size:12.5px;color:var(--mut);line-height:1.5}
.bx-price{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.bx-plan{border:1px solid var(--hair);border-radius:13px;padding:16px}
.bx-plan:nth-child(2){border-color:#cdddff;background:var(--soft)}
.bx-plan-n{font-size:13px;font-weight:800;color:var(--mut)}
.bx-plan-p{font-size:20px;font-weight:900;margin:4px 0 6px}
.bx-plan span{font-size:12px;color:var(--mut);line-height:1.5}
.bx-cta{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:28px;
  background:#0a1430;border-radius:16px;padding:22px 26px;color:#fff}
.bx-cta b{display:block;font-size:17px;margin-bottom:4px}
.bx-cta span{font-size:13px;color:#aebdd8}
.bx-cta-url{font-size:16px;font-weight:800;color:#7fb0ff}

/* print */
@media print{
  @page{size:A4;margin:0}
  .bx{background:#fff;padding:0}
  .no-print{display:none!important}
  .bx-sheet{width:auto;min-height:100vh;margin:0;box-shadow:none;padding:16mm 16mm 12mm;page-break-after:always}
  .bx-sheet:last-child{page-break-after:auto}
}
@media(max-width:820px){
  .bx-sheet{width:auto;min-height:0;margin:14px;padding:24px 20px}
  .bx-hero h1{font-size:28px}
  .bx-demo,.bx-feats,.bx-steps,.bx-uc,.bx-price{grid-template-columns:1fr}
  .bx-hint{display:none}
  .bx-cta{flex-direction:column;align-items:flex-start}
}
`;
