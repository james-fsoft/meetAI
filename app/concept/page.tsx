"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Theme = "light" | "dark";
type TrialState = "idle" | "listening" | "done" | "error";

const useCases = [
  {
    icon: "◉",
    title: "Họp đối tác quốc tế",
    text: "Hiểu nhau ngay, không cần chờ phiên dịch.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",
  },
  {
    icon: "▣",
    title: "Video call",
    text: "Phụ đề song ngữ chạy ngay trong cuộc gọi.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=85",
  },
  {
    icon: "▯",
    title: "Nói trực tiếp qua điện thoại",
    text: "Cầm máy trước người nói và đọc phụ đề ngay.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=900&q=85",
  },
  {
    icon: "▥",
    title: "Hội nghị & sự kiện lớn",
    text: "Hiển thị song ngữ trên màn hình cho cả khán phòng.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=85",
  },
  {
    icon: "▷",
    title: "Giải trí & nội dung",
    text: "Hiểu video, webinar, bài giảng và nội dung yêu thích.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85",
  },
];

const voices = [
  ["김민지", "좋은 협업 기회가 될 것 같습니다.", "Đây sẽ là một cơ hội hợp tác rất tốt."],
  ["Nguyễn Hoàng", "Chúng tôi cũng có cùng quan điểm.", "저희도 같은 생각입니다."],
  ["김민지", "다음 단계에 대해 논의해 보겠습니다.", "Hãy cùng trao đổi về bước tiếp theo."],
];

