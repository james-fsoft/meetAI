import type { Metadata } from "next";
import FooterPageView from "../../(footer-pages)/FooterPageView";
import { fpMetadata, fpStaticParams } from "@/lib/footer-pages-meta";

/** English copies of the footer pages: /en/features, /en/faq … */
export function generateStaticParams() {
  return fpStaticParams();
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return fpMetadata("en", params.slug);
}

export default function FooterPageEN({ params }: { params: { slug: string } }) {
  return <FooterPageView lang="en" slug={params.slug} />;
}
