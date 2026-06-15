import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/posts";

const BASE = "https://meet.transflash.app";

// Public, indexable pages. Helps search engines discover everything quickly.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const home = {
    en: `${BASE}/`,
    languages: { en: `${BASE}/`, vi: `${BASE}/vi`, ko: `${BASE}/ko` },
  };
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1, alternates: { languages: home.languages } },
    { url: `${BASE}/vi`, lastModified: now, changeFrequency: "weekly", priority: 0.9, alternates: { languages: home.languages } },
    { url: `${BASE}/ko`, lastModified: now, changeFrequency: "weekly", priority: 0.9, alternates: { languages: home.languages } },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/extension`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...POSTS.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
