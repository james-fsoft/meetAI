"use client";

import { useLang, type Lang } from "@/lib/use-lang";
import LangSwitch from "../LangSwitch";

const STORE_URL = "https://chromewebstore.google.com/detail/fnaffendjnopgpfehgoocdegbffakofl";

type Step = { t: string; d: string };
type Faq = { q: string; a: string; href?: string; cta?: string };

type Copy = {
  back: string;
  badge: string;
  h1a: string;
  h1b: string;
  h1c: string;
  sub: string;
  add: string;
  safeT: string;
  safeD: string;
  supports: string;
  browsersLabel: string;
  chooseT: string;
  chooseD: string;
  meetT: string;
  meetD: string;
  meetSteps: Step[];
  meetNote: string;
  ytT: string;
  ytD: string;
  ytSteps: Step[];
  ytNote: string;
  ribbon: string;
  chips: string[];
  tipsT: string;
  tips: Step[];
  faqT: string;
  faq: Faq[];
  ctaT: string;
  ctaD: string;
  heroAlt: string;
};

const APPS = ["Google Meet", "Zoom", "Teams", "YouTube"];
const BROWSERS = ["Chrome", "Edge", "Brave", "Opera", "Arc"];

const T: Record<Lang, Copy> = {
  vi: {
    back: "← Quay lại app",
    badge: "Tiện ích trình duyệt AI",
    h1a: "Dịch cuộc họp ",
    h1b: "và video YouTube",
    h1c: " ngay trên trình duyệt",
    sub: "Dịch trực tiếp bằng AI cho Google Meet, Zoom, Teams và YouTube. Hiểu trọn nội dung, không bỏ lỡ thông tin quan trọng, kèm tóm tắt thông minh sau mỗi cuộc họp hoặc video.",
    add: "Cài miễn phí",
    safeT: "An toàn và miễn phí",
    safeD: "Cài đặt trong 30 giây",
    supports: "Hỗ trợ:",
    browsersLabel: "Hoạt động trên:",
    chooseT: "Chọn cách bạn muốn dùng",
    chooseD: "Cả cuộc họp và video đều có chung quy trình đơn giản với tiện ích Flash Meet.",
    meetT: "Dịch cuộc họp online",
    meetD: "Hoạt động trên Google Meet, Zoom và Teams.",
    meetSteps: [
      { t: "Mở cuộc họp", d: "Tham gia Google Meet, Zoom hoặc Teams." },
      { t: "Bấm Flash Meet", d: "Nhấn icon tiện ích trên thanh công cụ trình duyệt." },
      { t: "Chọn ngôn ngữ & chế độ", d: "Chọn ngôn ngữ dịch, một chiều hoặc song ngữ." },
      { t: "Bấm Bắt đầu", d: "Tiện ích bắt đầu nghe tiếng của tab đang họp." },
      { t: "Phụ đề tự hiện", d: "Khung phụ đề nổi trên trang, kéo và đổi cỡ chữ được." },
    ],
    meetNote: "Chrome chỉ cho tiện ích nghe tab sau khi bạn bấm — nó không tự thu âm.",
    ytT: "Dịch video YouTube / webinar",
    ytD: "Hoạt động trên YouTube và mọi video, webinar chạy trong trình duyệt.",
    ytSteps: [
      { t: "Mở video", d: "Vào YouTube hoặc trang webinar bất kỳ." },
      { t: "Bấm Flash Meet", d: "Mở tiện ích ngay trên tab đang phát." },
      { t: "Chọn ngôn ngữ", d: "Chọn ngôn ngữ bạn muốn đọc." },
      { t: "Bấm Bắt đầu", d: "Bắt đầu dịch theo thời gian thực." },
      { t: "Xem phụ đề trực tiếp", d: "Phụ đề song ngữ chạy theo video, không cần file phụ đề." },
    ],
    ytNote: "Video không có phụ đề sẵn vẫn dịch được, vì tiện ích nghe thẳng âm thanh của tab.",
    ribbon: "Chỉ vài bước để hiểu trọn cuộc họp và video đa ngôn ngữ",
    chips: ["MỞ", "BẤM FLASH MEET", "CHỌN", "BẮT ĐẦU", "HIỂU"],
    tipsT: "Mẹo hữu ích",
    tips: [
      { t: "Ghim tiện ích để dùng nhanh hơn", d: "Bấm biểu tượng mảnh ghép trên thanh công cụ rồi ghim Flash Meet — lần sau chỉ một cú bấm." },
      { t: "Kéo khung phụ đề tới chỗ dễ nhìn", d: "Khung phụ đề kéo được và đổi cỡ chữ được, đặt ở đâu là nhớ ở đó." },
      { t: "Cần chiếu cho cả phòng?", d: "Dùng Chế độ hội nghị trên web: phụ đề lớn cho máy chiếu và mã QR cho khán giả." },
      { t: "Đăng nhập để có thêm phút dịch", d: "Đăng nhập trong tiện ích để đồng bộ gói và lưu lại cuộc họp." },
    ],
    faqT: "Câu hỏi thường gặp",
    faq: [
      { q: "Flash Meet có miễn phí không?", a: "Có bản miễn phí với hạn mức phút mỗi ngày; các gói trả phí mở thêm thời lượng và tính năng.", href: "/pricing", cta: "Xem bảng giá" },
      { q: "Tiện ích hoạt động trên trình duyệt nào?", a: "Chrome, Edge, Brave, Opera, Arc và các trình duyệt nền Chromium trên máy tính. Safari và Firefox chưa dùng được." },
      { q: "Dữ liệu cuộc họp và video có được lưu lại không?", a: "Trong lúc dịch, phụ đề chỉ hiện trên máy bạn. Nếu đã đăng nhập, bản ghi và tóm tắt được lưu vào tài khoản để xem lại sau.", href: "/privacy", cta: "Chính sách bảo mật" },
      { q: "Tôi có thể dịch sang những ngôn ngữ nào?", a: "Tiếng Việt, Anh, Hàn, Nhật, Trung, Thái, Tây Ban Nha và Pháp." },
      { q: "Zoom hay Teams bản cài trên máy thì sao?", a: "Tiện ích chỉ nghe được tiếng trong trình duyệt. Với bản cài trên máy, hãy mở ứng dụng web Flash Meet và bật “Dịch cả âm thanh trên máy”.", href: "/?app=1", cta: "Mở ứng dụng" },
    ],
    ctaT: "Hiểu nhiều hơn. Kết nối xa hơn.",
    ctaD: "Flash Meet giúp bạn vượt qua rào cản ngôn ngữ để học tập, làm việc và kết nối với thế giới.",
    heroAlt: "Tiện ích Flash Meet hiện phụ đề song ngữ trên một cuộc họp Google Meet và một video YouTube",
  },
  en: {
    back: "← Back to the app",
    badge: "AI browser extension",
    h1a: "Translate meetings ",
    h1b: "and YouTube video",
    h1c: " right in your browser",
    sub: "Live AI translation for Google Meet, Zoom, Teams and YouTube. Follow everything that is said, miss nothing that matters, and get a smart summary after the meeting or the video.",
    add: "Install free",
    safeT: "Free and safe",
    safeD: "Installs in 30 seconds",
    supports: "Works with:",
    browsersLabel: "Runs on:",
    chooseT: "Pick how you want to use it",
    chooseD: "Meetings and video follow the same simple flow with the Flash Meet extension.",
    meetT: "Translate an online meeting",
    meetD: "Works on Google Meet, Zoom and Teams.",
    meetSteps: [
      { t: "Open the meeting", d: "Join Google Meet, Zoom or Teams." },
      { t: "Click Flash Meet", d: "Press the extension icon in the browser toolbar." },
      { t: "Choose language & mode", d: "Pick the target language, one-way or bilingual." },
      { t: "Press Start", d: "The extension starts listening to that tab." },
      { t: "Captions appear", d: "A floating caption panel sits on the page — drag it, resize the text." },
    ],
    meetNote: "Chrome only lets the extension listen to a tab after you click — it never records on its own.",
    ytT: "Translate YouTube or a webinar",
    ytD: "Works on YouTube and any video or webinar playing in the browser.",
    ytSteps: [
      { t: "Open the video", d: "Go to YouTube or any webinar page." },
      { t: "Click Flash Meet", d: "Open the extension on the playing tab." },
      { t: "Choose the language", d: "Pick the language you want to read." },
      { t: "Press Start", d: "Translation runs in real time." },
      { t: "Watch live captions", d: "Bilingual captions follow the video — no subtitle file needed." },
    ],
    ytNote: "Videos without subtitles still work: the extension listens to the tab's own audio.",
    ribbon: "A few steps to follow any multilingual meeting or video",
    chips: ["OPEN", "CLICK FLASH MEET", "CHOOSE", "START", "UNDERSTAND"],
    tipsT: "Handy tips",
    tips: [
      { t: "Pin the extension", d: "Click the puzzle icon in the toolbar and pin Flash Meet — next time it is one click away." },
      { t: "Move the caption panel", d: "The panel can be dragged and its text resized; it stays where you put it." },
      { t: "Showing a whole room?", d: "Use Conference Mode on the web: large captions for a projector and a QR code for the audience." },
      { t: "Sign in for more minutes", d: "Sign in inside the extension to sync your plan and keep your meetings." },
    ],
    faqT: "Frequently asked questions",
    faq: [
      { q: "Is Flash Meet free?", a: "There is a free plan with a daily minute allowance; paid plans add more time and features.", href: "/pricing", cta: "See pricing" },
      { q: "Which browsers does the extension run on?", a: "Chrome, Edge, Brave, Opera, Arc and other Chromium browsers on a computer. Safari and Firefox are not supported yet." },
      { q: "Is meeting and video data stored?", a: "While translating, the captions stay on your computer. If you are signed in, the transcript and summary are saved to your account so you can reopen them.", href: "/privacy", cta: "Privacy policy" },
      { q: "Which languages can I translate into?", a: "Vietnamese, English, Korean, Japanese, Chinese, Thai, Spanish and French." },
      { q: "What about the Zoom or Teams desktop app?", a: "The extension only hears what plays in the browser. For a desktop app, open the Flash Meet web app and turn on “Also translate the computer audio”.", href: "/?app=1", cta: "Open the app" },
    ],
    ctaT: "Understand more. Connect further.",
    ctaD: "Flash Meet takes the language barrier out of studying, working and meeting people anywhere.",
    heroAlt: "The Flash Meet extension showing bilingual captions over a Google Meet call and a YouTube video",
  },
  ko: {
    back: "← 앱으로 돌아가기",
    badge: "AI 브라우저 확장 프로그램",
    h1a: "회의와 ",
    h1b: "YouTube 영상",
    h1c: "을 브라우저에서 바로 번역",
    sub: "Google Meet·Zoom·Teams·YouTube를 위한 실시간 AI 번역. 내용을 놓치지 않고 따라가고, 회의나 영상이 끝나면 요약까지 받아 보세요.",
    add: "무료 설치",
    safeT: "무료이고 안전합니다",
    safeD: "30초면 설치 완료",
    supports: "지원:",
    browsersLabel: "사용 가능:",
    chooseT: "원하는 사용 방법을 고르세요",
    chooseD: "회의든 영상이든 Flash Meet 확장 프로그램에서는 같은 흐름입니다.",
    meetT: "온라인 회의 번역",
    meetD: "Google Meet, Zoom, Teams에서 작동합니다.",
    meetSteps: [
      { t: "회의 열기", d: "Google Meet, Zoom 또는 Teams에 참여합니다." },
      { t: "Flash Meet 누르기", d: "브라우저 도구모음의 확장 아이콘을 누릅니다." },
      { t: "언어 & 모드 선택", d: "번역할 언어와 단방향·양방향을 고릅니다." },
      { t: "시작 누르기", d: "확장 프로그램이 그 탭의 소리를 듣기 시작합니다." },
      { t: "자막이 바로 표시", d: "페이지 위에 떠 있는 자막 창 — 끌어 옮기고 글자 크기도 바꿀 수 있습니다." },
    ],
    meetNote: "Chrome은 사용자가 누른 뒤에만 탭 소리를 허용합니다 — 스스로 녹음하지 않습니다.",
    ytT: "YouTube·웨비나 번역",
    ytD: "YouTube와 브라우저에서 재생되는 모든 영상·웨비나에서 작동합니다.",
    ytSteps: [
      { t: "영상 열기", d: "YouTube나 웨비나 페이지를 엽니다." },
      { t: "Flash Meet 누르기", d: "재생 중인 탭에서 확장 프로그램을 엽니다." },
      { t: "언어 선택", d: "읽고 싶은 언어를 고릅니다." },
      { t: "시작 누르기", d: "실시간으로 번역이 시작됩니다." },
      { t: "실시간 자막 보기", d: "이중 언어 자막이 영상을 따라갑니다 — 자막 파일이 필요 없습니다." },
    ],
    ytNote: "자막이 없는 영상도 됩니다. 확장 프로그램이 탭의 소리를 직접 듣기 때문입니다.",
    ribbon: "몇 단계면 다국어 회의와 영상을 그대로 이해합니다",
    chips: ["열기", "FLASH MEET 누르기", "선택", "시작", "이해"],
    tipsT: "유용한 팁",
    tips: [
      { t: "확장 프로그램을 고정하세요", d: "도구모음의 퍼즐 아이콘을 눌러 Flash Meet을 고정하면 다음부터 한 번에 실행됩니다." },
      { t: "자막 창을 원하는 자리로", d: "자막 창은 끌어 옮기고 글자 크기를 바꿀 수 있으며 그 자리를 기억합니다." },
      { t: "회의실 전체에 보여 주려면", d: "웹의 컨퍼런스 모드를 사용하세요: 프로젝터용 큰 자막과 청중용 QR 코드." },
      { t: "로그인하면 시간이 늘어납니다", d: "확장 프로그램에서 로그인하면 요금제가 동기화되고 회의가 저장됩니다." },
    ],
    faqT: "자주 묻는 질문",
    faq: [
      { q: "Flash Meet은 무료인가요?", a: "하루 사용 시간이 정해진 무료 플랜이 있고, 유료 플랜은 시간과 기능이 늘어납니다.", href: "/pricing", cta: "요금제 보기" },
      { q: "어떤 브라우저에서 동작하나요?", a: "PC의 Chrome, Edge, Brave, Opera, Arc 등 Chromium 계열 브라우저입니다. Safari와 Firefox는 아직 지원하지 않습니다." },
      { q: "회의와 영상 데이터가 저장되나요?", a: "번역하는 동안 자막은 사용자 컴퓨터에만 표시됩니다. 로그인한 경우 기록과 요약이 계정에 저장되어 다시 열어 볼 수 있습니다.", href: "/privacy", cta: "개인정보 처리방침" },
      { q: "어떤 언어로 번역할 수 있나요?", a: "베트남어, 영어, 한국어, 일본어, 중국어, 태국어, 스페인어, 프랑스어." },
      { q: "Zoom·Teams 데스크톱 앱은요?", a: "확장 프로그램은 브라우저에서 재생되는 소리만 듣습니다. 데스크톱 앱은 Flash Meet 웹 앱을 열고 “컴퓨터 소리도 번역”을 켜 주세요.", href: "/?app=1", cta: "앱 열기" },
    ],
    ctaT: "더 많이 이해하고, 더 멀리 연결되세요.",
    ctaD: "Flash Meet은 공부하고 일하고 사람을 만나는 모든 순간에서 언어 장벽을 걷어냅니다.",
    heroAlt: "Google Meet 통화와 YouTube 영상 위에 이중 언어 자막을 보여 주는 Flash Meet 확장 프로그램",
  },
};

