import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingHeader from "../../LandingHeader";
import { POSTS, getPost, BLOG_LABELS, type PostLang } from "@/lib/posts";

const SITE = "https://meet.transflash.app";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      locale: post.lang === "vi" ? "vi_VN" : post.lang === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const lang = post.lang as PostLang;
  const L = BLOG_LABELS[lang];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        inLanguage: lang,
        datePublished: post.date,
        dateModified: post.date,
        author: { "@type": "Organization", name: "TransFlash", url: "https://transflash.app" },
        publisher: { "@type": "Organization", name: "TransFlash", logo: { "@type": "ImageObject", url: `${SITE}/email-logo.png` } },
        mainEntityOfPage: `${SITE}/blog/${post.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE}/blog` },
          { "@type": "ListItem", position: 2, name: post.title, item: `${SITE}/blog/${post.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style dangerouslySetInnerHTML={{ __html: POST_CSS }} />
      <LandingHeader lang="en" />
      <main className="post-wrap">
        <a href="/blog" className="post-back">{L.back}</a>
        <h1 className="post-h1">{post.title}</h1>
        <div className="post-date">{post.date}</div>
        <article className="post-body" dangerouslySetInnerHTML={{ __html: post.body }} />
      </main>
    </>
  );
}

const POST_CSS = `
.post-wrap{max-width:720px;margin:0 auto;padding:34px 20px 72px;font-family:'Inter',system-ui,-apple-system,sans-serif;color:#0a1124}
.post-back{display:inline-block;font-size:13px;font-weight:700;color:#1f6bff;text-decoration:none;margin-bottom:18px}
.post-h1{font-size:30px;font-weight:900;letter-spacing:-.03em;line-height:1.2;margin:0 0 8px}
.post-date{font-size:13px;color:#9aa6bd;font-weight:700;margin-bottom:26px}
.post-body h2{font-size:20px;font-weight:900;letter-spacing:-.02em;margin:30px 0 12px}
.post-body p{font-size:16px;color:#2b3850;line-height:1.7;margin:0 0 15px}
.post-body ul{margin:0 0 16px;padding-left:22px}
.post-body li{font-size:16px;color:#2b3850;line-height:1.7;margin:4px 0}
.post-body strong{color:#0a1124;font-weight:800}
.post-body a{color:#1f6bff;font-weight:700;text-decoration:none}
.post-body a:hover{text-decoration:underline}
`;
