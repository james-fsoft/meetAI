import type { PageDef } from "./footer-pages";

/** Korean content for the footer pages. */
export const PAGES_KO: Record<string, PageDef> = {
  features: {
    eyebrow: "제품 · 기능",
    title: "회의 전체를 이해하는 데 필요한 모든 것",
    lead:
      "Flash Meet은 실시간 번역 자막, 화자 구분, 회의 후 AI 정리를 하나의 흐름으로 묶습니다 — 첫 마디부터 회의록까지.",
    actions: [
      { label: "Flash Meet 열기", href: "/?app=1", primary: true },
      { label: "요금제 보기", href: "/pricing" },
    ],
    sections: [
      {
        title: "회의 중",
        cards: [
          {
            title: "실시간 이중 언어 자막",
            text: "말한 내용과 번역을 거의 실시간으로 보여 주어, 여러 언어가 섞인 대화도 모두가 따라갈 수 있습니다.",
          },
          {
            title: "화자 구분",
            text: "말하는 사람을 구분해 기록을 읽기 쉽게 만들고, 누가 무슨 말을 했는지 헷갈리지 않게 합니다.",
          },
          {
            title: "마이크 + 컴퓨터 소리",
            text: "현장 대화는 물론 브라우저 탭 소리도 번역합니다. Chrome 확장 프로그램을 쓰면 Google Meet, Zoom, Teams, 동영상에서 더 편합니다.",
            href: "/extension",
            cta: "확장 프로그램 보기",
          },
        ],
      },
      {
        title: "회의 후",
        cards: [
          {
            title: "AI 요약",
            text: "기록에서 핵심 내용, 결정 사항, 리스크, 후속 항목을 자동으로 뽑아냅니다.",
          },
          {
            title: "액션 아이템",
            text: "할 일을 명확한 목록으로 분리해, 회의가 끝나자마자 팀이 이어서 움직일 수 있게 합니다.",
          },
          {
            title: "기록 & 회의 캘린더",
            text: "저장한 회의는 계정의 기록·캘린더 영역에서 언제든 다시 열어 볼 수 있습니다.",
            href: "/dashboard",
            cta: "캘린더 열기",
          },
        ],
      },
      {
        title: "발표 & 컨퍼런스",
        cards: [
          {
            title: "컨퍼런스 모드",
            text: "번역 자막을 발표 화면에 올립니다. 가로 띠 또는 세로 칼럼으로, 컨퍼런스에 맞게 표시 방식을 조절할 수 있습니다.",
            href: "/conference-mode",
            cta: "컨퍼런스 모드 열기",
          },
          {
            title: "떠 있는 자막 창",
            text: "자막을 별도 창에 띄워, 발표 화면은 그대로 두고 청중은 번역을 읽게 합니다.",
          },
          {
            title: "청중용 QR 코드",
            text: "발표자가 참여 코드를 공유하면 참석자는 각자 휴대폰에서 번역을 볼 수 있습니다.",
          },
        ],
      },
    ],
  },

  "use-cases": {
    eyebrow: "제품 · 활용 사례",
    title: "Flash Meet이 가장 많이 쓰이는 일곱 가지 상황",
    lead:
      "도구는 하나, 대화는 여러 가지. 지금 상황과 가장 가까운 것을 골라 어디서 시작할지 확인하세요.",
    actions: [
      { label: "지금 사용해 보기", href: "/?app=1", primary: true },
      { label: "기능 보기", href: "/features" },
    ],
    sections: [
      {
        title: "상황을 고르세요",
        cards: [
          {
            title: "업무 회의",
            text: "프로젝트 회의, 고객 미팅, 내부 회의에서 이중 언어 자막을 보고, 끝나면 기록·요약·액션 아이템을 받습니다.",
            img: "/concept/uc-meeting.jpg",
            href: "/?app=1",
            cta: "앱 열기",
          },
          {
            title: "컨퍼런스·대형 행사",
            text: "발표 화면의 큰 자막, 슬라이드 위에 뜨는 자막 창, 그리고 청중이 휴대폰으로 읽을 수 있는 QR 코드.",
            img: "/concept/uc-conference.jpg",
            href: "/conference-mode",
            cta: "컨퍼런스 모드 열기",
          },
          {
            title: "화상 통화",
            text: "Google Meet·Zoom·Teams는 브라우저에서 실행됩니다 — 확장 프로그램이 그 탭의 소리를 듣고 페이지 위에 자막을 띄웁니다.",
            img: "/concept/uc-videocall.jpg",
            href: "/extension",
            cta: "확장 프로그램 보기",
          },
          {
            title: "일상 대화",
            text: "여행, 해외 파트너나 친구와의 만남: 기기를 가운데 두면 마이크가 양쪽을 모두 듣고 번역합니다.",
            img: "/concept/uc-daily.jpg",
            href: "/guide",
            cta: "가이드 보기",
          },
          {
            title: "학습·연구",
            text: "외국어 강의, 세미나, 전문 영상 — 보면서 바로 번역 자막을 읽습니다.",
            img: "/concept/uc-study.jpg",
            href: "/extension",
            cta: "확장 프로그램 보기",
          },
          {
            title: "영상·영화",
            text: "자막이 없는 콘텐츠도 됩니다. 확장 프로그램이 탭의 소리를 직접 듣기 때문입니다.",
            img: "/concept/uc-movie.jpg",
            href: "/extension",
            cta: "확장 프로그램 보기",
          },
          {
            title: "발표·교육",
            text: "해외 청중도 요점을 놓치지 않습니다: 프로젝터 자막 또는 슬라이드 위 자막 창.",
            img: "/concept/uc-training.jpg",
            href: "/conference-mode",
            cta: "컨퍼런스 모드 열기",
          },
        ],
      },
    ],
    note:
      "목록에 없나요? 기준은 간단합니다. 브라우저에서 나는 소리는 확장 프로그램, 같은 공간의 대화는 앱의 마이크, 회의실 전체에 보여 줄 때는 컨퍼런스 모드.",
  },

  apps: {
    eyebrow: "제품 · 앱",
    title: "상황에 맞는 Flash Meet 사용 방법을 고르세요",
    lead:
      "웹에서 바로 쓰거나, 브라우저 확장 프로그램을 설치하거나, 발표 화면과 컨퍼런스를 위해 컨퍼런스 모드를 열 수 있습니다.",
    sections: [
      {
        title: "사용 방법",
        cards: [
          {
            title: "Flash Meet 웹",
            text: "데스크톱 프로그램 설치 없이 브라우저에서 바로 실시간 번역 세션을 시작합니다.",
            href: "/?app=1",
            cta: "앱 열기",
            badge: "WEB",
          },
          {
            title: "브라우저 확장 프로그램",
            text: "Google Meet, Zoom, Teams, YouTube 등 브라우저에서 재생되는 소리를 번역합니다.",
            href: "/extension",
            cta: "확장 프로그램 보기",
            badge: "CHROME",
          },
          {
            title: "컨퍼런스 모드",
            text: "발표용으로 설계했습니다. 큰 자막, 여러 레이아웃, 청중용 링크와 QR 코드를 제공합니다.",
            href: "/conference-mode",
            cta: "컨퍼런스 모드 열기",
            badge: "STAGE",
          },
          {
            title: "회의 캘린더",
            text: "저장한 회의와 기록, 회의 후 결과를 계정에서 다시 확인합니다.",
            href: "/dashboard",
            cta: "캘린더 열기",
            badge: "HISTORY",
          },
        ],
      },
    ],
  },

  roadmap: {
    eyebrow: "제품 · 로드맵",
    title: "Flash Meet은 어디로 가고 있나요?",
    lead:
      "제품의 우선순위는 다국어 소통이 덜 끊기게 만드는 것입니다. 말하는 동안 더 나은 번역, 회의 후 더 정확한 기록, 팀에 더 쉬운 도입.",
    sections: [
      {
        title: "이미 제공 중",
        cards: [
          {
            title: "실시간 번역 & 이중 언어 자막",
            text: "웹과 브라우저 확장 프로그램에서, 여러 회의·영상 상황에 사용합니다.",
          },
          {
            title: "AI 요약 & 액션 아이템",
            text: "회의 기록을 후속 조치로 이어지는 형태로 바꿔 줍니다.",
          },
          {
            title: "컨퍼런스 모드",
            text: "발표 화면용 여러 표시 방식, 떠 있는 자막, 휴대폰으로 보는 청중까지.",
          },
        ],
      },
      {
        title: "다음 우선순위",
        cards: [
          {
            title: "언어 품질",
            text: "인식과 번역의 안정성, 전문 용어 처리 방식을 계속 개선합니다.",
          },
          {
            title: "팀 워크플로",
            text: "회의 내용을 공유하고 검토하고 다시 찾아 쓰는 과정을 더 편하게 만듭니다.",
          },
          {
            title: "연동 & 내보내기",
            text: "회의 결과가 요약에서 멈추지 않고 다음 업무로 바로 이어지도록 연결 경로를 넓힙니다.",
          },
        ],
      },
    ],
    note:
      "로드맵은 제품 방향을 보여 주는 것이며 출시 일정을 약속하지 않습니다. 사용자 피드백과 기술적 요건에 따라 순서와 범위가 바뀔 수 있습니다.",
  },

  guide: {
    eyebrow: "리소스 · 가이드",
    title: "몇 분이면 Flash Meet을 시작할 수 있습니다",
    lead:
      "기본 흐름은 짧습니다. 언어를 고르고, 소리 입력을 고르고, 번역을 시작하고, 끝나면 결과를 저장합니다.",
    actions: [
      { label: "Flash Meet 열기", href: "/?app=1", primary: true },
      { label: "확장 프로그램 가이드", href: "/extension" },
    ],
    sections: [
      {
        title: "기본 4단계",
        cards: [
          {
            badge: "01",
            title: "앱 열기",
            text: "브라우저에서 Flash Meet에 들어갑니다. 웹에서 바로 시작하거나, 탭 소리를 번역하려면 확장 프로그램을 사용하세요.",
          },
          {
            badge: "02",
            title: "언어 선택",
            text: "말하는 언어와 읽고 싶은 언어를 고릅니다. 컨퍼런스 모드에서는 표시할 언어 수도 고릅니다.",
          },
          {
            badge: "03",
            title: "소리 입력 선택 & 시작",
            text: "현장 대화는 마이크로, 브라우저의 영상·회의는 확장 프로그램이나 (지원되는 경우) 컴퓨터 소리 공유로 받습니다.",
          },
          {
            badge: "04",
            title: "종료 & 결과 확인",
            text: "세션을 멈추면 기록, 요약, 액션 아이템을 볼 수 있습니다. 로그인 상태라면 해당 내용이 기록에 저장될 수 있습니다.",
          },
        ],
      },
      {
        title: "무엇을 하려고 하시나요?",
        cards: [
          {
            title: "Google Meet / Zoom / Teams 번역",
            text: "확장 프로그램을 설치해 탭 소리를 가져오고 브라우저에서 바로 자막을 봅니다.",
            href: "/extension",
            cta: "설치 방법 보기",
          },
          {
            title: "회의실 전체에 번역 띄우기",
            text: "컨퍼런스 모드로 발표 화면에 자막을 배치하고, 청중은 QR로 참여합니다.",
            href: "/conference-mode",
            cta: "컨퍼런스 모드 열기",
          },
          {
            title: "요금제 & 사용 시간 관리",
            text: "Free, Pro, Business, Enterprise 요금제와 각 한도를 확인합니다.",
            href: "/pricing",
            cta: "요금제 보기",
          },
        ],
      },
    ],
  },

  faq: {
    eyebrow: "리소스 · FAQ",
    title: "자주 묻는 질문",
    lead:
      "Flash Meet의 작동 방식, 언어, 데이터, 온라인 회의에서의 사용에 대한 짧은 답변입니다.",
    sections: [
      {
        title: "사용",
        cards: [
          {
            title: "Google Meet, Zoom, Teams에서 쓸 수 있나요?",
            text: "네. 브라우저 확장 프로그램은 Google Meet, Zoom, Microsoft Teams, YouTube 같은 회의·웹 콘텐츠를 위해 만들어졌습니다.",
          },
          {
            title: "데스크톱 앱을 설치해야 하나요?",
            text: "아니요. Flash Meet은 웹에서 동작합니다. 탭 소리와 페이지 위 자막이 필요하면 브라우저 확장 프로그램을 사용하세요.",
          },
          {
            title: "베트남어·영어·한국어를 지원하나요?",
            text: "네, 이 세 언어가 제품의 중심이며 모드에 따라 더 많은 언어도 사용할 수 있습니다.",
          },
          {
            title: "회의 후 자동 요약이 되나요?",
            text: "네. 기록이 있으면 Flash Meet이 AI로 요약, 결정 사항, 액션 아이템을 만들 수 있습니다.",
          },
          {
            title: "컨퍼런스나 발표 화면에도 쓸 수 있나요?",
            text: "네. 컨퍼런스 모드에는 발표 화면용 자막 레이아웃, 떠 있는 창, QR·링크로 참여하는 청중 화면이 있습니다.",
            href: "/conference-mode",
            cta: "컨퍼런스 모드 보기",
          },
          {
            title: "무료로 쓸 수 있나요?",
            text: "네. 요금제 페이지에서 현재 Free 한도와 유료 요금제를 확인할 수 있습니다.",
            href: "/pricing",
            cta: "요금제 보기",
          },
        ],
      },
      {
        title: "데이터 & 개인정보",
        cards: [
          {
            title: "녹음 전에 동의를 받아야 하나요?",
            text: "서비스를 사용하는 지역의 녹음·개인정보 규정을 지킬 책임은 사용자에게 있습니다. 법이 요구하는 경우 반드시 알리고 동의를 받으세요.",
            href: "/terms",
            cta: "이용약관 보기",
          },
          {
            title: "Flash Meet은 데이터를 어떻게 처리하나요?",
            text: "개인정보 처리방침에 처리하는 데이터, 관련 제공업체, 보관 기간, 사용자 권리가 정리돼 있습니다.",
            href: "/privacy",
            cta: "처리방침 보기",
          },
        ],
      },
    ],
  },

  docs: {
    eyebrow: "리소스 · 문서",
    title: "Flash Meet 문서 센터",
    lead:
      "필요한 문서로 바로 갑니다. 시작하기, 브라우저 확장 프로그램, 컨퍼런스, 요금제, 정책.",
    sections: [
      {
        title: "제품 문서",
        cards: [
          {
            title: "빠른 시작",
            text: "앱을 여는 것부터 회의 후 결과를 보는 것까지 4단계.",
            href: "/guide",
            cta: "가이드 읽기",
          },
          {
            title: "브라우저 확장 프로그램",
            text: "Google Meet, Zoom, Teams, YouTube에서 Flash Meet을 설치하고 사용하는 방법.",
            href: "/extension",
            cta: "문서 열기",
          },
          {
            title: "컨퍼런스 모드",
            text: "컨퍼런스, 회의실, 큰 화면을 위한 자막 표시 모드.",
            href: "/conference-mode",
            cta: "모드 열기",
          },
          {
            title: "FAQ",
            text: "언어, 기기, 데이터, 사용 방법에 대해 자주 묻는 질문.",
            href: "/faq",
            cta: "FAQ 보기",
          },
        ],
      },
      {
        title: "계정 & 정책",
        cards: [
          {
            title: "요금제",
            text: "요금제별 한도와 제공 범위.",
            href: "/pricing",
            cta: "요금제 보기",
          },
          {
            title: "개인정보 처리방침",
            text: "데이터와 개인정보 처리에 대한 안내.",
            href: "/privacy",
            cta: "처리방침 읽기",
          },
          {
            title: "이용약관",
            text: "사용 조건, 녹음 책임, 서비스 제한 사항.",
            href: "/terms",
            cta: "약관 읽기",
          },
        ],
      },
    ],
  },

  videos: {
    eyebrow: "리소스 · 영상",
    title: "Flash Meet 영상 가이드",
    lead:
      "영상 가이드는 계속 채워 가는 중입니다. 그동안 중요한 흐름은 모두 글 가이드로 바로 따라 할 수 있습니다.",
    sections: [
      {
        title: "가이드 내용",
        cards: [
          {
            title: "번역 세션 시작하기",
            text: "언어와 소리 입력을 고르고 Flash Meet에서 세션을 시작하는 방법.",
            href: "/guide",
            cta: "가이드 보기",
          },
          {
            title: "Google Meet / Zoom / 영상 번역",
            text: "확장 프로그램을 설치해 브라우저 탭 소리를 번역하는 방법.",
            href: "/extension",
            cta: "확장 프로그램 보기",
          },
          {
            title: "컨퍼런스 모드로 발표하기",
            text: "발표 화면에 자막을 올리고, 레이아웃을 고르고, 청중에게 QR을 공유하는 방법.",
            href: "/conference-mode",
            cta: "컨퍼런스 모드 열기",
          },
        ],
      },
    ],
    note:
      "공식 영상 가이드가 준비되면, 확인되지 않은 링크 대신 이 페이지에 최신 영상을 모읍니다.",
  },

  about: {
    eyebrow: "회사 · 회사 소개",
    title: "Flash Meet은 다국어 대화의 거리를 좁힙니다",
    lead:
      "Flash Meet은 회의·컨퍼런스·음성 콘텐츠를 위한 실시간 번역과 AI에 집중하는 TransFlash의 솔루션입니다.",
    sections: [
      {
        title: "무엇을 해결하고 있나요?",
        cards: [
          {
            title: "말하는 동안 서로 이해하기",
            text: "언어 때문에 되묻고 멈추고 나중에 번역을 기다리느라 회의가 계속 끊겨서는 안 됩니다.",
          },
          {
            title: "회의가 끝나도 내용을 잃지 않기",
            text: "기록, 요약, 결정 사항, 액션 아이템이 있으면 통화가 끝나도 지식이 사라지지 않습니다.",
          },
          {
            title: "쓰던 도구 위에서 그대로",
            text: "회의 방식을 통째로 바꾸게 하는 대신, 지금의 워크플로에 번역과 AI를 더하는 것이 목표입니다.",
          },
        ],
      },
      {
        title: "제품 원칙",
        bullets: [
          "시작이 쉬울 것: 웹과 브라우저 경험을 우선합니다.",
          "명확할 것: 자막과 요약은 더 빨리 이해하게 해야지, 소음을 더해서는 안 됩니다.",
          "데이터를 존중할 것: 개인정보와 녹음 동의는 제품 사용 방식의 일부입니다.",
          "현실적인 다국어: 실제 업무에서 벌어지는 대화 상황에 집중합니다.",
        ],
      },
    ],
  },

  careers: {
    eyebrow: "회사 · 채용",
    title: "사람들이 서로 더 잘 이해하게 돕는 도구를 함께 만듭니다",
    lead:
      "Flash Meet은 음성 AI, 번역, 회의 경험, 업무 워크플로가 만나는 지점에 있는 제품입니다.",
    actions: [
      {
        label: "이력서 보내기",
        href: "mailto:support@transflash.app?subject=%5BCareer%5D%20Flash%20Meet",
        primary: true,
      },
      { label: "제품 살펴보기", href: "/features" },
    ],
    sections: [
      {
        title: "어울리는 역량",
        cards: [
          {
            title: "Engineering / AI",
            text: "실시간 오디오, 음성 인식, 번역, 웹 성능, 안정성, AI 연동.",
          },
          {
            title: "Product / Design",
            text: "대면 회의, 온라인 회의, 컨퍼런스 화면을 위한 마찰 없는 경험 설계.",
          },
          {
            title: "Growth / Partnerships",
            text: "실제 다국어 소통이 필요한 팀과 기업에 제품을 전달하는 일.",
          },
        ],
      },
    ],
    note:
      "구체적인 채용 공고는 필요에 따라 열립니다. support@transflash.app 으로 제목을 [Career] Flash Meet 으로 해서 이력서나 자기소개를 보내 주세요.",
  },

  contact: {
    eyebrow: "회사 · 문의",
    title: "Flash Meet 문의하기",
    lead:
      "제목을 맞게 적어 주시면 더 빨리 처리할 수 있습니다: 제품 지원, 결제, 기업 협업, 데이터 관련 문의.",
    actions: [
      {
        label: "support@transflash.app 로 메일",
        href: "mailto:support@transflash.app",
        primary: true,
      },
      { label: "FAQ 보기", href: "/faq" },
    ],
    sections: [
      {
        title: "무엇을 도와드릴까요?",
        cards: [
          {
            title: "제품 지원",
            text: "번역 오류, 마이크, 확장 프로그램, 컨퍼런스 모드 등 사용 중 생긴 문제.",
            href: "mailto:support@transflash.app?subject=%5BSupport%5D%20Flash%20Meet",
            cta: "메일 보내기",
          },
          {
            title: "요금제 & 결제",
            text: "Free, Pro, Business, Enterprise, 사용 한도, 요금제 변경에 대한 질문.",
            href: "mailto:support@transflash.app?subject=%5BBilling%5D%20Flash%20Meet",
            cta: "문의하기",
          },
          {
            title: "기업 & 협업",
            text: "팀 도입, 행사, 컨퍼런스 적용, 제품 협업 논의.",
            href: "mailto:support@transflash.app?subject=%5BBusiness%5D%20Flash%20Meet",
            cta: "상담하기",
          },
          {
            title: "개인정보",
            text: "개인정보 관련 요청, 열람 또는 삭제 요청.",
            href: "mailto:support@transflash.app?subject=%5BPrivacy%5D%20Flash%20Meet",
            cta: "요청 보내기",
          },
        ],
      },
    ],
  },
};
