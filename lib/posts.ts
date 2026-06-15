// Blog posts for SEO long-tail traffic. Authored as data (no MDX tooling) with
// a small set of HTML tags rendered via dangerouslySetInnerHTML. Each post
// targets a real, high-intent search query in its language.

export type PostLang = "en" | "vi" | "ko";
export type Post = {
  slug: string;
  lang: PostLang;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  keywords: string[];
  body: string; // limited HTML: h2, p, ul/li, strong, a
};

export const POSTS: Post[] = [
  {
    slug: "cach-dich-cuoc-hop-zoom-truc-tiep",
    lang: "vi",
    date: "2026-06-15",
    title: "Cách dịch cuộc họp Zoom trực tiếp (real-time) ngay khi đang họp",
    description:
      "Hướng dẫn dịch cuộc họp Zoom theo thời gian thực với phụ đề song ngữ, kèm tóm tắt và biên bản tự động bằng AI. Làm được ngay trên trình duyệt, miễn phí để bắt đầu.",
    keywords: ["dịch cuộc họp Zoom trực tiếp", "dịch Zoom real-time", "phụ đề song ngữ Zoom", "phiên dịch cuộc họp Zoom"],
    body: `
<p>Họp Zoom với đối tác nước ngoài mà nghe không kịp là chuyện rất thường gặp. Tin tốt: bạn có thể <strong>dịch cuộc họp Zoom trực tiếp</strong> — phụ đề song ngữ hiện lên ngay khi mọi người đang nói, không cần chờ đến cuối buổi.</p>
<h2>1. Dùng Flash Meet ngay trên trình duyệt</h2>
<p>Mở <a href="/">Flash Meet</a>, chọn cặp ngôn ngữ (ví dụ Anh → Việt) rồi bấm bắt đầu. Trong khi cuộc họp Zoom diễn ra, Flash Meet nghe âm thanh và hiển thị <strong>phụ đề hai chiều</strong>: câu gốc và bản dịch xếp cạnh nhau. Mỗi người nói được tách riêng (Speaker 1, 2, 3…) nên bạn luôn biết ai đang nói.</p>
<ul>
<li>Không cần cài đặt phức tạp — chạy trực tiếp trên Chrome hoặc Edge.</li>
<li>Hỗ trợ nhiều ngôn ngữ: Việt, Anh, Hàn, Nhật, Trung…</li>
<li>Dùng thử miễn phí trước khi nâng cấp.</li>
</ul>
<h2>2. Cài tiện ích Chrome để dịch ngay trong tab Zoom</h2>
<p>Nếu muốn dịch ngay trên tab đang mở, hãy cài <a href="/extension">tiện ích TransFlash Live Translate</a>. Tiện ích bắt âm thanh của tab (hoặc micro của bạn) và phủ phụ đề song ngữ lên màn hình — tiện cho cả Zoom, Google Meet lẫn Microsoft Teams.</p>
<h2>3. Nhận tóm tắt &amp; biên bản tự động sau buổi họp</h2>
<p>Kết thúc cuộc họp, Flash Meet tự viết <strong>tóm tắt, việc cần làm, quyết định và rủi ro</strong> bằng AI — theo đúng ngôn ngữ bạn chọn. Bạn tải về bản tóm tắt và bản ghi với tên file rõ ràng, không phải ghi chú thủ công.</p>
<h2>Câu hỏi thường gặp</h2>
<p><strong>Có cần Zoom Pro không?</strong> Không. Flash Meet hoạt động độc lập với gói Zoom của bạn.</p>
<p><strong>Có miễn phí không?</strong> Bạn bắt đầu miễn phí; gói Pro/Business cho thêm phút dịch và đầy đủ tính năng AI. Xem <a href="/pricing">bảng giá</a>.</p>
<p><a href="/">→ Mở Flash Meet và dịch thử cuộc họp Zoom ngay</a></p>
`,
  },
  {
    slug: "dich-google-meet-sang-tieng-viet",
    lang: "vi",
    date: "2026-06-15",
    title: "Dịch Google Meet sang tiếng Việt khi đang họp + tóm tắt AI",
    description:
      "Cách bật phụ đề song ngữ và dịch Google Meet sang tiếng Việt theo thời gian thực, tách giọng từng người và tự động tóm tắt cuộc họp bằng AI.",
    keywords: ["dịch Google Meet sang tiếng Việt", "phụ đề Google Meet tiếng Việt", "dịch Google Meet trực tiếp", "tóm tắt Google Meet AI"],
    body: `
<p>Google Meet có phụ đề, nhưng nếu bạn cần <strong>dịch Google Meet sang tiếng Việt</strong> ngay khi đang họp — và muốn cả bản tóm tắt sau buổi — thì cần một công cụ chuyên cho việc đó. Dưới đây là cách làm nhanh nhất.</p>
<h2>Bước 1: Mở Flash Meet song song với Google Meet</h2>
<p>Truy cập <a href="/">Flash Meet</a>, chọn ngôn ngữ đích là Tiếng Việt (chế độ một chiều) hoặc cặp song ngữ. Flash Meet sẽ hiển thị bản dịch trực tiếp trong khi mọi người đang nói, kèm <strong>tách giọng từng người nói</strong>.</p>
<h2>Bước 2: Hoặc cài tiện ích Chrome để gọn hơn</h2>
<p>Với <a href="/extension">tiện ích TransFlash Live Translate</a>, phụ đề song ngữ phủ trực tiếp lên tab Google Meet. Bạn không phải chuyển qua lại giữa các cửa sổ.</p>
<h2>Bước 3: Tóm tắt &amp; biên bản tự động</h2>
<p>Sau cuộc họp, AI tạo <strong>tóm tắt, việc cần làm và quyết định</strong> bằng tiếng Việt. Bạn có thể chọn ngôn ngữ đầu ra của phần tóm tắt — kể cả khi cuộc họp dùng lẫn 2 thứ tiếng, AI vẫn gom về một ngôn ngữ thống nhất.</p>
<ul>
<li>Phụ đề song ngữ thời gian thực.</li>
<li>Tách giọng Speaker 1, 2, 3…</li>
<li>Tải về tóm tắt &amp; bản ghi có tên file rõ ràng.</li>
</ul>
<p><a href="/">→ Dịch Google Meet sang tiếng Việt với Flash Meet</a> · <a href="/pricing">Xem bảng giá</a></p>
`,
  },
  {
    slug: "translate-microsoft-teams-meeting-real-time",
    lang: "en",
    date: "2026-06-15",
    title: "How to translate a Microsoft Teams meeting in real time",
    description:
      "Translate Microsoft Teams meetings live with bilingual subtitles, separate every speaker, and get an automatic AI summary and minutes when the call ends.",
    keywords: ["translate Microsoft Teams meeting", "Teams live translation", "real-time Teams subtitles", "Teams meeting AI summary"],
    body: `
<p>Microsoft Teams has captions, but if you need <strong>live translation</strong> across languages — and a written summary afterwards — you need a dedicated tool. Here is the fastest way to translate a Teams meeting in real time.</p>
<h2>Option 1: Run Flash Meet alongside Teams</h2>
<p>Open <a href="/">Flash Meet</a>, pick your language pair, and start. While the Teams call runs, Flash Meet shows <strong>bilingual subtitles</strong> — the original and the translation side by side — and separates each speaker automatically.</p>
<h2>Option 2: Use the Chrome extension</h2>
<p>Install the <a href="/extension">TransFlash Live Translate extension</a> to overlay live subtitles right on the Teams tab. It captures the tab audio (or your microphone) so it also works for Google Meet, Zoom and YouTube.</p>
<h2>Get the summary automatically</h2>
<p>When the meeting ends, Flash Meet writes the <strong>summary, action items, decisions and risks</strong> with AI, in the language you choose. Download the summary and transcript with clear, titled file names.</p>
<ul>
<li>Real-time bilingual subtitles.</li>
<li>Speaker separation.</li>
<li>Automatic AI minutes — no manual notes.</li>
</ul>
<p><a href="/">→ Translate your next Teams meeting with Flash Meet</a> · <a href="/pricing">See pricing</a></p>
`,
  },
  {
    slug: "zoom-google-meet-real-time-translation",
    lang: "ko",
    date: "2026-06-15",
    title: "줌·구글미트 회의를 실시간으로 번역하는 방법",
    description:
      "이중 언어 자막으로 Zoom과 Google Meet 회의를 실시간 번역하고, 화자를 분리하며, 회의가 끝나면 AI 요약과 회의록을 자동으로 받는 방법.",
    keywords: ["줌 실시간 번역", "구글미트 번역", "회의 실시간 자막", "회의 AI 요약"],
    body: `
<p>해외 파트너와 Zoom이나 Google Meet으로 회의할 때 실시간으로 알아듣기는 쉽지 않습니다. 이 글에서는 <strong>회의를 실시간으로 번역</strong>하는 방법을 안내합니다 — 말하는 동안 이중 언어 자막이 바로 표시됩니다.</p>
<h2>1. 브라우저에서 Flash Meet 실행</h2>
<p><a href="/">Flash Meet</a>을 열고 언어 쌍을 선택한 뒤 시작하세요. 회의 중 원문과 번역이 나란히 표시되며, 화자(Speaker 1, 2, 3…)가 자동으로 구분됩니다.</p>
<h2>2. Chrome 확장으로 탭에 바로 표시</h2>
<p><a href="/extension">TransFlash Live Translate 확장</a>을 설치하면 Zoom·Google Meet·Teams 탭 위에 이중 자막이 바로 표시됩니다.</p>
<h2>3. 회의 후 AI 요약 자동 생성</h2>
<p>회의가 끝나면 AI가 <strong>요약, 액션 아이템, 결정, 리스크</strong>를 선택한 언어로 자동 작성합니다. 요약과 전사본은 알아보기 쉬운 파일명으로 내려받을 수 있습니다.</p>
<ul>
<li>실시간 이중 언어 자막</li>
<li>화자 분리</li>
<li>AI 회의록 자동 작성</li>
</ul>
<p><a href="/">→ Flash Meet으로 회의 번역 시작하기</a> · <a href="/pricing">요금제 보기</a></p>
`,
  },
];

export const BLOG_LABELS: Record<PostLang, { title: string; sub: string; back: string; more: string }> = {
  en: { title: "Flash Meet Blog", sub: "Guides for live meeting translation, AI summaries and minutes.", back: "← All articles", more: "Open Flash Meet" },
  vi: { title: "Blog Flash Meet", sub: "Hướng dẫn dịch cuộc họp trực tiếp, tóm tắt và biên bản bằng AI.", back: "← Tất cả bài viết", more: "Mở Flash Meet" },
  ko: { title: "Flash Meet 블로그", sub: "실시간 회의 번역, AI 요약·회의록 가이드.", back: "← 모든 글", more: "Flash Meet 열기" },
};

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}
