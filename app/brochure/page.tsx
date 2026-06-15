"use client";

import { useEffect, useState } from "react";

/* Printable product brochure for Flash Meet, in Vietnamese or English
   (/brochure?lang=vi|en). Light A4 layout designed to "Save as PDF" cleanly. */

type Lang = "vi" | "en";

const C: Record<Lang, any> = {
  vi: {
    back: "← Quay lại", hint: "Trong hộp thoại in, chọn “Lưu dưới dạng PDF”.", dl: "Tải PDF",
    eyebrow: "Dịch họp realtime · Việt · Hàn · Anh",
    h1a: "Họp với đối tác Hàn Quốc,", h1b: "không còn rào cản ngôn ngữ.",
    lead: "Flash Meet dịch phụ đề trực tiếp trong cuộc họp, nhận diện người nói và tự động tạo tóm tắt, việc cần làm và quyết định ngay sau khi cuộc họp kết thúc.",
    demoTr: "Chúng tôi sẽ gửi proposal trong tuần này.",
    notesHd: "AI Meeting Notes", kSum: "Tóm tắt", sum: "Đối tác cam kết gửi proposal trong tuần; chốt demo cuối tháng.",
    kTask: "Việc cần làm", task: "Soo Park — gửi proposal (T6) · Minh Lê — chuẩn bị demo",
    feats: [
      ["Phụ đề song ngữ realtime", "Dịch trực tiếp Việt / Hàn / Anh ngay trong lúc đang họp."],
      ["AI Meeting Notes", "Tự động tạo tóm tắt, quyết định, rủi ro và việc cần làm."],
      ["Speaker Recognition", "Biết ai nói gì, giúp biên bản rõ ràng và dễ tra cứu."],
      ["Works where you meet", "Google Meet, Zoom, Microsoft Teams, YouTube & Chrome Extension."],
    ],
    foot1: "Một giải pháp của TransFlash · meet.transflash.app",
    head2: "Cách hoạt động · Use cases · Bảng giá",
    h2a: "Từ cuộc họp đến kết quả rõ ràng — trong 3 bước",
    steps: [
      ["01", "Kết nối cuộc họp / mở Extension", "Bắt đầu trên trình duyệt hoặc dịch ngay trong tab họp."],
      ["02", "Phụ đề song ngữ realtime", "Câu gốc và bản dịch hiển thị cạnh nhau, kèm người nói."],
      ["03", "Tóm tắt & biên bản tự động", "AI tổng hợp quyết định, việc cần làm, rủi ro — sẵn sàng gửi."],
    ],
    h2b: "Thiết kế cho các đội làm việc xuyên ngôn ngữ",
    uc: [
      ["Sales với đối tác Hàn Quốc", "Hiểu đúng yêu cầu, thống nhất next step, follow-up nhanh hơn."],
      ["Demo sản phẩm quốc tế", "Không bỏ lỡ feedback kỹ thuật, câu hỏi và quyết định của khách."],
      ["Đào tạo nội bộ đa ngôn ngữ", "Tự động tạo transcript và tài liệu tóm tắt cho cả team."],
    ],
    h2c: "Bảng giá",
    plans: [["Free", "Miễn phí", "Phụ đề realtime · tóm tắt cơ bản"], ["Pro", "9,99 $/tháng", "1.000 phút dịch · AI Notes đầy đủ"], ["Business", "29,99 $/tháng", "5.000 phút dịch · nhiều tài khoản"]],
    ctaB: "Dùng thử miễn phí ngay hôm nay", ctaS: "Không cần thẻ tín dụng · Cài đặt trong 1 phút",
    foot2: "Một giải pháp của TransFlash · support@transflash.app",
  },
  en: {
    back: "← Back", hint: "In the print dialog, choose “Save as PDF”.", dl: "Download PDF",
    eyebrow: "Live meeting translation · VI · KO · EN",
    h1a: "Meet your Korean partners,", h1b: "without the language barrier.",
    lead: "Flash Meet translates meetings live with bilingual subtitles, recognises speakers, and automatically writes the summary, action items and decisions the moment the meeting ends.",
    demoTr: "We'll send the proposal this week.",
    notesHd: "AI Meeting Notes", kSum: "Summary", sum: "Partner commits to send the proposal this week; demo set for end of month.",
    kTask: "Action items", task: "Soo Park — send proposal (Fri) · Minh Lê — prepare demo",
    feats: [
      ["Real-time bilingual subtitles", "Live translation across Vietnamese / Korean / English during the meeting."],
      ["AI Meeting Notes", "Automatic summary, decisions, risks and action items."],
      ["Speaker recognition", "Know who said what — clear, searchable minutes."],
      ["Works where you meet", "Google Meet, Zoom, Microsoft Teams, YouTube & Chrome Extension."],
    ],
    foot1: "A TransFlash solution · meet.transflash.app",
    head2: "How it works · Use cases · Pricing",
    h2a: "From meeting to clear outcomes — in 3 steps",
    steps: [
      ["01", "Join the meeting / open the extension", "Start in your browser or translate right in the meeting tab."],
      ["02", "Real-time bilingual subtitles", "Original and translation side by side, with speaker labels."],
      ["03", "Automatic summary & minutes", "AI compiles decisions, action items and risks — ready to share."],
    ],
    h2b: "Built for teams working across languages",
    uc: [
      ["Sales with Korean partners", "Understand requirements, align on next steps, follow up faster."],
      ["International product demos", "Never miss technical feedback, questions or customer decisions."],
      ["Multilingual internal training", "Auto-generate transcripts and summary docs for the whole team."],
    ],
    h2c: "Pricing",
    plans: [["Free", "Free", "Real-time subtitles · basic summary"], ["Pro", "$9.99/mo", "1,000 translation min · full AI Notes"], ["Business", "$29.99/mo", "5,000 translation min · multiple seats"]],
    ctaB: "Start free today", ctaS: "No credit card · 1-minute setup",
    foot2: "A TransFlash solution · support@transflash.app",
  },
};

