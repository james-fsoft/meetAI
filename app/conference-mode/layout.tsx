import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flash Meet Conference Mode",
  description: "Hidden large-screen multilingual conference display mode.",
  robots: { index: false, follow: false },
};

export default function ConferenceModeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
