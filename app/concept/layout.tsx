import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meetflash Concept — Premium Landing",
  description: "Standalone homepage concept for Meetflash.",
  robots: { index: false, follow: false },
};

export default function ConceptLayout({ children }: { children: React.ReactNode }) {
  return children;
}
