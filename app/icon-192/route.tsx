import { ImageResponse } from "next/og";

export const runtime = "edge";

// Maskable PWA icon: full-bleed brand blue with the Flash Meet waveform centered
// (safe-zone padding so it survives circular masking on Android).
export function GET() {
  const S = 192, w = Math.round(S * 0.082);
  const bars = [0.2, 0.46, 0.64, 0.34];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: Math.round(S * 0.058), background: "#1f6bff" }}>
        {bars.map((h, i) => (
          <div key={i} style={{ width: w, height: Math.round(S * h), background: "#fff", borderRadius: w }} />
        ))}
      </div>
    ),
    { width: S, height: S }
  );
}
