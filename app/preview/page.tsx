"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Flash Meet — redesigned homepage (PREVIEW at /preview).
   Self-contained: scoped CSS + inline SVG, no Tailwind / no external deps so it
   cannot affect the live site. Swap into app/page.tsx only when approved.
   ───────────────────────────────────────────────────────────────────────── */

const APP_URL = "/";
const LOGIN_URL = "/login";
const PRICING_URL = "/pricing";
const EXT_URL = "/extension";

export default function PreviewHome() {
  useReveal();
  return (
    <div className="fx">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Header />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <UseCases />
        <Trust />
        <PricingTeaser />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

/* ── Header ──────────────────────────────────────────────────────────────── */
function Header() {
  const [open, setOpen] = useState(false);
  const nav = [
    ["Tính năng", "#features"],
    ["Cách hoạt động", "#how"],
    ["Use cases", "#usecases"],
    ["Bảng giá", PRICING_URL],
    ["FAQ", "#faq"],
  ];
  return (
    <header className="fx-hdr">
      <div className="fx-wrap fx-hdr-in">
        <a href="#top" className="fx-brand" aria-label="Flash Meet">
          <Logo />
          <span>Flash Meet</span>
        </a>
        <nav className="fx-nav" aria-label="Chính">
          {nav.map(([t, h]) => (
            <a key={t} href={h}>{t}</a>
          ))}
        </nav>
        <div className="fx-hdr-cta">
          <a href={LOGIN_URL} className="fx-link">Đăng nhập</a>
          <a href={APP_URL} className="fx-btn fx-btn-sm">Dùng thử miễn phí</a>
        </div>
        <button className="fx-burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div className="fx-mobnav">
          {nav.map(([t, h]) => (
            <a key={t} href={h} onClick={() => setOpen(false)}>{t}</a>
          ))}
          <a href={LOGIN_URL} onClick={() => setOpen(false)}>Đăng nhập</a>
          <a href={APP_URL} className="fx-btn" onClick={() => setOpen(false)}>Dùng thử miễn phí</a>
        </div>
      )}
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="fx-hero" id="top">
      <div className="fx-wrap fx-hero-in">
        <div className="fx-hero-text">
          <span className="fx-eyebrow reveal">Dịch họp realtime · Việt · Hàn · Anh</span>
          <h1 className="fx-h1 reveal">
            Họp với đối tác Hàn Quốc<br />
            <span className="fx-grad">không còn rào cản ngôn ngữ</span>
          </h1>
          <p className="fx-lead reveal">
            Flash Meet dịch phụ đề trực tiếp trong cuộc họp, nhận diện người nói và tự động tạo
            tóm tắt, việc cần làm, quyết định sau khi cuộc họp kết thúc.
          </p>
          <div className="fx-hero-cta reveal">
            <a href={APP_URL} className="fx-btn fx-btn-lg">Dùng thử miễn phí</a>
            <a href="#how" className="fx-btn-ghost fx-btn-lg">
              <PlayIcon /> Xem demo 90 giây
            </a>
          </div>
          <p className="fx-trust reveal">
            Không cần thẻ tín dụng <i>·</i> Cài đặt trong 1 phút <i>·</i> Hỗ trợ Việt / Hàn / Anh
          </p>
        </div>
        <div className="fx-hero-visual reveal">
          <div className="fx-glow" aria-hidden />
          <ProductMockup />
        </div>
      </div>
    </section>
  );
}

/* ── Product mockup (HTML/CSS, no AI faces) ──────────────────────────────── */
function ProductMockup() {
  const people = [
    { i: "JK", n: "Ji-ho Kim", c: "linear-gradient(135deg,#2563ff,#60a5fa)", live: true },
    { i: "ML", n: "Minh Lê", c: "linear-gradient(135deg,#0ea5a8,#22d3ee)" },
    { i: "SP", n: "Soo Park", c: "linear-gradient(135deg,#7c5cff,#a78bfa)" },
    { i: "TN", n: "Trang Nguyễn", c: "linear-gradient(135deg,#f59e0b,#fbbf24)" },
  ];
  return (
    <div className="fx-mock" role="img" aria-label="Giao diện Flash Meet đang dịch một cuộc họp">
      <div className="fx-mock-win">
        <div className="fx-mock-bar">
          <div className="fx-mock-title">
            <span className="fx-live"><i />LIVE</span>
            <span className="fx-mock-name">Sales sync · Seoul ↔ Hà Nội</span>
          </div>
          <span className="fx-mock-time">12:04</span>
        </div>
        <div className="fx-mock-grid">
          {people.map((p) => (
            <div key={p.i} className={"fx-tile" + (p.live ? " on" : "")}>
              <div className="fx-ava" style={{ background: p.c }}>{p.i}</div>
              <div className="fx-tile-foot">
                <span>{p.n}</span>
                {p.live ? <Wave /> : <MicMuted />}
              </div>
            </div>
          ))}
        </div>
        <div className="fx-sub">
          <div className="fx-sub-spk"><span className="fx-dot" style={{ background: "#60a5fa" }} />Ji-ho Kim · 12:04</div>
          <div className="fx-sub-ko">이번 주까지 제안서를 공유드리겠습니다.</div>
          <div className="fx-sub-vi">Chúng tôi sẽ gửi proposal trong tuần này.</div>
        </div>
      </div>

      <div className="fx-notes">
        <div className="fx-notes-hd">
          <span><SparkIcon /> AI Meeting Notes</span>
          <button className="fx-export">Export minutes</button>
        </div>
        <div className="fx-note">
          <div className="fx-note-k">Tóm tắt</div>
          <p>Đối tác Hàn Quốc cam kết gửi proposal trong tuần. Hai bên thống nhất mốc demo cuối tháng.</p>
        </div>
        <div className="fx-note">
          <div className="fx-note-k">Việc cần làm</div>
          <ul className="fx-todo">
            <li><Check /> <b>Soo Park</b> — gửi proposal <span>T6</span></li>
            <li><Check /> <b>Minh Lê</b> — chuẩn bị môi trường demo</li>
          </ul>
        </div>
        <div className="fx-note fx-note-row">
          <div><div className="fx-note-k">Quyết định</div><p>Chốt demo 30/06.</p></div>
          <div><div className="fx-note-k">Rủi ro</div><p>Cần xác nhận ngân sách.</p></div>
        </div>
      </div>
    </div>
  );
}

