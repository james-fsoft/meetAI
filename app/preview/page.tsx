"use client";

import { useEffect, useState } from "react";

/* Redesigned homepage PREVIEW at /preview (dark navy, B2B). Ported from the
   user's HTML design. Uses real screenshots from /public/assets. Self-contained
   CSS so it can't affect the live site. */

const APP = "/", LOGIN = "/login", PRICING = "/pricing", EXT = "/extension";

export default function Preview() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [faq, setFaq] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    ["Tính năng", "#features"], ["Cách hoạt động", "#how"],
    ["Use cases", "#usecases"], ["Bảng giá", "#pricing"], ["FAQ", "#faq"],
  ];
  const faqs = [
    ["Flash Meet dùng được với Google Meet và Zoom không?", "Có. Flash Meet hoạt động với Google Meet, Zoom, Microsoft Teams và YouTube qua Chrome Extension."],
    ["Có hỗ trợ tiếng Hàn không?", "Có. Flash Meet dịch song ngữ Việt / Hàn / Anh trực tiếp trong cuộc họp."],
    ["Có tự động tạo biên bản không?", "Có. Sau cuộc họp bạn nhận tóm tắt, quyết định, rủi ro và action items, có thể export ngay."],
    ["Có cần cài app không?", "Không bắt buộc. Bạn có thể dùng Chrome Extension mà không cần cài thêm phần mềm nặng."],
    ["Dữ liệu cuộc họp có an toàn không?", "Flash Meet không lưu nội dung cuộc họp nếu bạn không bật lưu, và cho phép kiểm soát quyền truy cập."],
    ["Có xem YouTube hay video nước ngoài kèm phụ đề không?", "Có. Qua Chrome Extension, Flash Meet tạo phụ đề song ngữ realtime cho YouTube, webinar và video giải trí — bạn không cần tải file phụ đề rời."],
    ["Có bản miễn phí không?", "Có. Bạn có thể bắt đầu miễn phí, không cần thẻ tín dụng."],
  ];

  return (
    <div className="fx">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className={scrolled ? "scrolled" : ""}>
        <div className="container hbar">
          <a href={APP} className="logo">
            <span className="mark"><Mark /></span>
            <span className="name">Flash Meet</span>
          </a>
          <nav className="nav">
            {nav.map(([t, h]) => <a key={t} href={h}>{t}</a>)}
          </nav>
          <div className="hcta">
            <a href={LOGIN} className="login">Đăng nhập</a>
            <a href={APP} className="btn btn-pri">Dùng thử miễn phí</a>
          </div>
          <button className="menu-btn" aria-label="Mở menu" onClick={() => setMenu((m) => !m)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
        </div>
        {menu && (
          <div className="mobile-menu">
            <div className="container inner">
              {nav.map(([t, h]) => <a key={t} href={h} onClick={() => setMenu(false)}>{t}</a>)}
              <a href={LOGIN} style={{ border: "1px solid var(--bd)", textAlign: "center", marginTop: 8 }} onClick={() => setMenu(false)}>Đăng nhập</a>
              <a href={APP} className="btn btn-pri" style={{ textAlign: "center", padding: 10 }} onClick={() => setMenu(false)}>Dùng thử miễn phí</a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="container hero-grid">
            <div className="fade-up">
              <span className="eyebrow">Họp xuyên ngôn ngữ · KR → VN → EN</span>
              <h1>Họp với đối tác Hàn Quốc <span className="grad">không còn rào cản ngôn ngữ</span></h1>
              <p className="sub">Flash Meet dịch phụ đề trực tiếp trong cuộc họp, nhận diện người nói và tự động tạo tóm tắt, việc cần làm, quyết định sau khi cuộc họp kết thúc.</p>
              <div className="ctas">
                <a href={APP} className="btn btn-pri btn-lg">Dùng thử miễn phí <Arrow /></a>
                <a href="#how" className="btn btn-out btn-lg"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg> Xem demo 90 giây</a>
              </div>
              <p className="trust">Không cần thẻ tín dụng · Cài đặt trong 1 phút · Hỗ trợ Việt / Hàn / Anh</p>
            </div>
            <div className="fade-up d1">
              <div className="float-soft mockup-wrap">
                <div className="mockup-glow" />
                <img className="hero-shot" src="/assets/hero-meeting.png" alt="Flash Meet: cuộc họp 4 người với phụ đề song ngữ và panel ghi chú AI" width={1269} height={952} />
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="sec sec-alt">
          <div className="container">
            <div className="maxw">
              <span className="eyebrow">Vấn đề</span>
              <h2 className="h2">Cuộc họp đa ngôn ngữ thường mất thông tin quan trọng</h2>
            </div>
            <div className="grid3">
              {[
                ["01", "Nghe hiểu không đủ nhanh", "Khi đối tác nói tiếng Hàn/Anh, team dễ bỏ lỡ chi tiết quan trọng."],
                ["02", "Ghi chú thủ công mất thời gian", "Sau cuộc họp vẫn phải nghe lại, tổng hợp lại, gửi lại biên bản."],
                ["03", "Follow-up không rõ người phụ trách", "Việc cần làm, deadline, quyết định dễ bị trôi sau cuộc họp."],
              ].map(([n, t, d]) => (
                <div key={n} className="card pcard"><span className="pnum">{n}</span><h3>{t}</h3><p className="lead">{d}</p></div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW */}
        <section className="sec" id="how">
          <div className="container">
            <div className="maxw">
              <span className="eyebrow">Cách hoạt động</span>
              <h2 className="h2">Flash Meet biến cuộc họp thành kết quả rõ ràng</h2>
            </div>
            <div className="steps">
              {[
                ["1", "Kết nối cuộc họp", "Vào cuộc họp hoặc mở Chrome Extension — không cần cài đặt phức tạp.", true],
                ["2", "Phụ đề song ngữ realtime", "Xem bản dịch Việt/Hàn/Anh ngay khi đang họp, theo từng người nói.", true],
                ["3", "Nhận kết quả sau cuộc họp", "Tóm tắt, action items và biên bản sẵn sàng ngay khi cuộc họp kết thúc.", false],
              ].map(([n, t, d, line]) => (
                <div key={n as string} className="step">
                  <div className="top"><span className="stepnum">{n}</span>{line && <span className="stepline" />}</div>
                  <h3>{t}</h3><p className="lead">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SHOWCASE */}
        <section className="sec sec-alt">
          <div className="container showcase">
            <div className="fade-up">
              <span className="eyebrow">Phụ đề trực tiếp</span>
              <h2 className="h2">Đọc đúng nội dung ngay khi đối tác đang nói</h2>
              <p className="lead" style={{ marginTop: 16, fontSize: 16, color: "var(--t2)", maxWidth: 520 }}>Flash Meet hiển thị phụ đề gốc và bản dịch ngay dưới video, để bạn không phải đoán nghĩa hay nghe lại.</p>
              {[
                ["Song ngữ cùng lúc", "Tiếng Hàn và tiếng Việt hiện song song, không trễ nhịp cuộc họp."],
                ["Tóm tắt & việc cần làm sống cùng cuộc họp", "Panel AI cập nhật tóm tắt, task và quyết định ngay trong lúc họp."],
                ["Copy biên bản trong một chạm", "Gửi follow-up cho team ngay sau khi nhấn Leave."],
              ].map(([t, d]) => (
                <div key={t} className="feat">
                  <Check20 />
                  <div><div className="ft">{t}</div><div className="fd">{d}</div></div>
                </div>
              ))}
            </div>
            <div className="fade-up d1">
              <div className="shot-wrap">
                <div className="shot-glow" />
                <img src="/assets/subtitle-demo.png" alt="Flash Meet hiển thị phụ đề Hàn–Việt và panel ghi chú AI trong cuộc họp 1-1" width={1269} height={952} />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="sec sec-alt" id="features">
          <div className="container">
            <div className="maxw">
              <span className="eyebrow">Tính năng</span>
              <h2 className="h2">Bốn thứ cần nhất cho một cuộc họp đa ngôn ngữ</h2>
            </div>
            <div className="grid2">
              <div className="card fcard">
                <div className="fhead"><span className="ficon"><IconCaption /></span><h3>Phụ đề song ngữ realtime</h3></div>
                <p className="fbody lead">Dịch trực tiếp Việt/Hàn/Anh trong lúc đang họp.</p>
                <div className="fdemo">
                  <p style={{ fontSize: 11, color: "var(--t3)", marginBottom: 6 }}>제안서를 공유드리겠습니다.</p>
                  <p style={{ fontSize: 11, color: "#fff" }}>Sẽ gửi proposal cho bạn.</p>
                </div>
              </div>
              <div className="card fcard">
                <div className="fhead"><span className="ficon"><IconNotes /></span><h3>AI Meeting Notes</h3></div>
                <p className="fbody lead">Tự động tạo tóm tắt, quyết định, rủi ro và việc cần làm.</p>
                <div className="fdemo">
                  <span className="bar" style={{ width: "85%" }} /><span className="bar" style={{ width: "65%" }} /><span className="bar" style={{ width: "72%" }} />
                </div>
              </div>
              <div className="card fcard">
                <div className="fhead"><span className="ficon"><IconUsers /></span><h3>Speaker Recognition</h3></div>
                <p className="fbody lead">Biết ai nói gì, giúp biên bản rõ ràng và dễ tra cứu.</p>
                <div className="fdemo">
                  <span className="savatar" style={{ background: "#2563FF" }}>JK</span>
                  <span className="savatar" style={{ background: "#22D3EE" }}>HL</span>
                  <span className="savatar" style={{ background: "#3B82F6" }}>MP</span>
                </div>
              </div>
              <div className="card fcard">
                <div className="fhead"><span className="ficon"><IconLayers /></span><h3>Works where you meet</h3></div>
                <p className="fbody lead">Google Meet, Zoom, Microsoft Teams, YouTube và Chrome Extension.</p>
                <div className="fdemo">
                  <span className="chip">Meet</span><span className="chip">Zoom</span><span className="chip">Teams</span><span className="chip">YouTube</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* USECASES */}
        <section className="sec" id="usecases">
          <div className="container">
            <div className="maxw">
              <span className="eyebrow">Use cases</span>
              <h2 className="h2">Cho mọi nội dung bạn cần hiểu bằng nhiều ngôn ngữ</h2>
            </div>
            <div className="grid-uc">
              <div className="card ucard"><div className="banner" /><div className="body"><span className="utag">Sales</span><h3>Sales meeting với đối tác Hàn Quốc</h3><p>Hiểu đúng yêu cầu, thống nhất next step và gửi follow-up nhanh hơn.</p></div></div>
              <div className="card ucard"><div className="banner" /><div className="body"><span className="utag">Demo</span><h3>Demo sản phẩm quốc tế</h3><p>Không bỏ lỡ feedback kỹ thuật, câu hỏi và quyết định của khách hàng.</p></div></div>
              <div className="card ucard"><div className="banner" /><div className="body"><span className="utag">Training</span><h3>Đào tạo nội bộ đa ngôn ngữ</h3><p>Tự động tạo transcript và tài liệu tóm tắt cho cả team.</p></div></div>
              <div className="card ucard">
                <div className="banner banner-yt">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                </div>
                <div className="body"><span className="utag">YouTube & video</span><h3>Xem video nước ngoài có phụ đề tức thì</h3><p>Bật phụ đề song ngữ realtime cho YouTube, webinar và video giải trí — không cần tải file phụ đề rời.</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="sec sec-alt" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="container">
            <div className="metrics">
              {["Hỗ trợ nhiều ngôn ngữ", "Tự động tóm tắt sau cuộc họp", "Hoạt động trên nền tảng bạn đang dùng", "Bảo mật & kiểm soát dữ liệu"].map((m) => (
                <div key={m} className="metric"><Check16 />{m}</div>
              ))}
            </div>
            <div className="works">
              <p className="lbl">Works with</p>
              <div className="row">
                {["Google Meet", "Zoom", "Microsoft Teams", "YouTube"].map((p) => <span key={p} className="plat">{p}</span>)}
              </div>
            </div>
            <div className="secstrip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <span>Không cần thẻ tín dụng</span>
              <span>Không lưu nội dung cuộc họp nếu bạn không bật lưu</span>
              <span>Kiểm soát quyền truy cập</span>
              <span>Export biên bản dễ dàng</span>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="sec" id="pricing">
          <div className="container">
            <div className="maxw">
              <span className="eyebrow">Bảng giá</span>
              <h2 className="h2">Bắt đầu miễn phí. Nâng cấp khi team cần nhiều giờ dịch hơn.</h2>
            </div>
            <div className="grid3">
              <div className="plan"><h3>Free</h3><p>Bắt đầu nhanh với giờ dịch cơ bản.</p></div>
              <div className="plan hl"><span className="badge">Phổ biến</span><h3>Pro</h3><p>Nhiều giờ dịch hơn và AI notes đầy đủ.</p></div>
              <div className="plan"><h3>Business</h3><p>Cho team cần kiểm soát dữ liệu và quản trị.</p></div>
            </div>
            <a href={PRICING} className="view-pricing">Xem bảng giá <Arrow /></a>
          </div>
        </section>

        {/* FAQ */}
        <section className="sec sec-alt" id="faq">
          <div className="container" style={{ maxWidth: 768 }}>
            <span className="eyebrow">FAQ</span>
            <h2 className="h2">Câu hỏi thường gặp</h2>
            <div className="faq-list">
              {faqs.map(([q, a], i) => (
                <div key={q} className="faq-item">
                  <button className={"faq-q" + (faq === i ? " open" : "")} onClick={() => setFaq(faq === i ? -1 : i)}>
                    <span>{q}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                  {faq === i && <div className="faq-a">{a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="sec">
          <div className="container">
            <div className="ctabox">
              <div className="glow" />
              <div className="inner">
                <h2>Biến mọi cuộc họp đa ngôn ngữ thành việc cần làm rõ ràng.</h2>
                <div className="ctas">
                  <a href={APP} className="btn btn-pri btn-lg">Dùng thử miễn phí <Arrow /></a>
                  <a href={EXT} className="btn btn-out btn-lg">Cài Chrome Extension</a>
                </div>
                <p className="trust">Không cần thẻ tín dụng · Cài đặt trong 1 phút · Hủy bất cứ lúc nào</p>
                <p className="brochures">
                  Tài liệu giới thiệu (PDF):
                  <a href="/docs/flash-meet-vi.pdf" download target="_blank" rel="noopener noreferrer"><PdfI /> Tiếng Việt</a>
                  <a href="/docs/flash-meet-en.pdf" download target="_blank" rel="noopener noreferrer"><PdfI /> English</a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container frow">
          <div className="flogo"><span className="mark"><Mark s={13} /></span><span className="name">Flash Meet</span></div>
          <p className="copy">© {new Date().getFullYear()} Flash Meet · Một giải pháp của TransFlash</p>
        </div>
      </footer>
    </div>
  );
}

/* icons */
function Mark({ s = 15 }: { s?: number }) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 5h16v10H8l-4 4V5z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /></svg>; }
function Arrow() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>; }
function Check20() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>; }
function Check16() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>; }
function PdfI() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>; }
function IconCaption() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M8 11h2M14 11h2M7 15h4M13 15h4" /></svg>; }
function IconNotes() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>; }
function IconUsers() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }
function IconLayers() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>; }

const CSS = `
.fx{--bg0:#050B1F;--bg1:#07162F;--bg2:#081C3A;--a1:#2563FF;--a2:#3B82F6;--a3:#60A5FA;--a4:#22D3EE;
  --t1:#FFFFFF;--t2:#CBD5E1;--t3:#94A3B8;--card:rgba(255,255,255,0.04);--bd:rgba(148,163,184,0.16);--bdh:rgba(96,165,250,0.35);
  color:var(--t1);font-family:Inter,system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.5}
body{background:#050B1F}
.fx *{margin:0;padding:0;box-sizing:border-box}
.fx a{text-decoration:none;color:inherit}
.fx button{font-family:inherit;cursor:pointer;border:none;background:none}
.fx ul{list-style:none}
.fx .container{max-width:1200px;margin:0 auto;padding:0 24px;width:100%}
@media(min-width:640px){.fx .container{padding:0 32px}}
.fx .eyebrow{display:inline-block;font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:0.18em;color:var(--a3)}
.fx .card{border-radius:16px;border:1px solid var(--bd);background:var(--card);transition:border-color .3s}
.fx .card:hover{border-color:var(--bdh)}
.fx .h2{font-size:28px;font-weight:600;line-height:1.2;letter-spacing:-0.02em;color:#fff;margin-top:12px}
@media(min-width:640px){.fx .h2{font-size:34px}}
.fx .lead{font-size:14.5px;line-height:1.7;color:var(--t3)}
.fx .sec{padding:96px 0}
@media(min-width:1024px){.fx .sec{padding:128px 0}}
.fx .sec-alt{background:var(--bg1);border-top:1px solid rgba(148,163,184,0.1);border-bottom:1px solid rgba(148,163,184,0.1)}
.fx header{position:fixed;inset:0 0 auto 0;z-index:50;border-bottom:1px solid transparent;transition:.3s}
.fx header.scrolled{border-bottom-color:rgba(148,163,184,0.12);background:rgba(5,11,31,0.8);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
.fx .hbar{height:64px;display:flex;align-items:center;justify-content:space-between}
.fx .logo{display:flex;align-items:center;gap:10px}
.fx .logo .mark{width:28px;height:28px;border-radius:8px;background:var(--a1);display:flex;align-items:center;justify-content:center}
.fx .logo .name{font-size:15px;font-weight:600;letter-spacing:-0.01em}
.fx .nav{display:none;align-items:center;gap:28px}
.fx .nav a{font-size:13.5px;color:var(--t2);transition:.2s}
.fx .nav a:hover{color:#fff}
.fx .hcta{display:none;align-items:center;gap:16px}
.fx .hcta .login{font-size:13.5px;color:var(--t2)}
.fx .hcta .login:hover{color:#fff}
.fx .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:10px;font-weight:500;transition:.2s}
.fx .btn-pri{background:var(--a1);color:#fff;padding:8px 14px;font-size:13.5px}
.fx .btn-pri:hover{background:var(--a2)}
.fx .menu-btn{color:#fff;display:flex}
@media(min-width:1024px){.fx .nav,.fx .hcta{display:flex}.fx .menu-btn{display:none}}
.fx .mobile-menu{border-top:1px solid rgba(148,163,184,0.12);background:rgba(5,11,31,0.97);backdrop-filter:blur(20px)}
.fx .mobile-menu .inner{display:flex;flex-direction:column;gap:4px;padding:16px 0}
.fx .mobile-menu a{padding:10px 8px;border-radius:8px;font-size:15px;color:var(--t2)}
.fx .mobile-menu a:hover{background:rgba(255,255,255,.05);color:#fff}
.fx .hero{position:relative;overflow:hidden;padding:112px 0 80px}
@media(min-width:1024px){.fx .hero{padding:160px 0 112px}}
.fx .hero-grid{display:grid;gap:48px;align-items:center}
@media(min-width:1024px){.fx .hero-grid{grid-template-columns:48% 52%;gap:40px}}
.fx .hero h1{margin-top:16px;font-size:34px;font-weight:600;line-height:1.12;letter-spacing:-0.02em}
@media(min-width:640px){.fx .hero h1{font-size:44px}}
@media(min-width:1024px){.fx .hero h1{font-size:52px}}
.fx .grad{background:linear-gradient(90deg,var(--a3),var(--a2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.fx .hero p.sub{margin-top:20px;max-width:560px;font-size:16px;line-height:1.7;color:var(--t2)}
.fx .hero .ctas{margin-top:32px;display:flex;flex-direction:column;gap:12px}
@media(min-width:640px){.fx .hero .ctas{flex-direction:row}}
.fx .btn-lg{padding:12px 20px;font-size:15px;border-radius:12px}
.fx .btn-out{border:1px solid rgba(148,163,184,0.22);color:var(--t2)}
.fx .btn-out:hover{border-color:var(--bdh);color:#fff}
.fx .trust{margin-top:20px;font-size:13px;color:var(--t3)}
.fx .mockup-wrap{position:relative}
.fx .mockup-glow{position:absolute;inset:-24px;z-index:-1;border-radius:32px;background:rgba(37,99,255,0.12);filter:blur(48px)}
.fx .hero-shot{width:100%;height:auto;display:block;border-radius:16px;border:1px solid rgba(148,163,184,0.18);box-shadow:0 30px 60px -15px rgba(0,0,0,0.55);background:var(--bg1)}
.fx .showcase{display:grid;gap:48px;align-items:center}
@media(min-width:1024px){.fx .showcase{grid-template-columns:52% 48%;gap:56px}}
.fx .showcase .shot-wrap{position:relative}
.fx .showcase .shot-glow{position:absolute;inset:-20px;z-index:-1;border-radius:28px;background:rgba(37,99,255,0.1);filter:blur(44px)}
.fx .showcase img{width:100%;height:auto;display:block;border-radius:16px;border:1px solid rgba(148,163,184,0.18);box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);background:var(--bg1)}
.fx .showcase .feat{display:flex;align-items:flex-start;gap:12px;margin-top:20px}
.fx .showcase .feat svg{color:var(--a3);flex-shrink:0;margin-top:2px}
.fx .showcase .feat .ft{font-size:15px;font-weight:600;color:#fff}
.fx .showcase .feat .fd{font-size:13.5px;color:var(--t3);margin-top:2px;line-height:1.6}
.fx .grid3{display:grid;gap:20px;margin-top:48px}
@media(min-width:768px){.fx .grid3{grid-template-columns:repeat(3,1fr)}}
.fx .grid2{display:grid;gap:20px;margin-top:48px}
@media(min-width:768px){.fx .grid2{grid-template-columns:repeat(2,1fr)}}
.fx .maxw{max-width:640px}
.fx .pcard{padding:24px}
.fx .pnum{font-size:13px;font-weight:500;color:var(--a3)}
.fx .pcard h3{margin-top:12px;font-size:17px;font-weight:600;color:#fff}
.fx .pcard p{margin-top:8px}
.fx .steps{display:grid;gap:32px;margin-top:56px}
@media(min-width:768px){.fx .steps{grid-template-columns:repeat(3,1fr)}}
.fx .step .top{display:flex;align-items:center;gap:12px}
.fx .stepnum{width:32px;height:32px;border-radius:50%;border:1px solid rgba(96,165,250,0.4);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:var(--a3);flex-shrink:0}
.fx .stepline{display:none;height:1px;flex:1;background:linear-gradient(90deg,rgba(96,165,250,0.4),transparent)}
@media(min-width:768px){.fx .stepline{display:block}}
.fx .step h3{margin-top:20px;font-size:18px;font-weight:600;color:#fff}
.fx .step p{margin-top:8px}
.fx .fcard{padding:28px}
.fx .fhead{display:flex;align-items:center;gap:12px}
.fx .ficon{width:40px;height:40px;border-radius:8px;background:rgba(37,99,255,0.15);display:flex;align-items:center;justify-content:center;color:var(--a3);flex-shrink:0}
.fx .fcard h3{font-size:18px;font-weight:600;color:#fff}
.fx .fcard .fbody{margin-top:12px}
.fx .fdemo{margin-top:20px;border-radius:12px;border:1px solid rgba(148,163,184,0.12);background:var(--bg0);padding:16px}
.fx .bar{display:block;height:6px;border-radius:99px;background:linear-gradient(90deg,var(--a1),var(--a3));margin-bottom:6px}
.fx .chip{display:inline-block;border:1px solid var(--bd);padding:2px 8px;border-radius:6px;font-size:10px;color:var(--t2);margin:0 6px 0 0}
.fx .savatar{width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;color:#fff;margin-right:6px}
.fx .grid-uc{display:grid;gap:20px;margin-top:48px}
@media(min-width:640px){.fx .grid-uc{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1024px){.fx .grid-uc{grid-template-columns:repeat(4,1fr)}}
.fx .ucard{overflow:hidden}
.fx .ucard .banner{height:112px;background:linear-gradient(135deg,var(--bg2),#0b2550)}
.fx .ucard .banner-yt{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1330,#3a0f1a)}
.fx .ucard .body{padding:24px}
.fx .utag{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.06em;color:var(--a3)}
.fx .ucard h3{margin-top:8px;font-size:17px;font-weight:600;color:#fff}
.fx .ucard p{margin-top:8px;font-size:14px;line-height:1.6;color:var(--t3)}
.fx .metrics{display:grid;gap:16px}
@media(min-width:640px){.fx .metrics{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1024px){.fx .metrics{grid-template-columns:repeat(4,1fr)}}
.fx .metric{display:flex;align-items:center;gap:10px;font-size:14px;color:var(--t2)}
.fx .metric svg{color:var(--a3);flex-shrink:0}
.fx .works{margin-top:40px}
.fx .works .lbl{margin-bottom:16px;font-size:12px;text-transform:uppercase;letter-spacing:0.18em;color:var(--t3)}
.fx .works .row{display:flex;flex-wrap:wrap;gap:12px}
.fx .plat{border:1px solid var(--bd);background:var(--card);padding:8px 16px;border-radius:8px;font-size:13px;color:var(--t2)}
.fx .secstrip{margin-top:40px;display:flex;flex-wrap:wrap;align-items:center;gap:8px 24px;border-radius:12px;border:1px solid rgba(148,163,184,0.12);background:var(--bg0);padding:16px 20px}
.fx .secstrip svg{color:var(--a3)}
.fx .secstrip span{font-size:13px;color:var(--t3)}
.fx .plan{border-radius:16px;border:1px solid var(--bd);background:var(--card);padding:28px;transition:.3s}
.fx .plan.hl{border-color:rgba(96,165,250,0.45);background:rgba(37,99,255,0.08)}
.fx .badge{display:inline-block;margin-bottom:12px;background:var(--a1);padding:2px 10px;border-radius:99px;font-size:11px;font-weight:500;color:#fff}
.fx .plan h3{font-size:20px;font-weight:600;color:#fff}
.fx .plan p{margin-top:8px;font-size:14px;line-height:1.6;color:var(--t3)}
.fx .view-pricing{margin-top:40px;display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(148,163,184,0.22);padding:12px 20px;border-radius:12px;font-size:15px;font-weight:500;color:var(--t2);transition:.2s}
.fx .view-pricing:hover{border-color:var(--bdh);color:#fff}
.fx .faq-list{margin-top:40px}
.fx .faq-item{border-bottom:1px solid rgba(148,163,184,0.12)}
.fx .faq-q{display:flex;width:100%;align-items:center;justify-content:space-between;gap:16px;padding:20px 0;text-align:left}
.fx .faq-q span{font-size:15.5px;font-weight:500;color:#fff}
.fx .faq-q svg{flex-shrink:0;color:var(--a3);transition:transform .3s}
.fx .faq-q.open svg{transform:rotate(180deg)}
.fx .faq-a{padding-bottom:20px;font-size:14.5px;line-height:1.7;color:var(--t3)}
.fx .ctabox{position:relative;overflow:hidden;border-radius:24px;border:1px solid rgba(96,165,250,0.25);background:linear-gradient(180deg,var(--bg2),var(--bg1));padding:64px 32px;text-align:center}
@media(min-width:640px){.fx .ctabox{padding:64px 48px}}
.fx .ctabox .glow{position:absolute;top:-80px;left:50%;transform:translateX(-50%);z-index:0;height:192px;width:480px;border-radius:50%;background:rgba(37,99,255,0.15);filter:blur(48px)}
.fx .ctabox .inner{position:relative}
.fx .ctabox h2{margin:0 auto;max-width:640px;font-size:28px;font-weight:600;line-height:1.2;letter-spacing:-0.02em;color:#fff}
@media(min-width:640px){.fx .ctabox h2{font-size:36px}}
.fx .ctabox .ctas{margin-top:32px;display:flex;flex-direction:column;justify-content:center;gap:12px}
@media(min-width:640px){.fx .ctabox .ctas{flex-direction:row}}
.fx .brochures{margin-top:22px;font-size:13px;color:var(--t3);display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 16px}
.fx .brochures a{display:inline-flex;align-items:center;gap:6px;color:var(--a3);font-weight:600}
.fx .brochures a:hover{color:#fff}
.fx footer{border-top:1px solid rgba(148,163,184,0.1);padding:40px 0}
.fx .frow{display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:16px}
@media(min-width:640px){.fx .frow{flex-direction:row}}
.fx .flogo{display:flex;align-items:center;gap:10px}
.fx .flogo .mark{width:24px;height:24px;border-radius:6px;background:var(--a1);display:flex;align-items:center;justify-content:center}
.fx .flogo .name{font-size:14px;font-weight:600}
.fx .copy{font-size:13px;color:var(--t3)}
@keyframes fxFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.fx .fade-up{animation:fxFadeUp .7s cubic-bezier(0.16,1,0.3,1) both}
.fx .fade-up.d1{animation-delay:.12s}
@keyframes fxFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.fx .float-soft{animation:fxFloat 6s ease-in-out infinite}
@media(prefers-reduced-motion:reduce){.fx .fade-up,.fx .float-soft{animation:none}}
`;
