import type { MetadataRoute } from "next";

// PWA manifest — improves mobile install, Lighthouse SEO score and discovery.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flash Meet — Live meeting translation & AI summaries",
    short_name: "Flash Meet",
    description:
      "Translate meetings live with bilingual subtitles and get automatic AI summaries, action items and minutes. Works with Google Meet, Zoom, Teams and YouTube.",
    start_url: "/?utm_source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#050b1f",
    theme_color: "#1f6bff",
    lang: "vi",
    categories: ["productivity", "business", "utilities"],
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