export default function Brochure() {
  const [lang, setLang] = useState<Lang>("vi");
  useEffect(() => {
    try { const l = new URLSearchParams(location.search).get("lang"); if (l === "en") setLang("en"); } catch {}
  }, []);
  const t = C[lang];
  const print = () => window.print();

  return (
    <div className="bx">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="bx-bar no-print">
        <a href="/" className="bx-back">{t.back}</a>
        <div className="bx-bar-r">
          <span className="bx-langs">
            <button className={lang === "vi" ? "on" : ""} onClick={() => setLang("vi")}>VI</button>
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
          </span>
          <span className="bx-hint">{t.hint}</span>
          <button className="bx-dl" onClick={print}><Pdf /> {t.dl}</button>
        </div>
      </div>

      {/* Page 1 */}
      <section className="bx-sheet">
        <header className="bx-head">
          <div className="bx-brand"><Logo /><span>Flash Meet</span></div>
          <span className="bx-url">meet.transflash.app</span>
        </header>
        <div className="bx-hero">
          <span className="bx-eyebrow">{t.eyebrow}</span>
          <h1>{t.h1a}<br /><span className="bx-accent">{t.h1b}</span></h1>
          <p className="bx-lead">{t.lead}</p>
        </div>
        <div className="bx-demo">
          <div className="bx-demo-l">
            <div className="bx-demo-lb"><span className="bx-d" />Ji-ho Kim · 12:04</div>
            <div className="bx-ko">이번 주까지 제안서를 공유드리겠습니다.</div>
            <div className="bx-vi">{t.demoTr}</div>
          </div>
          <div className="bx-demo-r">
            <div className="bx-demo-hd">{t.notesHd}</div>
            <div className="bx-k">{t.kSum}</div><p>{t.sum}</p>
            <div className="bx-k">{t.kTask}</div><p>{t.task}</p>
          </div>
        </div>
        <div className="bx-feats">
          {t.feats.map(([ti, d]: [string, string]) => (
            <div key={ti} className="bx-feat"><div className="bx-feat-dot" /><div><b>{ti}</b><span>{d}</span></div></div>
          ))}
        </div>
        <footer className="bx-foot">{t.foot1}</footer>
      </section>

      {/* Page 2 */}
      <section className="bx-sheet">
        <header className="bx-head">
          <div className="bx-brand"><Logo /><span>Flash Meet</span></div>
          <span className="bx-url">{t.head2}</span>
        </header>
        <h2 className="bx-h2">{t.h2a}</h2>
        <div className="bx-steps">
          {t.steps.map(([n, ti, d]: [string, string, string]) => (
            <div key={n} className="bx-step"><div className="bx-step-n">{n}</div><b>{ti}</b><span>{d}</span></div>
          ))}
        </div>
        <h2 className="bx-h2">{t.h2b}</h2>
        <div className="bx-uc">
          {t.uc.map(([ti, d]: [string, string]) => (
            <div key={ti} className="bx-uc-item"><b>{ti}</b><span>{d}</span></div>
          ))}
        </div>
        <h2 className="bx-h2">{t.h2c}</h2>
        <div className="bx-price">
          {t.plans.map(([n, p, d]: [string, string, string]) => (
            <div key={n} className="bx-plan"><div className="bx-plan-n">{n}</div><div className="bx-plan-p">{p}</div><span>{d}</span></div>
          ))}
        </div>
        <div className="bx-cta">
          <div><b>{t.ctaB}</b><span>{t.ctaS}</span></div>
          <div className="bx-cta-url">meet.transflash.app</div>
        </div>
        <footer className="bx-foot">{t.foot2}</footer>
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
.bx-bar{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:16px;background:#0a1430;color:#fff;padding:12px 20px}
.bx-back{color:#cbd5e1;font-size:13.5px;font-weight:700;text-decoration:none}
.bx-bar-r{display:flex;align-items:center;gap:14px}
.bx-langs{display:flex;border:1px solid #2a3a5c;border-radius:8px;overflow:hidden}
.bx-langs button{background:none;border:none;color:#aebdd8;font-family:inherit;font-size:12px;font-weight:800;padding:6px 11px;cursor:pointer}
.bx-langs button.on{background:#2563ff;color:#fff}
.bx-hint{font-size:12.5px;color:#94a3b8}
.bx-dl{display:inline-flex;align-items:center;gap:8px;background:var(--acc);color:#fff;border:none;cursor:pointer;font-family:inherit;font-size:14px;font-weight:700;border-radius:10px;padding:10px 18px}
.bx-dl:hover{background:#1d56e0}
.bx-sheet{width:210mm;min-height:296mm;margin:24px auto;background:#fff;padding:18mm 18mm 14mm;box-shadow:0 30px 60px -30px rgba(10,20,48,.35);position:relative;display:flex;flex-direction:column}
.bx-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:14px;border-bottom:1px solid var(--hair);margin-bottom:26px}
.bx-brand{display:flex;align-items:center;gap:9px;font-size:16px;font-weight:800}
.bx-url{font-size:12px;color:var(--mut);font-weight:600}
.bx-eyebrow{display:inline-block;font-size:11.5px;font-weight:700;color:var(--acc);background:#eaf1ff;border:1px solid #d6e4ff;border-radius:30px;padding:5px 12px;margin-bottom:16px}
.bx-hero h1{font-size:38px;line-height:1.1;margin:0 0 14px}
.bx-accent{color:var(--acc)}
.bx-lead{font-size:15.5px;color:#42506b;line-height:1.6;max-width:165mm;margin:0}
.bx-demo{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:24px 0 26px}
.bx-demo-l,.bx-demo-r{background:var(--soft);border:1px solid var(--hair);border-radius:14px;padding:16px 18px}
.bx-demo-lb{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:700;color:var(--mut);margin-bottom:8px}
.bx-d{width:7px;height:7px;border-radius:50%;background:var(--acc2)}
.bx-ko{font-size:13.5px;color:#42506b}
.bx-vi{font-size:15px;font-weight:700;margin-top:5px}
.bx-demo-hd{font-size:12px;font-weight:800;color:var(--acc);margin-bottom:10px}
.bx-k{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mut);margin:8px 0 4px}
.bx-demo-r p{font-size:13px;color:#42506b;line-height:1.5;margin:0}
.bx-feats{display:grid;grid-template-columns:1fr 1fr;gap:14px 22px;margin-top:6px}
.bx-feat{display:flex;gap:11px}
.bx-feat-dot{flex-shrink:0;width:10px;height:10px;border-radius:3px;background:var(--acc);margin-top:5px}
.bx-feat b{display:block;font-size:14.5px;margin-bottom:2px}
.bx-feat span{font-size:12.5px;color:var(--mut);line-height:1.5}
.bx-foot{margin-top:auto;padding-top:22px;font-size:11.5px;color:var(--mut);text-align:center;font-weight:600}
.bx-h2{font-size:20px;margin:0 0 14px}
.bx-sheet .bx-h2:not(:first-of-type){margin-top:26px}
.bx-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.bx-step{background:var(--soft);border:1px solid var(--hair);border-radius:13px;padding:16px}
.bx-step-n{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;background:#eaf1ff;color:var(--acc);font-size:12px;font-weight:800;margin-bottom:11px}
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
.bx-cta{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:28px;background:#0a1430;border-radius:16px;padding:22px 26px;color:#fff}
.bx-cta b{display:block;font-size:17px;margin-bottom:4px}
.bx-cta span{font-size:13px;color:#aebdd8}
.bx-cta-url{font-size:16px;font-weight:800;color:#7fb0ff}
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
