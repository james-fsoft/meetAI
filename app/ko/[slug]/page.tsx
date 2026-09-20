import type { Metadata } from "next";
import FooterPageView from "../../(footer-pages)/FooterPageView";
import { fpMetadata, fpStaticParams } from "@/lib/footer-pages-meta";

/** Korean copies of the footer pages: /ko/features, /ko/faq … */
export function generateStaticParams() {
  return fpStaticParams();
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return fpMetadata("ko", params.slug);
}

export default function FooterPageKO({ params }: { params: { slug: string } }) {
  return <FooterPageView lang="ko" slug={params.slug} />;
}