export default function ExtensionGuide() {
  const [lang, setLang] = useLang();
  const t = T[lang];

  return (
    <main className="xp">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="xp-top">
        <a href="/?app=1" className="xp-back">{t.back}</a>
        <a href="/" className="xp-brand" aria-label="Flash Meet">
          <Logo />
          <span>Flash Meet</span>
        </a>
        <div className="xp-lang"><LangSwitch lang={lang} onChange={setLang} /></div>
      </header>

      <section className="xp-hero">
        <div className="xp-hero-copy">
          <span className="xp-badge"><i aria-hidden="true">✦</i>{t.badge}</span>
          <h1>{t.h1a}<b>{t.h1b}</b>{t.h1c}</h1>
          <p className="xp-sub">{t.sub}</p>

          <div className="xp-cta-row">
            <a className="xp-cta" href={STORE_URL} target="_blank" rel="noopener noreferrer">
              <PuzzleIcon />
              {t.add}
              <span aria-hidden="true">→</span>
            </a>
            <div className="xp-safe">
              <ShieldIcon />
              <div>
                <b>{t.safeT}</b>
                <small>{t.safeD}</small>
              </div>
            </div>
          </div>

          <div className="xp-logos">
            <div className="xp-logo-group">
              <span className="xp-logo-label">{t.supports}</span>
              {APPS.map((a) => <span key={a} className="xp-chip">{a}</span>)}
            </div>
            <span className="xp-logo-sep" aria-hidden="true" />
            <div className="xp-logo-group">
              <span className="xp-logo-label">{t.browsersLabel}</span>
              {BROWSERS.map((b) => <span key={b} className="xp-chip">{b}</span>)}
            </div>
          </div>
        </div>

        <div className="xp-hero-art">
          <img src="/ext/hero-meet.webp" alt={t.heroAlt} width={1448} height={1086} />
        </div>
      </section>

      <section className="xp-choose">
        <div className="xp-head">
          <h2>{t.chooseT}</h2>
          <p>{t.chooseD}</p>
        </div>

        <div className="xp-panels">
          <Panel
            kind="meet"
            icon={<CamIcon />}
            title={t.meetT}
            sub={t.meetD}
            tags={["Google Meet", "Zoom", "Teams"]}
            steps={t.meetSteps}
            note={t.meetNote}
            art="/ext/card-popup.webp"
            artAlt="Flash Meet popup"
          />
          <Panel
            kind="yt"
            icon={<PlayIcon />}
            title={t.ytT}
            sub={t.ytD}
            tags={["YouTube", "Webinar"]}
            steps={t.ytSteps}
            note={t.ytNote}
            art="/ext/card-youtube.webp"
            artAlt="YouTube + Flash Meet"
          />
        </div>
      </section>

      <section className="xp-ribbon">
        <p><span aria-hidden="true">⚡</span>{t.ribbon}</p>
        <ol>
          {t.chips.map((c, i) => (
            <li key={c}>
              <i>{i + 1}</i>
              <span>{c}</span>
              {i < t.chips.length - 1 && <em aria-hidden="true">→</em>}
            </li>
          ))}
        </ol>
      </section>

      <section className="xp-bottom">
        <div className="xp-card">
          <h3><span aria-hidden="true">💡</span>{t.tipsT}</h3>
          <ol className="xp-tips">
            {t.tips.map((x, i) => (
              <li key={x.t}><i>{i + 1}</i><div><b>{x.t}</b><small>{x.d}</small></div></li>
            ))}
          </ol>
        </div>

        <div className="xp-card">
          <h3><span aria-hidden="true">❓</span>{t.faqT}</h3>
          <div className="xp-faq">
            {t.faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}<span aria-hidden="true">⌄</span></summary>
                <p>
                  {f.a}
                  {f.href && <a href={f.href}> {f.cta} →</a>}
                </p>
              </details>
            ))}
          </div>
        </div>

        <aside className="xp-card xp-end">
          <div className="xp-end-art" aria-hidden="true"><Logo size={44} /></div>
          <h3>{t.ctaT}</h3>
          <p>{t.ctaD}</p>
          <a className="xp-cta" href={STORE_URL} target="_blank" rel="noopener noreferrer">
            <PuzzleIcon />
            {t.add}
            <span aria-hidden="true">→</span>
          </a>
        </aside>
      </section>
    </main>
  );
}

