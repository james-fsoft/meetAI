import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chrome Extension — TransFlash Live Translate",
  description:
    "Install the TransFlash Live Translate Chrome extension to translate Google Meet, Zoom, Microsoft Teams and YouTube live, with bilingual subtitles and AI meeting summaries.",
  alternates: { canonical: "/extension" },
  openGraph: {
    title: "TransFlash Live Translate — Chrome extension for live meeting translation",
    description:
      "Translate any meeting or video live with bilingual subtitles, right inside Chrome. Google Meet, Zoom, Teams, YouTube and in-person mode.",
    url: "https://meet.transflash.app/extension",
  },
};

export default function ExtensionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