export default function ConceptHome() {
  const [theme, setTheme] = useState<Theme>("light");
  const [trialState, setTrialState] = useState<TrialState>("idle");
  const [seconds, setSeconds] = useState(60);
  const [heard, setHeard] = useState("");
  const [translated, setTranslated] = useState("");
  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("mf_concept_theme") as Theme | null;
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("mf_concept_theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    try { recognitionRef.current?.stop?.(); } catch {}
  }, []);

  const trialCopy = useMemo(() => {
    if (trialState === "listening") return `Đang nghe · ${seconds}s`;
    if (trialState === "done") return "Thử lại";
    return "Dùng thử ngay";
  }, [trialState, seconds]);

  function stopTrial(done = true) {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    try { recognitionRef.current?.stop?.(); } catch {}
    recognitionRef.current = null;
    if (done) setTrialState("done");
  }

  async function translateText(text: string) {
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target: "vi" }),
      });
      const data = await res.json();
      if (res.ok && (data.translation || data.translatedText || data.text)) {
        setTranslated(data.translation || data.translatedText || data.text);
      } else {
        setTranslated("AI đã nhận giọng nói. Bản concept này dùng API dịch hiện có khi chạy trong dự án.");
      }
    } catch {
      setTranslated("AI đã nhận giọng nói. Bản concept này dùng API dịch hiện có khi chạy trong dự án.");
    }
  }

  function startTrial() {
    if (trialState === "listening") {
      stopTrial(true);
      return;
    }

    const key = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem("mf_concept_trials");
    let usage = { day: key, count: 0 };
    try { if (raw) usage = JSON.parse(raw); } catch {}
    if (usage.day !== key) usage = { day: key, count: 0 };
    if (usage.count >= 5) {
      setTrialState("error");
      setHeard("Bạn đã dùng đủ 5 lượt thử hôm nay.");
      setTranslated("Đăng nhập để tiếp tục sử dụng Flash Meet.");
      return;
    }
    usage.count += 1;
    localStorage.setItem("mf_concept_trials", JSON.stringify(usage));

    setSeconds(60);
    setHeard("");
    setTranslated("");
    setTrialState("listening");

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setHeard("Xin chào, rất vui được gặp bạn hôm nay.");
      setTranslated("Hello, it’s great to meet you today.");
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) { stopTrial(true); return 0; }
          return s - 1;
        });
      }, 1000);
      return;
    }

    try {
      const recognition = new SR();
      recognition.lang = navigator.language || "ko-KR";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        let finalText = "";
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0]?.transcript || "";
          if (event.results[i].isFinal) finalText += text;
          else interim += text;
        }
        const all = (finalText || interim).trim();
        if (all) setHeard(all);
        if (finalText.trim()) translateText(finalText.trim());
      };
      recognition.onerror = () => {
        setHeard("Không nghe được microphone. Hãy cho phép quyền micro rồi thử lại.");
      };
      recognition.onend = () => {
        if (trialState === "listening") {
          try { recognition.start(); } catch {}
        }
      };
      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setHeard("Không thể mở microphone trên trình duyệt này.");
    }

    timerRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { stopTrial(true); return 0; }
        return s - 1;
      });
    }, 1000);
  }

  return (
    <main className={`page ${theme}`}>
      <style>{styles}</style>

      <header className="nav wrap">
        <a className="brand" href="#top"><span className="bolt">ϟ</span>Meetflash</a>
        <nav className="links">
          <a href="#features">Tính năng</a><a href="#usecases">Ứng dụng</a><a href="#trial">Dùng thử</a><a href="#reviews">Đánh giá</a>
        </nav>
        <div className="navActions">
          <button className="iconButton" aria-label="Đổi giao diện" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "☾" : "☀"}</button>
          <a className="login" href="/login">Đăng nhập</a>
        </div>
      </header>

      <section id="top" className="hero wrap">
        <div className="heroCopy">
          <span className="eyebrow">KHOẢNH KHẮC RÀO CẢN NGÔN NGỮ BIẾN MẤT</span>
          <h1>Ở bất cứ đâu,<br/>hãy cứ <span>nói.</span></h1>
          <p className="lead">Flash Meet nghe, dịch và giúp cuộc trò chuyện tiếp tục tự nhiên — từ cuộc họp, video call đến du lịch và học tập.</p>
          <button className="primary" onClick={startTrial}><span className="mic">●</span>{trialCopy}<span>→</span></button>
          <div className="microcopy"><span>60 giây / lượt</span><span>Không cần đăng nhập</span><span>Tối đa 5 lượt / ngày</span></div>
        </div>

        <div className="heroVisual">
          <div className="personPhoto" role="img" aria-label="Người dùng nói vào điện thoại">
            <div className="speech s1">안녕하세요<br/>만나서 반갑습니다</div>
            <div className="speech s2">Nice to meet you!</div>
            <div className="soundwave"><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
          </div>
        </div>
      </section>

      <section id="features" className="benefitBar">
        <div className="wrap benefitGrid">
          <div><b>◎</b><strong>Hiểu ngay</strong><small>Trong lúc đang nói</small></div>
          <div><b>ϟ</b><strong>Tiết kiệm thời gian</strong><small>Không phải dịch lại</small></div>
          <div><b>◉</b><strong>Mở rộng cơ hội</strong><small>Kết nối toàn cầu</small></div>
          <div><b>♡</b><strong>Được người dùng yêu thích</strong><small>4.8 / 5</small></div>
        </div>
      </section>

      <section id="trial" className="trialSection wrap">
        <div className="sectionHead"><span>TRẢI NGHIỆM TRỰC TIẾP</span><h2>Nói thử. Bản dịch xuất hiện ngay.</h2><p>Không setup. Không form. Chỉ cần bấm micro và nói.</p></div>
        <div className="trialCard">
          <div className="langRow"><button>Auto detect⌄</button><span>⇄</span><button>Tiếng Việt⌄</button></div>
          <div className="waveLine"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
          <button className={`trialMic ${trialState === "listening" ? "active" : ""}`} onClick={startTrial}>●</button>
          <div className="timer">{trialState === "listening" ? `00:${String(60-seconds).padStart(2,"0")} / 01:00` : "00:00 / 01:00"}</div>
          <div className="trialOutput">
            <div><span>Nghe được</span><p>{heard || "Bấm micro và bắt đầu nói…"}</p></div>
            <div><span>Bản dịch</span><p>{translated || "Bản dịch sẽ xuất hiện tại đây."}</p></div>
          </div>
          <small>Tối đa 1 phút mỗi lượt · 5 lượt miễn phí mỗi ngày</small>
        </div>
      </section>

      <section id="usecases" className="useSection wrap">
        <div className="sectionHead left"><span>MỘT CÔNG CỤ · NHIỀU TÌNH HUỐNG</span><h2>Dùng lúc bạn thật sự cần.</h2></div>
        <div className="useGrid">
          {useCases.map((u) => <article className="useCard" key={u.title}>
            <div className="photo" style={{backgroundImage:`linear-gradient(180deg,transparent 50%,rgba(0,0,0,.58)),url(${u.image})`}}>
              {u.title.includes("điện thoại") && <div className="phoneSubtitle">오늘 만나서 반갑습니다.<br/><b>Rất vui được gặp bạn.</b></div>}
              {u.title.includes("Video") && <div className="caption">Nice to meet you!<br/><b>Rất vui được gặp bạn!</b></div>}
              {u.title.includes("Hội nghị") && <div className="stageCaption"><span>A more connected world</span><span>Một thế giới kết nối hơn</span></div>}
              {u.title.includes("Giải trí") && <div className="caption">I’ll be right there.<br/><b>Tôi sẽ đến ngay.</b></div>}
            </div>
            <div className="useText"><span>{u.icon}</span><div><h3>{u.title}</h3><p>{u.text}</p></div></div>
          </article>)}
        </div>
      </section>

      <section id="reviews" className="reviews wrap">
        <div className="reviewScore"><strong>4.8</strong><span>/ 5</span><div className="stars">★★★★★</div><small>Được hàng trăm người dùng đánh giá</small></div>
        <blockquote>“Dịch nhanh, dễ dùng và không phải học cách dùng trước.”<small>— Người dùng Flash Meet</small></blockquote>
        <blockquote>“Điều mình thích nhất là bấm một lần rồi cứ nói.”<small>— Người dùng Flash Meet</small></blockquote>
        <div className="feedback"><span>◎</span><div><b>Chúng tôi luôn lắng nghe</b><small>Gửi ý kiến để Flash Meet tốt hơn mỗi ngày.</small></div><a href="mailto:feedback@transflash.app">Gửi góp ý →</a></div>
      </section>

      <section className="finalCta">
        <div className="wrap finalInner"><div><span>MEETFLASH</span><h2>Bạn cứ nói. Phần còn lại để AI lo.</h2></div><button className="primary inverse" onClick={startTrial}>● Dùng thử ngay →</button></div>
      </section>
    </main>
  );
}

