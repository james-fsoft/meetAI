import type { MetadataRoute } from "next";

// PWA manifest — improves mobile install, Lighthouse SEO score and discovery.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flash Meet — Live meeting translation & AI summaries",
    short_name: "Flash Meet",
    description:
      "Translate meetings live with bilingual subtitles and get automatic AI summaries, action items and minutes. Works with Google Meet, Zoom, Teams and YouTube.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1f6bff",
    categories: ["productivity", "business", "utilities"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
