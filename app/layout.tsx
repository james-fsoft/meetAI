import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meeting AI",
  description: "Record meetings, separate speakers, translate live, and get summaries.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
