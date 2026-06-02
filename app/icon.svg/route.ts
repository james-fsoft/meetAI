// Brand favicon: speech bubble + sound wave on brand blue, rounded app-icon style.
export function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#1f6bff"/>
  <path d="M30 22 H74 a13 13 0 0 1 13 13 V61 a13 13 0 0 1 -13 13 H52 l-16 14 v-14 H30 a13 13 0 0 1 -13 -13 V35 A13 13 0 0 1 30 22 Z" fill="#fff"/>
  <g fill="#1f6bff">
    <rect x="33" y="46" width="6" height="10" rx="3"/>
    <rect x="44" y="39" width="6" height="24" rx="3"/>
    <rect x="55" y="34" width="6" height="34" rx="3"/>
    <rect x="66" y="42" width="6" height="18" rx="3"/>
  </g>
</svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" } });
}
