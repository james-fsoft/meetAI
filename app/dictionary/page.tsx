import type { Metadata } from "next";
import DictionaryClient from "./DictionaryClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dictionary — terms & proper nouns",
  robots: { index: false, follow: false },
};

// Personal dictionary: names, companies, products and jargon that Flash Meet
// should get right. Entries are kept on the device and, for signed-in users,
// synced to public.glossary_terms; the live engines read them through
// /api/glossary (cloud) and localStorage (this device).
export default function DictionaryPage() {
  return <DictionaryClient />;
}
