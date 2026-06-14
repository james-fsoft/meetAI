import type { Metadata } from "next";
import "./globals.css";

const DESC = "Live meeting translation + AI summaries. Bilingual subtitles for Google Meet, Zoom & YouTube — speaker separation, automatic minutes.";
export const metadata: Metadata = {
  metadataBase: new URL("https://meet.transflash.app"),
  title: "Flash Meet — Live meeting translation & AI summaries",
  description: DESC,
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Flash Meet — Live meeting translation & AI summaries",
    description: DESC,
    url: "https://meet.transflash.app",
    siteName: "Flash Meet",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flash Meet — Live meeting translation & AI summaries",
    description: DESC,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