const styles = `
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0}.page{--bg:#f7f8fa;--panel:#fff;--text:#101722;--muted:#697586;--line:#e6e9ee;--soft:#eef2f5;--button:#101b26;--buttonText:#fff;--glow:rgba(67,91,119,.16);min-height:100vh;background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;transition:.25s}.page.dark{--bg:#081019;--panel:#101923;--text:#f7f9fc;--muted:#9ba8b7;--line:#202c39;--soft:#111d29;--button:#f7f9fc;--buttonText:#0d1620;--glow:rgba(0,0,0,.4)}a{color:inherit;text-decoration:none}.wrap{width:min(1180px,calc(100% - 48px));margin:auto}.nav{height:78px;display:flex;align-items:center;border-bottom:1px solid var(--line)}.brand{font-size:21px;font-weight:800;letter-spacing:-.03em;display:flex;align-items:center;gap:8px}.bolt{font-size:31px;line-height:1}.links{display:flex;gap:32px;margin:auto;font-size:14px;color:var(--muted)}.links a:hover{color:var(--text)}.navActions{display:flex;gap:10px;align-items:center}.iconButton,.login{height:40px;border:1px solid var(--line);background:var(--panel);border-radius:999px;padding:0 16px;color:var(--text)}.iconButton{width:40px;padding:0;font-size:18px;cursor:pointer}.login{display:flex;align-items:center;font-size:13px;font-weight:650}.hero{display:grid;grid-template-columns:1.02fr .98fr;gap:56px;align-items:center;padding:72px 0 54px}.eyebrow,.sectionHead>span,.finalInner>div>span{font-size:12px;letter-spacing:.2em;font-weight:700;color:var(--muted)}h1{font-size:72px;line-height:.98;letter-spacing:-.065em;margin:18px 0 24px;max-width:660px}h1 span{color:#64748b}.dark h1 span{color:#b5c0cc}.lead{font-size:19px;line-height:1.65;color:var(--muted);max-width:620px}.primary{margin-top:24px;border:0;border-radius:999px;background:var(--button);color:var(--buttonText);font-size:17px;font-weight:760;padding:17px 24px;display:inline-flex;gap:14px;align-items:center;cursor:pointer;box-shadow:0 14px 36px var(--glow);transition:.2s}.primary:hover{transform:translateY(-2px)}.mic{font-size:13px}.microcopy{display:flex;gap:22px;flex-wrap:wrap;margin-top:16px;font-size:12px;color:var(--muted)}.heroVisual{min-height:510px}.personPhoto{height:510px;border-radius:30px;background:linear-gradient(90deg,rgba(255,255,255,.02),rgba(255,255,255,0)),url(https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=88) center/cover;position:relative;overflow:hidden;box-shadow:0 25px 65px var(--glow)}.speech{position:absolute;padding:13px 17px;border-radius:18px;background:rgba(255,255,255,.92);color:#111827;font-size:14px;line-height:1.35;box-shadow:0 8px 25px rgba(15,23,42,.12)}.s1{left:8%;top:24%}.s2{left:23%;top:48%;font-weight:650}.soundwave{position:absolute;left:22%;top:43%;display:flex;align-items:center;gap:3px;height:25px}.soundwave i,.waveLine i{display:block;width:3px;border-radius:4px;background:currentColor}.soundwave i:nth-child(odd){height:8px}.soundwave i:nth-child(even){height:20px}.benefitBar{background:color-mix(in srgb,var(--panel) 88%,transparent);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.benefitGrid{display:grid;grid-template-columns:repeat(4,1fr);padding:26px 0}.benefitGrid>div{display:grid;grid-template-columns:38px 1fr;grid-template-rows:auto auto;padding:3px 28px;border-right:1px solid var(--line)}.benefitGrid>div:last-child{border-right:0}.benefitGrid b{grid-row:1/3;font-size:23px;align-self:center}.benefitGrid strong{font-size:13px}.benefitGrid small{font-size:12px;color:var(--muted)}.trialSection{padding:78px 0}.sectionHead{text-align:center;margin-bottom:30px}.sectionHead.left{text-align:left}.sectionHead h2{font-size:38px;letter-spacing:-.045em;margin:8px 0}.sectionHead p{color:var(--muted);margin:0}.trialCard{max-width:900px;margin:auto;background:var(--panel);border:1px solid var(--line);border-radius:26px;padding:28px;text-align:center;box-shadow:0 24px 60px var(--glow)}.langRow{display:flex;justify-content:center;align-items:center;gap:14px}.langRow button{border:1px solid var(--line);background:var(--soft);color:var(--text);padding:10px 17px;border-radius:999px}.waveLine{height:58px;display:flex;justify-content:center;align-items:center;gap:5px;color:var(--muted)}.waveLine i:nth-child(3n){height:32px}.waveLine i:nth-child(3n+1){height:16px}.waveLine i:nth-child(3n+2){height:24px}.trialMic{width:78px;height:78px;border-radius:50%;border:0;background:var(--button);color:var(--buttonText);font-size:26px;cursor:pointer;box-shadow:0 12px 35px var(--glow)}.trialMic.active{animation:pulse 1.2s infinite}.timer{color:var(--muted);font-size:12px;margin-top:10px}.trialOutput{display:grid;grid-template-columns:1fr 1fr;gap:12px;text-align:left;margin:24px 0 14px}.trialOutput>div{background:var(--soft);padding:16px;border-radius:16px;min-height:100px}.trialOutput span{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}.trialOutput p{margin:8px 0 0;line-height:1.5}.trialCard>small{color:var(--muted)}.useSection{padding:28px 0 72px}.useGrid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}.useCard{background:var(--panel);border:1px solid var(--line);border-radius:18px;overflow:hidden}.photo{height:190px;background-size:cover;background-position:center;position:relative}.useText{display:flex;gap:10px;padding:14px}.useText>span{font-size:18px}.useText h3{font-size:14px;margin:0 0 5px}.useText p{font-size:12px;color:var(--muted);margin:0;line-height:1.4}.caption,.phoneSubtitle{position:absolute;left:10px;right:10px;bottom:12px;padding:9px 10px;border-radius:10px;background:rgba(5,10,16,.78);color:#fff;font-size:11px;line-height:1.4}.stageCaption{position:absolute;inset:0;display:flex;align-items:center;justify-content:space-around;color:#fff;font-size:12px;font-weight:700}.reviews{display:grid;grid-template-columns:1.05fr 1fr 1fr 1.35fr;gap:12px;padding-bottom:72px}.reviewScore,blockquote,.feedback{margin:0;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:22px}.reviewScore strong{font-size:42px}.reviewScore>span{color:var(--muted)}.stars{letter-spacing:3px;margin:5px 0}.reviewScore small,blockquote small,.feedback small{display:block;color:var(--muted);font-size:11px;margin-top:8px}blockquote{font-size:13px;line-height:1.55}.feedback{display:flex;gap:12px;align-items:center}.feedback>a{margin-left:auto;border:1px solid var(--line);padding:9px 12px;border-radius:999px;font-size:12px}.finalCta{background:#0b141e;color:#fff}.finalInner{min-height:230px;display:flex;align-items:center;justify-content:space-between}.finalInner h2{font-size:38px;margin:8px 0 0;letter-spacing:-.04em}.inverse{background:#fff;color:#0b141e;margin:0}@keyframes pulse{50%{transform:scale(1.06);box-shadow:0 0 0 12px color-mix(in srgb,var(--text) 8%,transparent)}}
@media(max-width:980px){.links{display:none}.hero{grid-template-columns:1fr;padding-top:42px}.heroVisual{min-height:400px}.personPhoto{height:400px}.benefitGrid{grid-template-columns:1fr 1fr}.benefitGrid>div{border-bottom:1px solid var(--line)}.useGrid{grid-template-columns:repeat(2,1fr)}.reviews{grid-template-columns:1fr 1fr}.finalInner{gap:30px}}
@media(max-width:640px){.wrap{width:min(100% - 28px,560px)}.nav{height:66px}.brand{font-size:19px}.hero{gap:26px;padding:42px 0 28px}.eyebrow{font-size:10px}.hero h1{font-size:52px;margin-top:14px}.lead{font-size:16px}.primary{width:100%;justify-content:center;margin-top:16px}.microcopy{justify-content:center;gap:12px;font-size:11px}.heroVisual{min-height:360px}.personPhoto{height:360px;border-radius:22px}.benefitGrid{grid-template-columns:1fr 1fr}.benefitGrid>div{padding:15px 10px;border-right:0}.sectionHead h2{font-size:30px}.trialSection{padding:56px 0}.trialCard{padding:20px 14px}.trialOutput{grid-template-columns:1fr}.useGrid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:6px}.useCard{min-width:78vw;scroll-snap-align:start}.reviews{grid-template-columns:1fr}.finalInner{min-height:260px;flex-direction:column;align-items:flex-start;justify-content:center}.finalInner h2{font-size:32px}.inverse{width:100%}}
`;