function Panel({
  kind, icon, title, sub, tags, steps, note, art, artAlt,
}: {
  kind: "meet" | "yt";
  icon: React.ReactNode;
  title: string;
  sub: string;
  tags: string[];
  steps: Step[];
  note: string;
  art: string;
  artAlt: string;
}) {
  return (
    <article className={"xp-panel xp-" + kind}>
      <header>
        <span className="xp-panel-ico">{icon}</span>
        <div>
          <h3>{title}</h3>
          <p>{sub}</p>
        </div>
        <div className="xp-tags">{tags.map((x) => <span key={x}>{x}</span>)}</div>
      </header>

      <div className="xp-panel-body">
        <ol className="xp-steps">
          {steps.map((s, i) => (
            <li key={s.t}>
              <span className="xp-num">{i + 1}</span>
              <b>{s.t}</b>
              <small>{s.d}</small>
            </li>
          ))}
        </ol>
        <img className="xp-panel-art" src={art} alt={artAlt} loading="lazy" />
      </div>

      <p className="xp-note"><span aria-hidden="true">ⓘ</span>{note}</p>
    </article>
  );
}

function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <path d="M22 8 H78 a16 16 0 0 1 16 16 V60 a16 16 0 0 1 -16 16 H50 l-20 18 v-18 H22 a16 16 0 0 1 -16 -16 V24 A16 16 0 0 1 22 8 Z" fill="#1f6bff" />
      <g fill="#fff">
        <rect x="26" y="38" width="7.5" height="12" rx="3.75" />
        <rect x="39" y="29" width="7.5" height="30" rx="3.75" />
        <rect x="52" y="22" width="7.5" height="44" rx="3.75" />
        <rect x="65" y="32" width="7.5" height="24" rx="3.75" />
      </g>
    </svg>
  );
}

const PuzzleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v3.8h1.4a2.3 2.3 0 0 1 0 4.4H2V19a2 2 0 0 0 2 2h3.8v-1.4a2.3 2.3 0 0 1 4.4 0V21H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2.8 20 6v6c0 4.6-3.3 8.1-8 9.3-4.7-1.2-8-4.7-8-9.3V6z" />
    <path d="m8.8 12 2.2 2.2 4.2-4.4" strokeLinecap="round" />
  </svg>
);

const CamIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="5.5" width="13" height="13" rx="2.6" />
    <path d="M15.5 10.5 21.5 7v10l-6-3.5z" />
  </svg>
);

const PlayIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="4.5" width="19" height="15" rx="3.6" />
    <path d="M10 9.2 15 12l-5 2.8z" />
  </svg>
);

const CSS = `
.xp{--ink:#0b1631;--mut:#5d6b85;--blue:#1468ff;--line:#e3e9f4;--soft:#f4f8ff;
  min-height:100vh;background:
  radial-gradient(900px 420px at 12% -6%,rgba(20,104,255,.10),transparent 60%),
  radial-gradient(760px 380px at 92% 2%,rgba(90,170,255,.12),transparent 62%),
  linear-gradient(180deg,#fbfdff,#fff 38%);
  color:var(--ink);font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;letter-spacing:-.015em;padding-bottom:64px}
.xp *{box-sizing:border-box}
.xp-top{display:flex;align-items:center;gap:16px;padding:20px 28px 6px;max-width:1240px;margin:0 auto}
.xp-back{font-size:13px;font-weight:700;color:var(--mut);text-decoration:none;white-space:nowrap}
.xp-back:hover{color:var(--blue)}
.xp-brand{margin:0 auto;display:inline-flex;align-items:center;gap:9px;font-size:19px;font-weight:900;letter-spacing:-.035em;color:inherit;text-decoration:none}
.xp-lang{margin-left:auto}

.xp-hero{max-width:1240px;margin:0 auto;padding:22px 28px 10px;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,1fr);gap:24px;align-items:center}
.xp-badge{display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:800;color:#1657d6;background:color-mix(in srgb,var(--blue) 10%,#fff);border:1px solid color-mix(in srgb,var(--blue) 18%,transparent);border-radius:999px;padding:7px 13px}
.xp-badge i{font-style:normal}
.xp-hero h1{font-size:clamp(30px,3.8vw,46px);line-height:1.08;letter-spacing:-.045em;font-weight:900;margin:16px 0 0;max-width:640px}
.xp-hero h1 b{color:var(--blue);font-weight:900}
.xp-sub{margin:16px 0 0;max-width:560px;color:#4f5d78;font-size:15.5px;line-height:1.72}
.xp-cta-row{display:flex;flex-wrap:wrap;align-items:center;gap:16px;margin-top:24px}
.xp-cta{display:inline-flex;align-items:center;gap:10px;min-height:52px;padding:0 24px;border-radius:14px;background:linear-gradient(135deg,#1769ff,#3f86ff);color:#fff;text-decoration:none;font-size:15px;font-weight:800;box-shadow:0 18px 34px -18px rgba(20,104,255,.95);transition:.16s}
.xp-cta:hover{transform:translateY(-1px);filter:brightness(1.04)}
.xp-safe{display:flex;align-items:center;gap:10px;color:#2c3a56}
.xp-safe svg{color:var(--blue);flex:none}
.xp-safe b{display:block;font-size:13.5px}
.xp-safe small{display:block;font-size:12px;color:var(--mut);margin-top:2px}
.xp-logos{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin-top:26px}
.xp-logo-group{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.xp-logo-label{font-size:12px;font-weight:800;color:var(--mut)}
.xp-logo-sep{width:1px;height:20px;background:var(--line)}
.xp-chip{font-size:12px;font-weight:800;color:#31415f;background:#fff;border:1px solid var(--line);border-radius:9px;padding:6px 10px;box-shadow:0 8px 18px -16px rgba(20,41,90,.7)}
.xp-hero-art img{width:100%;height:auto;display:block}

.xp-head{text-align:center;max-width:720px;margin:0 auto 24px}
.xp-head h2{font-size:clamp(25px,3vw,34px);letter-spacing:-.04em;margin:0}
.xp-head p{margin:9px 0 0;color:var(--mut);font-size:15px}
.xp-choose{max-width:1240px;margin:0 auto;padding:42px 28px 0}
.xp-panels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.xp-panel{border-radius:22px;padding:20px;border:1px solid var(--line);display:flex;flex-direction:column}
.xp-meet{background:linear-gradient(180deg,#f3f8ff,#fbfdff);border-color:#d9e6ff}
.xp-yt{background:linear-gradient(180deg,#fff4f4,#fffafa);border-color:#ffdcdc}
.xp-panel header{display:flex;align-items:center;gap:13px;flex-wrap:wrap;margin-bottom:16px}
.xp-panel-ico{width:52px;height:52px;flex:none;border-radius:16px;display:grid;place-items:center;color:#fff}
.xp-meet .xp-panel-ico{background:linear-gradient(135deg,#1769ff,#4a8cff)}
.xp-yt .xp-panel-ico{background:linear-gradient(135deg,#ff2f2f,#ff6a6a)}
.xp-panel h3{font-size:19px;letter-spacing:-.03em;margin:0}
.xp-panel header p{margin:4px 0 0;font-size:13px;color:var(--mut)}
.xp-tags{margin-left:auto;display:flex;flex-wrap:wrap;gap:6px}
.xp-tags span{font-size:11px;font-weight:800;color:#31415f;background:#fff;border:1px solid var(--line);border-radius:8px;padding:5px 9px}
.xp-panel-body{display:grid;grid-template-columns:minmax(0,1fr) 190px;gap:14px;align-items:center}
.xp-panel-art{width:100%;height:auto;display:block;filter:drop-shadow(0 18px 30px rgba(20,60,140,.18))}
.xp-steps{list-style:none;margin:0;padding:0;display:grid;gap:9px}
.xp-steps li{background:#fff;border:1px solid var(--line);border-radius:14px;padding:11px 13px;display:grid;grid-template-columns:26px 1fr;gap:4px 10px;align-items:center}
.xp-num{grid-row:span 2;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:800;color:#fff;background:var(--blue)}
.xp-yt .xp-num{background:#ff3b3b}
.xp-steps b{font-size:13.5px;letter-spacing:-.02em}
.xp-steps small{font-size:12px;color:var(--mut);line-height:1.5}
.xp-note{display:flex;gap:8px;align-items:flex-start;margin:14px 0 0;font-size:12.5px;color:var(--mut);line-height:1.55}
.xp-note span{color:var(--blue);font-weight:800}

.xp-ribbon{max-width:1240px;margin:26px auto 0;padding:0 28px}
.xp-ribbon p{display:flex;align-items:center;justify-content:center;gap:8px;margin:0;font-size:14.5px;font-weight:800}
.xp-ribbon ol{list-style:none;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:10px;margin:16px 0 0;padding:20px;border-radius:20px;background:linear-gradient(180deg,#f2f7ff,#fbfdff);border:1px solid #dfe9fb}
.xp-ribbon li{display:inline-flex;align-items:center;gap:9px;font-size:12.5px;font-weight:900;letter-spacing:.02em}
.xp-ribbon li>span{background:#fff;border:1px solid var(--line);border-radius:999px;padding:9px 15px}
.xp-ribbon i{width:24px;height:24px;border-radius:50%;background:var(--blue);color:#fff;display:grid;place-items:center;font-size:11.5px;font-style:normal}
.xp-ribbon em{color:#9fb2d4;font-style:normal;margin:0 3px}

.xp-bottom{max-width:1240px;margin:32px auto 0;padding:0 28px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;align-items:start}
.xp-card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:20px;box-shadow:0 20px 44px -38px rgba(20,41,90,.8)}
.xp-card h3{display:flex;align-items:center;gap:8px;font-size:17px;letter-spacing:-.03em;margin:0 0 14px}
.xp-tips{list-style:none;margin:0;padding:0;display:grid;gap:13px}
.xp-tips li{display:flex;gap:11px}
.xp-tips i{flex:none;width:24px;height:24px;border-radius:50%;background:color-mix(in srgb,var(--blue) 12%,#fff);color:var(--blue);display:grid;place-items:center;font-size:12px;font-weight:800;font-style:normal}
.xp-tips b{display:block;font-size:13.5px;letter-spacing:-.02em}
.xp-tips small{display:block;font-size:12.5px;color:var(--mut);line-height:1.55;margin-top:3px}
.xp-faq{display:grid;gap:8px}
.xp-faq details{border:1px solid var(--line);border-radius:12px;background:var(--soft);overflow:hidden}
.xp-faq summary{display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer;padding:12px 14px;font-size:13.5px;font-weight:700;list-style:none}
.xp-faq summary::-webkit-details-marker{display:none}
.xp-faq summary span{color:#8fa2c4;transition:.18s}
.xp-faq details[open] summary span{transform:rotate(180deg)}
.xp-faq p{margin:0;padding:0 14px 13px;font-size:13px;color:var(--mut);line-height:1.65}
.xp-faq a{color:var(--blue);font-weight:800;text-decoration:none;white-space:nowrap}
.xp-end{background:linear-gradient(180deg,#f4f8ff,#fff);border-color:#dbe7ff;text-align:left}
.xp-end-art{width:66px;height:66px;border-radius:20px;display:grid;place-items:center;background:#fff;border:1px solid var(--line);margin-bottom:14px}
.xp-end h3{font-size:20px;letter-spacing:-.035em;margin:0 0 8px}
.xp-end p{margin:0 0 18px;font-size:13.5px;color:var(--mut);line-height:1.65}

@media(max-width:1080px){
  .xp-hero{grid-template-columns:1fr;gap:18px}
  .xp-hero-art{order:-1;max-width:640px;margin:0 auto}
  .xp-panels{grid-template-columns:1fr}
  .xp-bottom{grid-template-columns:1fr}
}
@media(max-width:720px){
  .xp-top{padding:16px 16px 4px;flex-wrap:wrap}
  .xp-brand{margin:0;order:-1}
  .xp-lang{margin-left:auto}
  .xp-hero,.xp-choose,.xp-ribbon,.xp-bottom{padding-left:16px;padding-right:16px}
  .xp-panel-body{grid-template-columns:1fr}
  .xp-panel-art{max-width:260px;margin:2px auto 0}
  .xp-ribbon em{display:none}
  .xp-cta{width:100%;justify-content:center}
}
`;
