import type { Metadata } from "next";
import LandingHeader from "../LandingHeader";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — Live meeting translation guides",
  description:
    "Guides and how-tos for translating Zoom, Google Meet and Microsoft Teams meetings live, with bilingual subtitles and automatic AI summaries.",
  alternates: { canonical: "/blog" },
};

const LANG_TAG: Record<string, string> = { en: "EN", vi: "VI", ko: "KO" };

export default function BlogIndex() {
  const posts = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <>
      <LandingHeader lang="en" />
      <main style={S.wrap}>
        <h1 style={S.h1}>Flash Meet Blog</h1>
        <p style={S.sub}>Guides for live meeting translation, AI summaries and minutes.</p>
        <div style={S.list}>
          {posts.map((p) => (
            <a key={p.slug} href={`/blog/${p.slug}`} style={S.card}>
              <div style={S.meta}><span style={S.tag}>{LANG_TAG[p.lang]}</span><span style={S.date}>{p.date}</span></div>
              <h2 style={S.title}>{p.title}</h2>
              <p style={S.desc}>{p.description}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

const FONT = "'Inter',system-ui,-apple-system,sans-serif";
const S: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 820, margin: "0 auto", padding: "40px 20px 70px", fontFamily: FONT, color: "#0a1124" },
  h1: { fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", margin: "0 0 6px" },
  sub: { fontSize: 15.5, color: "#5b6b8c", margin: "0 0 28px" },
  list: { display: "grid", gap: 14 },
  card: { display: "block", background: "#fff", border: "1px solid #e7ebf3", borderRadius: 16, padding: "18px 20px", textDecoration: "none", color: "inherit", boxShadow: "0 12px 30px -26px rgba(10,17,36,.5)" },
  meta: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  tag: { fontSize: 11, fontWeight: 800, color: "#1f4fff", background: "#eef4ff", border: "1px solid #d3e0fb", borderRadius: 6, padding: "2px 7px", letterSpacing: ".03em" },
  date: { fontSize: 12, color: "#9aa6bd", fontWeight: 700 },
  title: { fontSize: 18.5, fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 6px", lineHeight: 1.3 },
  desc: { fontSize: 14.5, color: "#48566f", lineHeight: 1.55, margin: 0 },
};