/* ── Problem ─────────────────────────────────────────────────────────────── */
function Problem() {
  const items = [
    { ic: <EarIcon />, t: "Nghe hiểu không đủ nhanh", d: "Khi đối tác nói tiếng Hàn/Anh, team dễ bỏ lỡ chi tiết quan trọng ngay trong lúc họp." },
    { ic: <PenIcon />, t: "Ghi chú thủ công mất thời gian", d: "Sau cuộc họp vẫn phải nghe lại, tổng hợp và gửi lại biên bản — tốn hàng giờ mỗi tuần." },
    { ic: <FlagIcon />, t: "Follow-up không rõ người phụ trách", d: "Việc cần làm, deadline và quyết định dễ bị trôi sau khi cuộc họp kết thúc." },
  ];
  return (
    <section className="fx-sec">
      <div className="fx-wrap">
        <h2 className="fx-h2 reveal">Cuộc họp đa ngôn ngữ thường mất thông tin quan trọng</h2>
        <div className="fx-3 reveal">
          {items.map((x) => (
            <div key={x.t} className="fx-prob">
              <div className="fx-prob-ic">{x.ic}</div>
              <h3>{x.t}</h3>
              <p>{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How it works ────────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: "01", t: "Kết nối cuộc họp hoặc mở Chrome Extension", d: "Bắt đầu ngay trên trình duyệt, hoặc thêm tiện ích để dịch ngay trong tab họp." },
    { n: "02", t: "Xem phụ đề song ngữ realtime khi đang họp", d: "Câu gốc và bản dịch hiển thị cạnh nhau, kèm nhận diện người nói." },
    { n: "03", t: "Nhận tóm tắt, action items và biên bản ngay sau họp", d: "AI tổng hợp quyết định, việc cần làm và rủi ro — sẵn sàng để gửi đi." },
  ];
  return (
    <section className="fx-sec fx-sec-alt" id="how">
      <div className="fx-wrap">
        <h2 className="fx-h2 reveal">Flash Meet biến cuộc họp thành kết quả rõ ràng</h2>
        <div className="fx-steps reveal">
          {steps.map((s) => (
            <div key={s.n} className="fx-step">
              <div className="fx-step-n">{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features ────────────────────────────────────────────────────────────── */
function Features() {
  const feats = [
    { ic: <CaptionIcon />, t: "Phụ đề song ngữ realtime", d: "Dịch trực tiếp Việt / Hàn / Anh ngay trong lúc đang họp.", mock: <MiniSub /> },
    { ic: <SparkIcon />, t: "AI Meeting Notes", d: "Tự động tạo tóm tắt, quyết định, rủi ro và việc cần làm.", mock: <MiniNotes /> },
    { ic: <UsersIcon />, t: "Speaker Recognition", d: "Biết ai nói gì, giúp biên bản rõ ràng và dễ tra cứu.", mock: <MiniSpeakers /> },
    { ic: <LayersIcon />, t: "Works where you meet", d: "Google Meet, Zoom, Microsoft Teams, YouTube và Chrome Extension.", mock: <MiniPlatforms /> },
  ];
  return (
    <section className="fx-sec" id="features">
      <div className="fx-wrap">
        <h2 className="fx-h2 reveal">Đủ để hiểu trọn mọi cuộc họp — không thừa</h2>
        <div className="fx-feat-grid reveal">
          {feats.map((f) => (
            <div key={f.t} className="fx-feat">
              <div className="fx-feat-top">
                <div className="fx-feat-ic">{f.ic}</div>
                <div>
                  <h3>{f.t}</h3>
                  <p>{f.d}</p>
                </div>
              </div>
              <div className="fx-feat-mock">{f.mock}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Use cases ───────────────────────────────────────────────────────────── */
function UseCases() {
  const cases = [
    { tag: "Sales", t: "Sales meeting với đối tác Hàn Quốc", d: "Hiểu đúng yêu cầu, thống nhất next step và gửi follow-up nhanh hơn." },
    { tag: "Demo", t: "Demo sản phẩm quốc tế", d: "Không bỏ lỡ feedback kỹ thuật, câu hỏi và quyết định của khách hàng." },
    { tag: "Training", t: "Đào tạo nội bộ đa ngôn ngữ", d: "Tự động tạo transcript và tài liệu tóm tắt cho cả team." },
  ];
  return (
    <section className="fx-sec fx-sec-alt" id="usecases">
      <div className="fx-wrap">
        <h2 className="fx-h2 reveal">Thiết kế cho các đội làm việc xuyên ngôn ngữ</h2>
        <div className="fx-3 reveal">
          {cases.map((c) => (
            <div key={c.t} className="fx-uc">
              <span className="fx-uc-tag">{c.tag}</span>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Trust ───────────────────────────────────────────────────────────────── */
function Trust() {
  const works = ["Google Meet", "Zoom", "Microsoft Teams", "YouTube"];
  const sec = [
    "Không cần thẻ tín dụng",
    "Không lưu nội dung họp nếu bạn không bật lưu",
    "Bạn kiểm soát quyền truy cập",
    "Export biên bản dễ dàng",
  ];
  return (
    <section className="fx-sec">
      <div className="fx-wrap fx-trust-sec">
        <div className="fx-works reveal">
          <span className="fx-works-lb">Hoạt động trên nền tảng bạn đang dùng</span>
          <div className="fx-works-row">
            {works.map((w) => (
              <span key={w} className="fx-works-chip">{w}</span>
            ))}
          </div>
        </div>
        <div className="fx-secstrip reveal">
          {sec.map((s) => (
            <div key={s} className="fx-secitem"><ShieldCheck /> {s}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing teaser ──────────────────────────────────────────────────────── */
function PricingTeaser() {
  const plans = [
    { n: "Free", p: "Miễn phí", suf: "", d: "Dùng thử với phút dịch hằng tháng.", feats: ["Phụ đề realtime", "Tóm tắt cơ bản"] },
    { n: "Pro", p: "9,99 $", suf: "/tháng", d: "Cho cá nhân & freelancer.", feats: ["1.000 phút dịch / tháng", "AI Notes đầy đủ"], hi: true },
    { n: "Business", p: "29,99 $", suf: "/tháng", d: "Cho đội & doanh nghiệp.", feats: ["5.000 phút dịch / tháng", "Nhiều tài khoản"] },
  ];
  return (
    <section className="fx-sec fx-sec-alt" id="pricing">
      <div className="fx-wrap">
        <h2 className="fx-h2 reveal">Bắt đầu miễn phí. Nâng cấp khi team cần nhiều giờ dịch hơn.</h2>
        <div className="fx-3 fx-price reveal">
          {plans.map((p) => (
            <div key={p.n} className={"fx-plan" + (p.hi ? " hi" : "")}>
              {p.hi && <span className="fx-plan-badge">Phổ biến</span>}
              <div className="fx-plan-n">{p.n}</div>
              <div className="fx-plan-p">{p.p}{p.suf && <span>{p.suf}</span>}</div>
              <p className="fx-plan-d">{p.d}</p>
              <ul>{p.feats.map((f) => <li key={f}><Check /> {f}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="fx-center reveal"><a href={PRICING_URL} className="fx-btn fx-btn-lg">Xem bảng giá</a></div>
      </div>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
function FAQ() {
  const qa = [
    ["Flash Meet dùng được với Google Meet và Zoom không?", "Có. Flash Meet hoạt động với Google Meet, Zoom, Microsoft Teams và YouTube — chạy trên trình duyệt hoặc qua Chrome Extension."],
    ["Có hỗ trợ tiếng Hàn không?", "Có. Dịch trực tiếp Việt / Hàn / Anh (và nhiều ngôn ngữ khác), kèm phụ đề song ngữ và tóm tắt theo ngôn ngữ bạn chọn."],
    ["Có tự động tạo biên bản không?", "Có. Sau cuộc họp, AI tạo tóm tắt, việc cần làm, quyết định và rủi ro — bạn export ngay."],
    ["Có cần cài app không?", "Không bắt buộc. Bạn dùng trực tiếp trên web, hoặc cài Chrome Extension nếu muốn dịch ngay trong tab họp."],
    ["Dữ liệu cuộc họp có an toàn không?", "Nội dung chỉ được lưu khi bạn bật lưu. Bạn kiểm soát quyền truy cập và có thể xoá bất cứ lúc nào."],
    ["Có bản miễn phí không?", "Có. Bắt đầu miễn phí; nâng cấp Pro/Business khi cần thêm phút dịch và đầy đủ tính năng AI."],
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="fx-sec" id="faq">
      <div className="fx-wrap fx-faq-wrap">
        <h2 className="fx-h2 reveal">Câu hỏi thường gặp</h2>
        <div className="fx-faq reveal">
          {qa.map(([q, a], i) => (
            <div key={q} className={"fx-faq-item" + (open === i ? " open" : "")}>
              <button className="fx-faq-q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                <span>{q}</span><i className="fx-faq-chev" />
              </button>
              <div className="fx-faq-a"><p>{a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ───────────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="fx-sec fx-final">
      <div className="fx-wrap fx-final-in reveal">
        <h2 className="fx-h2 fx-final-h">Biến mọi cuộc họp đa ngôn ngữ thành việc cần làm rõ ràng.</h2>
        <div className="fx-hero-cta fx-center-cta">
          <a href={APP_URL} className="fx-btn fx-btn-lg">Dùng thử miễn phí</a>
          <a href={EXT_URL} className="fx-btn-ghost fx-btn-lg">Cài Chrome Extension</a>
        </div>
        <a href="/brochure" target="_blank" rel="noopener noreferrer" className="fx-pdf">
          <PdfIcon /> Tải brochure giới thiệu (PDF)
        </a>
        <p className="fx-trust">Không cần thẻ tín dụng <i>·</i> Cài đặt trong 1 phút <i>·</i> Hủy bất cứ lúc nào</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="fx-foot">
      <div className="fx-wrap fx-foot-in">
        <a href="#top" className="fx-brand"><Logo /><span>Flash Meet</span></a>
        <span className="fx-foot-by">Một giải pháp của TransFlash</span>
        <div className="fx-foot-links">
          <a href={PRICING_URL}>Bảng giá</a>
          <a href="/privacy">Bảo mật</a>
          <a href="/terms">Điều khoản</a>
        </div>
      </div>
    </footer>
  );
}

/* ── Scroll reveal ───────────────────────────────────────────────────────── */
function useReveal() {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

/* ── Icons (inline, minimal) ─────────────────────────────────────────────── */
const sv = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
function Logo() {
  return (
    <svg viewBox="0 0 100 100" width="26" height="26" aria-hidden>
      <path d="M22 8 H78 a16 16 0 0 1 16 16 V60 a16 16 0 0 1 -16 16 H50 l-20 18 v-18 H22 a16 16 0 0 1 -16 -16 V24 A16 16 0 0 1 22 8 Z" fill="#2563ff" />
      <g fill="#fff"><rect x="26" y="38" width="7.5" height="12" rx="3.75" /><rect x="39" y="29" width="7.5" height="30" rx="3.75" /><rect x="52" y="22" width="7.5" height="44" rx="3.75" /><rect x="65" y="32" width="7.5" height="24" rx="3.75" /></g>
    </svg>
  );
}
function PlayIcon() { return <svg viewBox="0 0 24 24" width="16" height="16" {...sv}><path d="M7 5l11 7-11 7z" fill="currentColor" stroke="none" /></svg>; }
function PdfIcon() { return <svg viewBox="0 0 24 24" width="16" height="16" {...sv}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M12 18v-5M9.5 13h2.5a1.5 1.5 0 0 1 0 3H9.5" opacity=".7" /></svg>; }
function SparkIcon() { return <svg viewBox="0 0 24 24" width="18" height="18" {...sv}><path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" /><path d="M19 14l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" /></svg>; }
function CaptionIcon() { return <svg viewBox="0 0 24 24" width="18" height="18" {...sv}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M8 11h2M14 11h2M7 15h4M13 15h4" /></svg>; }
function UsersIcon() { return <svg viewBox="0 0 24 24" width="18" height="18" {...sv}><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M16 8.2a2.8 2.8 0 0 1 0 5.6M20.5 19a5 5 0 0 0-3-4.6" opacity=".6" /></svg>; }
function LayersIcon() { return <svg viewBox="0 0 24 24" width="18" height="18" {...sv}><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" opacity=".6" /></svg>; }
function EarIcon() { return <svg viewBox="0 0 24 24" width="20" height="20" {...sv}><path d="M7 9a5 5 0 0 1 10 0c0 3-2.5 3.6-2.5 6.2A2.8 2.8 0 0 1 11.7 18M9 18.5h.01M7.5 13.5h.01" /></svg>; }
function PenIcon() { return <svg viewBox="0 0 24 24" width="20" height="20" {...sv}><path d="M4 20l4-1L19 8a2 2 0 0 0-3-3L5 16z" /><path d="M14.5 6.5l3 3" /></svg>; }
function FlagIcon() { return <svg viewBox="0 0 24 24" width="20" height="20" {...sv}><path d="M5 21V4M5 4h11l-2 3 2 3H5" /></svg>; }
function Check() { return <svg viewBox="0 0 24 24" width="15" height="15" {...sv} aria-hidden><path d="M5 12.5l4 4L19 7" /></svg>; }
function ShieldCheck() { return <svg viewBox="0 0 24 24" width="16" height="16" {...sv} aria-hidden><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>; }
function Wave() { return <span className="fx-wv" aria-hidden><i /><i /><i /><i /></span>; }
function MicMuted() { return <svg viewBox="0 0 24 24" width="14" height="14" {...sv} aria-hidden opacity={0.55}><path d="M5 5l14 14M9 9v2a3 3 0 0 0 4.7 2.5M15 11V6a3 3 0 0 0-5.6-1.5" /><path d="M18 11a6 6 0 0 1-1 3.3M6 11a6 6 0 0 0 6 6" /></svg>; }

/* ── Mini feature mocks ──────────────────────────────────────────────────── */
function MiniSub() {
  return (
    <div className="fx-mm">
      <div className="fx-mm-spk"><span className="fx-dot" style={{ background: "#60a5fa" }} />Ji-ho · KO</div>
      <div className="fx-mm-ko">지금 화면 공유할게요.</div>
      <div className="fx-mm-vi">Tôi sẽ chia sẻ màn hình ngay.</div>
    </div>
  );
}
function MiniNotes() {
  return (
    <div className="fx-mm">
      <div className="fx-mm-k">Việc cần làm</div>
      <div className="fx-mm-li"><Check /> Gửi proposal <span>T6</span></div>
      <div className="fx-mm-li"><Check /> Chuẩn bị demo</div>
    </div>
  );
}
function MiniSpeakers() {
  return (
    <div className="fx-mm fx-mm-spkrs">
      {[["JK", "#2563ff"], ["ML", "#0ea5a8"], ["SP", "#7c5cff"]].map(([i, c]) => (
        <span key={i} className="fx-mm-ava" style={{ background: c as string }}>{i}</span>
      ))}
      <span className="fx-mm-spktx">3 người nói được tách</span>
    </div>
  );
}
function MiniPlatforms() {
  return (
    <div className="fx-mm fx-mm-plat">
      {["Meet", "Zoom", "Teams", "YouTube"].map((p) => <span key={p}>{p}</span>)}
    </div>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */
const CSS = `
.fx{--bg:#050B1F;--bg2:#07162F;--bg3:#081C3A;--acc:#2563FF;--acc2:#3B82F6;--acc3:#60A5FA;
  --tx:#FFFFFF;--tx2:#CBD5E1;--mut:#94A3B8;--card:rgba(255,255,255,.04);--bd:rgba(148,163,184,.16);--bdh:rgba(96,165,250,.35);
  font-family:'Inter',system-ui,-apple-system,sans-serif;color:var(--tx);background:var(--bg);
  -webkit-font-smoothing:antialiased;letter-spacing:-.011em}
.fx *{box-sizing:border-box}
body{background:#050B1F}
.fx a{color:inherit;text-decoration:none}
.fx-wrap{max-width:1200px;margin:0 auto;padding:0 24px;width:100%}
.fx h1,.fx h2,.fx h3{margin:0;font-weight:800;letter-spacing:-.03em}
.fx p{margin:0}

/* buttons */
.fx-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--acc);color:#fff;
  font-weight:700;font-size:14px;border-radius:11px;padding:11px 18px;border:1px solid transparent;transition:.18s;white-space:nowrap}
.fx-btn:hover{background:#1d56e0;transform:translateY(-1px);box-shadow:0 10px 26px -12px rgba(37,99,255,.7)}
.fx-btn-sm{padding:9px 15px;font-size:13.5px;border-radius:10px}
.fx-btn-lg{padding:14px 24px;font-size:15px;border-radius:13px}
.fx-btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:8px;color:var(--tx);font-weight:700;font-size:15px;
  border:1px solid var(--bd);background:rgba(255,255,255,.02);border-radius:13px;padding:14px 22px;transition:.18s}
.fx-btn-ghost:hover{border-color:var(--bdh);background:rgba(96,165,250,.06)}
.fx-link{color:var(--tx2);font-weight:600;font-size:14px;transition:.15s}
.fx-link:hover{color:#fff}

/* header */
.fx-hdr{position:sticky;top:0;z-index:50;backdrop-filter:saturate(1.3) blur(12px);-webkit-backdrop-filter:saturate(1.3) blur(12px);
  background:rgba(5,11,31,.72);border-bottom:1px solid rgba(148,163,184,.10)}
.fx-hdr-in{display:flex;align-items:center;gap:24px;height:62px}
.fx-brand{display:inline-flex;align-items:center;gap:10px;font-weight:800;font-size:16px;letter-spacing:-.03em}
.fx-nav{display:flex;align-items:center;gap:26px;margin-left:12px}
.fx-nav a{color:var(--tx2);font-size:14px;font-weight:600;transition:.15s}
.fx-nav a:hover{color:#fff}
.fx-hdr-cta{margin-left:auto;display:flex;align-items:center;gap:16px}
.fx-burger{display:none;margin-left:auto;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px}
.fx-burger span{width:22px;height:2px;background:#cbd5e1;border-radius:2px}
.fx-mobnav{display:flex;flex-direction:column;gap:4px;padding:10px 24px 18px;border-bottom:1px solid var(--bd)}
.fx-mobnav a{padding:11px 4px;color:var(--tx2);font-weight:600;font-size:15px;border-bottom:1px solid rgba(148,163,184,.08)}
.fx-mobnav a.fx-btn{justify-content:center;color:#fff;border-bottom:none;margin-top:8px}

/* hero */
.fx-hero{position:relative;overflow:hidden;padding:84px 0 96px;
  background:radial-gradient(1100px 520px at 78% -8%,rgba(37,99,255,.16),transparent 60%),
    radial-gradient(800px 460px at 0% 10%,rgba(8,28,58,.7),transparent 55%),var(--bg)}
.fx-hero-in{display:grid;grid-template-columns:46% 54%;align-items:center;gap:40px}
.fx-eyebrow{display:inline-block;font-size:12.5px;font-weight:700;letter-spacing:.02em;color:var(--acc3);
  background:rgba(96,165,250,.10);border:1px solid rgba(96,165,250,.22);border-radius:30px;padding:6px 14px;margin-bottom:22px}
.fx-h1{font-size:54px;line-height:1.06;letter-spacing:-.035em}
.fx-grad{background:linear-gradient(100deg,#60a5fa,#3b82f6 55%,#22d3ee);-webkit-background-clip:text;background-clip:text;color:transparent}
.fx-lead{font-size:18px;line-height:1.62;color:var(--tx2);margin:22px 0 30px;max-width:520px}
.fx-hero-cta{display:flex;gap:14px;flex-wrap:wrap}
.fx-trust{font-size:13px;color:var(--mut);margin-top:20px;font-weight:500}
.fx-trust i{color:#475569;font-style:normal;margin:0 4px}

/* hero visual / mockup */
.fx-hero-visual{position:relative}
.fx-glow{position:absolute;inset:-8% -6% -12% -6%;background:radial-gradient(closest-side,rgba(37,99,255,.20),transparent 75%);filter:blur(20px);z-index:0}
.fx-mock{position:relative;z-index:1;animation:fxfloat 7s ease-in-out infinite}
@keyframes fxfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
.fx-mock-win{background:linear-gradient(180deg,#0a1730,#091327);border:1px solid var(--bd);border-radius:18px;
  padding:14px;box-shadow:0 40px 80px -40px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.02) inset}
.fx-mock-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding:2px 4px}
.fx-mock-title{display:flex;align-items:center;gap:10px;min-width:0}
.fx-live{display:inline-flex;align-items:center;gap:6px;font-size:10.5px;font-weight:800;letter-spacing:.05em;color:#fca5a5}
.fx-live i{width:7px;height:7px;border-radius:50%;background:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.18)}
.fx-mock-name{font-size:12.5px;font-weight:600;color:var(--tx2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fx-mock-time{font-size:12px;color:var(--mut);font-variant-numeric:tabular-nums}
.fx-mock-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.fx-tile{position:relative;aspect-ratio:16/10;border-radius:12px;background:#0c1a34;border:1px solid rgba(148,163,184,.12);
  display:flex;align-items:center;justify-content:center;overflow:hidden}
.fx-tile.on{border-color:rgba(96,165,250,.55);box-shadow:0 0 0 1px rgba(96,165,250,.35),0 0 26px -8px rgba(37,99,255,.6)}
.fx-ava{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-size:14px;font-weight:800;color:#fff;letter-spacing:.02em}
.fx-tile-foot{position:absolute;left:8px;right:8px;bottom:7px;display:flex;align-items:center;justify-content:space-between;
  font-size:11px;font-weight:600;color:#dbe4f3}
.fx-wv{display:inline-flex;align-items:flex-end;gap:2px;height:11px}
.fx-wv i{width:2.5px;background:#60a5fa;border-radius:2px;height:4px;animation:fxwv 1s ease-in-out infinite}
.fx-wv i:nth-child(2){animation-delay:.15s}.fx-wv i:nth-child(3){animation-delay:.3s}.fx-wv i:nth-child(4){animation-delay:.45s}
@keyframes fxwv{0%,100%{height:3px}50%{height:11px}}
.fx-sub{margin-top:10px;background:rgba(8,20,42,.85);border:1px solid rgba(148,163,184,.12);border-radius:12px;padding:11px 13px}
.fx-sub-spk{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:700;color:var(--mut);margin-bottom:6px}
.fx-dot{width:7px;height:7px;border-radius:50%}
.fx-sub-ko{font-size:13px;color:var(--tx2);line-height:1.4}
.fx-sub-vi{font-size:14.5px;font-weight:700;color:#fff;margin-top:4px;line-height:1.4}

/* notes panel (overlap) */
.fx-notes{position:relative;width:100%;max-width:312px;margin:16px 0 0 auto;background:#0b1830;border:1px solid var(--bd);
  border-radius:16px;padding:16px;box-shadow:0 30px 60px -32px rgba(0,0,0,.7);z-index:2}
.fx-notes-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px}
.fx-notes-hd>span{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:800;color:#fff}
.fx-notes-hd svg{color:var(--acc3)}
.fx-export{font-size:10.5px;font-weight:700;color:var(--acc3);background:rgba(96,165,250,.12);border:1px solid rgba(96,165,250,.25);
  border-radius:8px;padding:5px 9px;cursor:pointer}
.fx-note{padding:9px 0;border-top:1px solid rgba(148,163,184,.10)}
.fx-note:first-of-type{border-top:none;padding-top:0}
.fx-note-k{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--mut);margin-bottom:5px}
.fx-note p{font-size:12px;color:var(--tx2);line-height:1.5}
.fx-todo{list-style:none;display:flex;flex-direction:column;gap:6px}
.fx-todo li{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--tx2)}
.fx-todo li svg{color:#34d399;flex-shrink:0}
.fx-todo b{color:#fff;font-weight:700}
.fx-todo span{margin-left:auto;font-size:10px;font-weight:700;color:var(--acc3);background:rgba(96,165,250,.12);border-radius:6px;padding:2px 6px}
.fx-note-row{display:flex;gap:14px}
.fx-note-row>div{flex:1}

/* sections */
.fx-sec{padding:112px 0}
.fx-sec-alt{background:linear-gradient(180deg,var(--bg2),var(--bg))}
.fx-h2{font-size:34px;line-height:1.18;max-width:760px;margin:0 auto 46px;text-align:center}
.fx-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}

/* problem */
.fx-prob{background:var(--card);border:1px solid var(--bd);border-radius:18px;padding:28px 24px;transition:.2s}
.fx-prob:hover{border-color:var(--bdh)}
.fx-prob-ic{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;color:var(--acc3);
  background:rgba(96,165,250,.10);border:1px solid rgba(96,165,250,.18);margin-bottom:16px}
.fx-prob h3{font-size:17px;margin-bottom:9px}
.fx-prob p{font-size:14.5px;color:var(--tx2);line-height:1.6}

/* steps */
.fx-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.fx-step{position:relative;background:var(--card);border:1px solid var(--bd);border-radius:18px;padding:28px 24px}
.fx-step-n{font-size:13px;font-weight:800;color:var(--acc3);letter-spacing:.08em;margin-bottom:16px;
  width:40px;height:40px;border-radius:11px;display:grid;place-items:center;background:rgba(37,99,255,.12);border:1px solid rgba(96,165,250,.22)}
.fx-step h3{font-size:16.5px;margin-bottom:9px;line-height:1.3}
.fx-step p{font-size:14px;color:var(--tx2);line-height:1.6}

/* features */
.fx-feat-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.fx-feat{background:var(--card);border:1px solid var(--bd);border-radius:20px;padding:26px;transition:.2s}
.fx-feat:hover{border-color:var(--bdh)}
.fx-feat-top{display:flex;gap:14px;margin-bottom:18px}
.fx-feat-ic{flex-shrink:0;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;color:#fff;
  background:linear-gradient(135deg,rgba(37,99,255,.9),rgba(96,165,250,.55));border:1px solid rgba(96,165,250,.3)}
.fx-feat-top h3{font-size:17px;margin-bottom:6px}
.fx-feat-top p{font-size:14px;color:var(--tx2);line-height:1.55}
.fx-feat-mock{background:#0a1730;border:1px solid rgba(148,163,184,.12);border-radius:13px;padding:13px;min-height:96px}
.fx-mm{font-size:12px}
.fx-mm-spk{display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:700;color:var(--mut);margin-bottom:6px}
.fx-mm-ko{color:var(--tx2);font-size:12.5px}
.fx-mm-vi{color:#fff;font-weight:700;font-size:13.5px;margin-top:3px}
.fx-mm-k{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--mut);margin-bottom:8px}
.fx-mm-li{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--tx2);margin-bottom:6px}
.fx-mm-li svg{color:#34d399}
.fx-mm-li span{margin-left:auto;font-size:10px;font-weight:700;color:var(--acc3);background:rgba(96,165,250,.12);border-radius:6px;padding:2px 6px}
.fx-mm-spkrs{display:flex;align-items:center;gap:-6px}
.fx-mm-ava{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:800;color:#fff;border:2px solid #0a1730;margin-right:-8px}
.fx-mm-spktx{margin-left:16px;font-size:12.5px;color:var(--tx2);font-weight:600}
.fx-mm-plat{display:flex;flex-wrap:wrap;gap:8px;align-items:center;min-height:70px}
.fx-mm-plat span{font-size:12px;font-weight:700;color:#dbe4f3;background:rgba(148,163,184,.10);border:1px solid var(--bd);border-radius:9px;padding:8px 12px}

/* use cases */
.fx-uc{background:var(--card);border:1px solid var(--bd);border-radius:18px;padding:26px 24px;transition:.2s}
.fx-uc:hover{border-color:var(--bdh)}
.fx-uc-tag{display:inline-block;font-size:11px;font-weight:800;letter-spacing:.04em;color:var(--acc3);
  background:rgba(96,165,250,.10);border:1px solid rgba(96,165,250,.2);border-radius:8px;padding:4px 10px;margin-bottom:16px}
.fx-uc h3{font-size:17px;margin-bottom:9px;line-height:1.3}
.fx-uc p{font-size:14.5px;color:var(--tx2);line-height:1.6}

/* trust */
.fx-trust-sec{display:flex;flex-direction:column;gap:34px;align-items:center}
.fx-works{text-align:center}
.fx-works-lb{display:block;font-size:13px;font-weight:600;color:var(--mut);margin-bottom:16px}
.fx-works-row{display:flex;flex-wrap:wrap;justify-content:center;gap:12px}
.fx-works-chip{font-size:14px;font-weight:700;color:#dbe4f3;background:rgba(255,255,255,.03);border:1px solid var(--bd);border-radius:11px;padding:11px 18px}
.fx-secstrip{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;width:100%;max-width:980px}
.fx-secitem{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:600;color:var(--tx2);
  background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:14px 14px}
.fx-secitem svg{color:#34d399;flex-shrink:0}

/* pricing */
.fx-price{align-items:stretch}
.fx-plan{position:relative;background:var(--card);border:1px solid var(--bd);border-radius:18px;padding:28px 24px;display:flex;flex-direction:column}
.fx-plan.hi{border-color:var(--bdh);background:linear-gradient(180deg,rgba(37,99,255,.10),rgba(255,255,255,.03))}
.fx-plan-badge{position:absolute;top:18px;right:18px;font-size:10px;font-weight:800;letter-spacing:.04em;color:var(--acc3);
  background:rgba(96,165,250,.12);border:1px solid rgba(96,165,250,.28);border-radius:20px;padding:4px 10px}
.fx-plan-n{font-size:14px;font-weight:800;color:var(--tx2)}
.fx-plan-p{font-size:30px;font-weight:900;letter-spacing:-.03em;margin:10px 0 3px;display:flex;align-items:baseline;gap:5px}
.fx-plan-p span{font-size:14px;font-weight:600;color:var(--mut)}
.fx-plan-d{font-size:13.5px;color:var(--mut);margin-bottom:18px}
.fx-plan ul{list-style:none;display:flex;flex-direction:column;gap:9px}
.fx-plan li{display:flex;align-items:center;gap:8px;font-size:13.5px;color:var(--tx2)}
.fx-plan li svg{color:#34d399;flex-shrink:0}
.fx-center{text-align:center;margin-top:36px}

/* faq */
.fx-faq-wrap{max-width:780px}
.fx-faq{display:flex;flex-direction:column;gap:10px}
.fx-faq-item{background:var(--card);border:1px solid var(--bd);border-radius:14px;overflow:hidden;transition:.2s}
.fx-faq-item.open{border-color:var(--bdh)}
.fx-faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:14px;background:none;border:none;cursor:pointer;
  color:#fff;font-family:inherit;font-size:15px;font-weight:700;text-align:left;padding:18px 20px;letter-spacing:-.01em}
.fx-faq-chev{width:9px;height:9px;border-right:2px solid var(--mut);border-bottom:2px solid var(--mut);transform:rotate(45deg);transition:.2s;flex-shrink:0;margin-right:3px}
.fx-faq-item.open .fx-faq-chev{transform:rotate(-135deg);border-color:var(--acc3)}
.fx-faq-a{max-height:0;overflow:hidden;transition:max-height .26s ease}
.fx-faq-item.open .fx-faq-a{max-height:200px}
.fx-faq-a p{padding:0 20px 18px;font-size:14px;color:var(--tx2);line-height:1.62}

/* final */
.fx-final{background:radial-gradient(900px 440px at 50% 120%,rgba(37,99,255,.18),transparent 60%),var(--bg)}
.fx-final-in{text-align:center;max-width:740px;margin:0 auto}
.fx-final-h{margin-bottom:30px}
.fx-center-cta{justify-content:center}
.fx-pdf{display:inline-flex;align-items:center;gap:8px;margin-top:20px;font-size:13.5px;font-weight:700;color:var(--acc3);transition:.15s}
.fx-pdf:hover{color:#fff}

/* footer */
.fx-foot{border-top:1px solid var(--bd);padding:34px 0}
.fx-foot-in{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.fx-foot-by{font-size:13px;color:var(--mut)}
.fx-foot-links{margin-left:auto;display:flex;gap:20px}
.fx-foot-links a{font-size:13px;color:var(--tx2);font-weight:600}
.fx-foot-links a:hover{color:#fff}

/* reveal */
.fx .reveal{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s cubic-bezier(.2,.7,.3,1)}
.fx .reveal.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.fx .reveal{opacity:1;transform:none;transition:none}.fx-mock{animation:none}.fx-wv i{animation:none}}

/* responsive */
@media(max-width:980px){
  .fx-hero{padding:60px 0 110px}
  .fx-hero-in{grid-template-columns:1fr;gap:64px}
  .fx-h1{font-size:42px}
  .fx-lead{font-size:16.5px}
  .fx-nav,.fx-hdr-cta{display:none}
  .fx-burger{display:flex}
  .fx-notes{max-width:none;width:auto;margin:14px 0 0}
  .fx-mock{animation:none}
  .fx-sec{padding:74px 0}
  .fx-h2{font-size:28px;margin-bottom:36px}
  .fx-3,.fx-steps,.fx-feat-grid{grid-template-columns:1fr}
  .fx-secstrip{grid-template-columns:1fr 1fr}
}
@media(max-width:560px){
  .fx-wrap{padding:0 18px}
  .fx-h1{font-size:34px}
  .fx-hero-cta .fx-btn-lg,.fx-hero-cta .fx-btn-ghost{flex:1;text-align:center}
  .fx-secstrip{grid-template-columns:1fr}
  .fx-mock-grid{grid-template-columns:1fr 1fr}
  .fx-foot-links{margin-left:0;width:100%}
}
`;
