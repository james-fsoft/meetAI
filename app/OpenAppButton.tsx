"use client";

// Opens the app at "/" in the chosen language by setting the shared lang key
// (read by both the shell and the meeting.html iframe) before navigating.
export default function OpenAppButton({
  lang, label, style,
}: { lang: "en" | "vi" | "ko"; label: string; style?: React.CSSProperties }) {
  return (
    <a
      href="/"
      style={style}
      onClick={() => { try { localStorage.setItem("mr_lang", lang); } catch {} }}
    >
      {label}
    </a>
  );
}
