import type { Metadata } from "next";
import FooterPageView from "../FooterPageView";
import { fpMetadata, fpStaticParams } from "@/lib/footer-pages-meta";

/** Vietnamese lives at the bare path: /features, /faq, /docs … */
export function generateStaticParams() {
  return fpStaticParams();
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return fpMetadata("vi", params.slug);
}

export default function FooterPage({ params }: { params: { slug: string } }) {
  return <FooterPageView lang="vi" slug={params.slug} />;
}
