// Silences the harmless /favicon.ico 404 in dev by returning an empty 204.
export function GET() {
  return new Response(null, { status: 204 });
}
