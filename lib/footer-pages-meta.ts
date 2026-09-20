import type { Metadata } from "next";
import { FP_SLUGS, fpPath, getPage, resolveSlug, type FpLang } from "./footer-pages";

const SITE = "https://meet.transflash.app";

export function fpStaticParams() {
  return FP_SLUGS.map((slug) => ({ slug }));
}

/** Title, description and the hreflang set that ties the three languages together. */
export function fpMetadata(lang: FpLang, rawSlug: string): Metadata {
  const slug = resolveSlug(rawSlug);
  const page = getPage(lang, slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.lead,
    alternates: {
      canonical: fpPath(lang, slug),
      languages: {
        vi: fpPath("vi", slug),
        en: fpPath("en", slug),
        ko: fpPath("ko", slug),
        "x-default": fpPath("vi", slug),
      },
    },
    openGraph: {
      title: page.title + " — Flash Meet",
      description: page.lead,
      url: SITE + fpPath(lang, slug),
      type: "website",
      locale: lang === "vi" ? "vi_VN" : lang === "ko" ? "ko_KR" : "en_US",
    },
  };
}
