import type { PageDef } from "./footer-pages";

/** English content for the footer pages. */
export const PAGES_EN: Record<string, PageDef> = {
  features: {
    eyebrow: "PRODUCT · FEATURES",
    title: "Everything you need to follow a whole meeting",
    lead:
      "Flash Meet puts live translated captions, speaker separation and post-meeting AI into one flow — from the first word spoken to the finished notes.",
    actions: [
      { label: "Open Flash Meet", href: "/?app=1", primary: true },
      { label: "See pricing", href: "/pricing" },
    ],
    sections: [
      {
        title: "During the meeting",
        cards: [
          {
            title: "Live bilingual captions",
            text: "Shows what was said and its translation almost in real time, so everyone can keep up with a multilingual conversation.",
          },
          {
            title: "Speaker separation",
            text: "Tells speakers apart, which makes the transcript easier to read and leaves less doubt about who said what.",
          },
          {
            title: "Microphone + computer audio",
            text: "Translate a conversation in the room or the sound of a browser tab; the Chrome extension makes that convenient for Google Meet, Zoom, Teams and video.",
            href: "/extension",
            cta: "See the extension",
          },
        ],
      },
      {
        title: "After the meeting",
        cards: [
          {
            title: "AI summary",
            text: "Pulls the main points, decisions, risks and follow-ups out of the transcript for you.",
          },
          {
            title: "Action items",
            text: "Separates the tasks into a clear list so the team can carry on the moment the call ends.",
          },
          {
            title: "History & meeting calendar",
            text: "Saved meetings can be reopened later in the history and calendar area of your account.",
            href: "/dashboard",
            cta: "Open the calendar",
          },
        ],
      },
      {
        title: "Presenting & conferences",
        cards: [
          {
            title: "Conference Mode",
            text: "Puts translated captions on the projected screen as a wide strip or a tall column, with display settings made for conferences.",
            href: "/conference-mode",
            cta: "Open Conference Mode",
          },
          {
            title: "Floating caption window",
            text: "Keeps the captions in a window of their own, so your slides stay on the main screen while the room reads the translation.",
          },
          {
            title: "A QR code for the audience",
            text: "Attendees can follow the translation on their phones once the presenter shares the join code.",
          },
        ],
      },
    ],
  },

  "use-cases": {
    eyebrow: "PRODUCT · USE CASES",
    title: "The seven situations Flash Meet is used for most",
    lead:
      "One tool, many kinds of conversation. Pick the one closest to yours to see where to start.",
    actions: [
      { label: "Try it now", href: "/?app=1", primary: true },
      { label: "See the features", href: "/features" },
    ],
    sections: [
      {
        title: "Pick your situation",
        cards: [
          {
            title: "Work meetings",
            text: "Bilingual captions through a project meeting, a customer call or an internal session; afterwards you get the transcript, a summary and the action items.",
            img: "/concept/uc-meeting.jpg",
            href: "/?app=1",
            cta: "Open the app",
          },
          {
            title: "Conferences & events",
            text: "Large captions on the projected screen, a floating panel over your slides, and a QR code so the audience can read the translation on their phones.",
            img: "/concept/uc-conference.jpg",
            href: "/conference-mode",
            cta: "Open Conference Mode",
          },
          {
            title: "Video calls",
            text: "Google Meet, Zoom and Teams run in the browser — the extension listens to that tab and puts the captions right on the page.",
            img: "/concept/uc-videocall.jpg",
            href: "/extension",
            cta: "See the extension",
          },
          {
            title: "Everyday conversation",
            text: "Travelling, meeting a partner or friends from abroad: put the device between you and the microphone hears both sides.",
            img: "/concept/uc-daily.jpg",
            href: "/guide",
            cta: "Read the guide",
          },
          {
            title: "Study & research",
            text: "Lectures, seminars and specialist video in another language — read the translation while you watch.",
            img: "/concept/uc-study.jpg",
            href: "/extension",
            cta: "See the extension",
          },
          {
            title: "Video & films",
            text: "Content without subtitles still works, because the extension listens to the tab’s own audio.",
            img: "/concept/uc-movie.jpg",
            href: "/extension",
            cta: "See the extension",
          },
          {
            title: "Talks & training",
            text: "An international audience follows every point: captions on the projector or floating over your slides.",
            img: "/concept/uc-training.jpg",
            href: "/conference-mode",
            cta: "Open Conference Mode",
          },
        ],
      },
    ],
    note:
      "Not on the list? The rule of thumb: sound in the browser → the extension; people in the room → the app’s microphone; a whole room watching → Conference Mode.",
  },

  apps: {
    eyebrow: "PRODUCT · APPS",
    title: "Pick the way of using Flash Meet that fits the moment",
    lead:
      "Use it straight from the web, add the browser extension, or open Conference Mode for a projector and an audience.",
    sections: [
      {
        title: "Ways to use it",
        cards: [
          {
            title: "Flash Meet Web",
            text: "Start a live translation session right in the browser, with no desktop software to install.",
            href: "/?app=1",
            cta: "Open the app",
            badge: "WEB",
          },
          {
            title: "Browser extension",
            text: "Translates the audio of Google Meet, Zoom, Teams, YouTube and anything else playing in the browser.",
            href: "/extension",
            cta: "See the extension",
            badge: "CHROME",
          },
          {
            title: "Conference Mode",
            text: "Built for presenting: large captions, several layouts, and a link or QR code for the audience.",
            href: "/conference-mode",
            cta: "Open Conference Mode",
            badge: "STAGE",
          },
          {
            title: "Meeting calendar",
            text: "Reopen saved meetings, their transcripts and their post-meeting results inside your account.",
            href: "/dashboard",
            cta: "Open the calendar",
            badge: "HISTORY",
          },
        ],
      },
    ],
  },

  roadmap: {
    eyebrow: "PRODUCT · ROADMAP",
    title: "Where Flash Meet is heading",
    lead:
      "The product's priority is to make multilingual conversation less interrupted: better translation while people speak, a more accurate record afterwards, and an easier rollout for a team.",
    sections: [
      {
        title: "Already here",
        cards: [
          {
            title: "Live translation & bilingual captions",
            text: "On the web and through the browser extension, for meetings and for video.",
          },
          {
            title: "AI summary & action items",
            text: "Turns the transcript into something a team can actually follow up on.",
          },
          {
            title: "Conference Mode",
            text: "Several display layouts for a projected screen, floating captions, and viewers on their phones.",
          },
        ],
      },
      {
        title: "What comes next",
        cards: [
          {
            title: "Language quality",
            text: "Keep improving how steady the recognition and translation are, and how specialist terms are handled.",
          },
          {
            title: "Team workflow",
            text: "Make sharing, reviewing, finding and reusing meeting content more convenient.",
          },
          {
            title: "Integrations & export",
            text: "Widen the ways results leave Flash Meet, so a meeting feeds the next piece of work instead of stopping at a summary.",
          },
        ],
      },
    ],
    note:
      "The roadmap shows product direction, not release dates. Order and scope can change with user feedback and technical constraints.",
  },

  guide: {
    eyebrow: "RESOURCES · GUIDE",
    title: "Start with Flash Meet in a few minutes",
    lead:
      "The basic flow is short: choose the languages, choose the audio source, start translating, and keep the result when you finish.",
    actions: [
      { label: "Open Flash Meet", href: "/?app=1", primary: true },
      { label: "Extension guide", href: "/extension" },
    ],
    sections: [
      {
        title: "Four basic steps",
        cards: [
          {
            badge: "01",
            title: "Open the app",
            text: "Go to Flash Meet in your browser. Start in the web app, or use the extension if you need to translate the audio of a tab.",
          },
          {
            badge: "02",
            title: "Choose the languages",
            text: "Pick the language being spoken and the one you want to read. In Conference Mode you also choose how many languages to show.",
          },
          {
            badge: "03",
            title: "Choose the audio source & start",
            text: "Use the microphone for a conversation in the room; for video or a meeting in the browser, use the extension or share the computer audio where that is supported.",
          },
          {
            badge: "04",
            title: "Finish & read the result",
            text: "Stop the session to see the transcript, the summary and the action items; while signed in, what applies can be kept in your history.",
          },
        ],
      },
      {
        title: "What are you trying to do?",
        cards: [
          {
            title: "Translate Google Meet / Zoom / Teams",
            text: "Install the extension to take the tab's audio and show the captions right in the browser.",
            href: "/extension",
            cta: "See how to install it",
          },
          {
            title: "Show the translation to a whole room",
            text: "Use Conference Mode to lay the captions over the projected screen and let the audience scan a QR code.",
            href: "/conference-mode",
            cta: "Open Conference Mode",
          },
          {
            title: "Manage the plan & minutes",
            text: "See the Free, Pro, Business and Enterprise plans and the limits that come with them.",
            href: "/pricing",
            cta: "See pricing",
          },
        ],
      },
    ],
  },

  faq: {
    eyebrow: "RESOURCES · FAQ",
    title: "Frequently asked questions",
    lead:
      "Short answers about how Flash Meet works, the languages, your data, and using it in an online meeting.",
    sections: [
      {
        title: "Using it",
        cards: [
          {
            title: "Does Flash Meet work with Google Meet, Zoom and Teams?",
            text: "Yes. The browser extension is built for meetings and web content such as Google Meet, Zoom, Microsoft Teams and YouTube.",
          },
          {
            title: "Do I have to install a desktop app?",
            text: "No. Flash Meet runs on the web; for tab audio and captions laid over the page itself, use the browser extension.",
          },
          {
            title: "Are Vietnamese, English and Korean supported?",
            text: "Yes — those are the product's core languages, and more languages are available depending on the mode.",
          },
          {
            title: "Does it summarise after the meeting?",
            text: "Yes. Once there is a transcript, Flash Meet can produce a summary, the decisions and the action items with AI.",
          },
          {
            title: "Can I use it for a conference or a projected screen?",
            text: "Yes. Conference Mode has caption layouts for a projector, a floating window, and viewers joining by QR code or link.",
            href: "/conference-mode",
            cta: "See Conference Mode",
          },
          {
            title: "Is there a free version?",
            text: "Yes. The pricing page shows the current Free limits alongside the paid plans.",
            href: "/pricing",
            cta: "See pricing",
          },
        ],
      },
      {
        title: "Data & privacy",
        cards: [
          {
            title: "Do I need permission before recording?",
            text: "You are responsible for the recording and privacy rules where you use the service; tell people and ask for consent whenever the law requires it.",
            href: "/terms",
            cta: "Read the terms",
          },
          {
            title: "How does Flash Meet handle data?",
            text: "The privacy policy describes what is processed, which providers are involved, how long it is kept and what rights you have.",
            href: "/privacy",
            cta: "Read the privacy policy",
          },
        ],
      },
    ],
  },

  docs: {
    eyebrow: "RESOURCES · DOCS",
    title: "The Flash Meet documentation hub",
    lead:
      "Go straight to what you need: getting started, the browser extension, conferences, pricing and the policies.",
    sections: [
      {
        title: "Product documentation",
        cards: [
          {
            title: "Quick start",
            text: "The four steps from opening the app to reading the post-meeting result.",
            href: "/guide",
            cta: "Read the guide",
          },
          {
            title: "Browser extension",
            text: "How to install and use Flash Meet with Google Meet, Zoom, Teams and YouTube.",
            href: "/extension",
            cta: "Open the docs",
          },
          {
            title: "Conference Mode",
            text: "The caption display mode for conferences, meeting rooms and large screens.",
            href: "/conference-mode",
            cta: "Open the mode",
          },
          {
            title: "FAQ",
            text: "Common questions about languages, devices, data and everyday use.",
            href: "/faq",
            cta: "See the FAQ",
          },
        ],
      },
      {
        title: "Account & policies",
        cards: [
          {
            title: "Pricing",
            text: "The limits and what each plan includes.",
            href: "/pricing",
            cta: "See pricing",
          },
          {
            title: "Privacy policy",
            text: "How data and privacy are handled.",
            href: "/privacy",
            cta: "Read the policy",
          },
          {
            title: "Terms of use",
            text: "The conditions of use, recording responsibilities and the limits of the service.",
            href: "/terms",
            cta: "Read the terms",
          },
        ],
      },
    ],
  },

  videos: {
    eyebrow: "RESOURCES · VIDEO",
    title: "Flash Meet video guides",
    lead:
      "The video library is still being filled. In the meantime every important flow has a written guide you can follow right away.",
    sections: [
      {
        title: "What the guides cover",
        cards: [
          {
            title: "Starting a translation session",
            text: "How to choose the languages and the audio source, and start a session in Flash Meet.",
            href: "/guide",
            cta: "Read the guide",
          },
          {
            title: "Translating Google Meet / Zoom / video",
            text: "How to install and use the extension to translate the audio of a browser tab.",
            href: "/extension",
            cta: "See the extension",
          },
          {
            title: "Presenting with Conference Mode",
            text: "How to put captions on the projected screen, choose a layout and share the QR code with the audience.",
            href: "/conference-mode",
            cta: "Open Conference Mode",
          },
        ],
      },
    ],
    note:
      "Once the official video guides exist, this page will collect the newest ones rather than point at unverified links.",
  },

  about: {
    eyebrow: "COMPANY · ABOUT US",
    title: "Flash Meet narrows the gap in multilingual conversations",
    lead:
      "Flash Meet is a TransFlash solution focused on live translation and AI for meetings, conferences and spoken content.",
    sections: [
      {
        title: "What we are solving",
        cards: [
          {
            title: "Understanding each other while speaking",
            text: "Language should not keep interrupting a meeting with questions, repetitions and translations that arrive afterwards.",
          },
          {
            title: "Losing nothing once the call ends",
            text: "The transcript, summary, decisions and action items keep the knowledge from disappearing when the meeting stops.",
          },
          {
            title: "Working with the tools you have",
            text: "The aim is to add translation and AI to the workflow you already use, not to make you change how you meet.",
          },
        ],
      },
      {
        title: "Product principles",
        bullets: [
          "Easy to begin: the web and the browser come first.",
          "Clear: captions and summaries should make things quicker to grasp, not add noise.",
          "Respectful of data: privacy and consent to record are part of how the product is meant to be used.",
          "Multilingual in practice: built around the conversations people really have at work.",
        ],
      },
    ],
  },

  careers: {
    eyebrow: "COMPANY · CAREERS",
    title: "Help build a tool that makes people understandable to each other",
    lead:
      "Flash Meet sits where speech AI, translation, the meeting experience and business workflow meet.",
    actions: [
      {
        label: "Send your CV",
        href: "mailto:support@transflash.app?subject=%5BCareer%5D%20Flash%20Meet",
        primary: true,
      },
      { label: "Learn about the product", href: "/features" },
    ],
    sections: [
      {
        title: "Skills that fit",
        cards: [
          {
            title: "Engineering / AI",
            text: "Realtime audio, speech-to-text, translation, web performance, reliability and AI integration.",
          },
          {
            title: "Product / Design",
            text: "Designing a low-friction experience for in-person meetings, online calls and conference screens.",
          },
          {
            title: "Growth / Partnerships",
            text: "Bringing the product to teams and companies with a real multilingual communication need.",
          },
        ],
      },
    ],
    note:
      "Specific openings are posted as they come up. You are welcome to send your CV or introduce yourself at support@transflash.app with the subject [Career] Flash Meet.",
  },

  contact: {
    eyebrow: "COMPANY · CONTACT",
    title: "Contact Flash Meet",
    lead:
      "Pick the right subject and the team can handle it faster: product support, billing, business partnerships or a data question.",
    actions: [
      {
        label: "Email support@transflash.app",
        href: "mailto:support@transflash.app",
        primary: true,
      },
      { label: "See the FAQ", href: "/faq" },
    ],
    sections: [
      {
        title: "What do you need?",
        cards: [
          {
            title: "Product support",
            text: "Trouble with translation, the microphone, the extension, Conference Mode or anything else in use.",
            href: "mailto:support@transflash.app?subject=%5BSupport%5D%20Flash%20Meet",
            cta: "Send an email",
          },
          {
            title: "Plans & billing",
            text: "Questions about Free, Pro, Business and Enterprise, the limits, or changing plan.",
            href: "mailto:support@transflash.app?subject=%5BBilling%5D%20Flash%20Meet",
            cta: "Get in touch",
          },
          {
            title: "Business & partnerships",
            text: "Rolling it out for a team, an event or a conference, or working together on the product.",
            href: "mailto:support@transflash.app?subject=%5BBusiness%5D%20Flash%20Meet",
            cta: "Talk to us",
          },
          {
            title: "Privacy",
            text: "Requests about personal data, access to it or its deletion.",
            href: "mailto:support@transflash.app?subject=%5BPrivacy%5D%20Flash%20Meet",
            cta: "Send a request",
          },
        ],
      },
    ],
  },
};
