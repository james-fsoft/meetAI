import { ImageResponse } from "next/og";

// English social-share image, generated on the edge. Replaces the old
// Vietnamese static og.png and is inherited by every page.
export const runtime = "edge";
export const alt = "Flash Meet — Live meeting translation & AI summaries";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg,#1f6bff,#1148c9)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(255,255,255,.16)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 32 }}>
              <div style={{ width: 7, height: 16, background: "#fff", borderRadius: 4 }} />
              <div style={{ width: 7, height: 30, background: "#fff", borderRadius: 4 }} />
              <div style={{ width: 7, height: 24, background: "#fff", borderRadius: 4 }} />
              <div style={{ width: 7, height: 12, background: "#fff", borderRadius: 4 }} />
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 800, color: "#fff" }}>Flash Meet</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.08,
              letterSpacing: -2,
            }}
          >
            Live meeting translation & AI summaries
          </div>
          <div style={{ display: "flex", fontSize: 29, color: "rgba(255,255,255,.85)", lineHeight: 1.3 }}>
            Bilingual subtitles for Google Meet, Zoom & Teams — speaker split, automatic minutes.
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
            {["Real-time", "Speaker split", "AI summary"].map((x) => (
              <div
                key={x}
                style={{
                  display: "flex",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#fff",
                  background: "rgba(255,255,255,.18)",
                  border: "1px solid rgba(255,255,255,.32)",
                  borderRadius: 30,
                  padding: "10px 22px",
                }}
              >
                {x}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,.82)", fontWeight: 600 }}>
          meet.transflash.app
        </div>
      </div>
    ),
    { ...size }
  );
}
