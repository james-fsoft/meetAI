import type { Metadata } from "next";

// Standalone preview of a redesigned homepage. Kept out of search until it
// replaces the live home page.
export const metadata: Metadata = {
  title: "Homepage preview",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
