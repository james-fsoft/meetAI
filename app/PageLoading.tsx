// Skeleton shown instantly (streamed before the server finishes its Supabase
// calls) for the signed-in pages. No text: the UI language lives in localStorage.
export default function PageLoading({ variant }: { variant: "account" | "calendar" }) {
  return (
    <div className="pl" aria-busy="true">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pl-bar">
        <span className="pl-logo" />
        <span className="pl-sp" />
        <span className="pl-sk" style={{ width: 120, height: 28, borderRadius: 20 }} />
        <span className="pl-sk" style={{ width: 110, height: 32, borderRadius: 9 }} />
      </div>
      <div className="pl-wrap" style={{ maxWidth: variant === "calendar" ? 1280 : 720 }}>
        <div className="pl-head">
          <span className="pl-sk" style={{ width: 220, height: 30 }} />
          <span className="pl-spin" />
        </div>
        <span className="pl-sk" style={{ width: 320, maxWidth: "80%", height: 14, marginBottom: 22 }} />
        {variant === "calendar" ? (
          <div className="pl-cal">{Array.from({ length: 35 }, (_, i) => <span key={i} className="pl-cell" />)}</div>
        ) : (
          <>
            <span className="pl-sk pl-card" style={{ height: 86 }} />
            <span className="pl-sk pl-card" style={{ height: 104 }} />
            <span className="pl-sk pl-card" style={{ height: 180 }} />
          </>
        )}
      </div>
    </div>
  );
}

const CSS = `
.pl{min-height:100vh;background:#f6f8fc;font-family:'Inter',system-ui,sans-serif}
.pl-bar{display:flex;align-items:center;gap:10px;padding:10px 20px;background:#fff;border-bottom:1px solid #e3e8f2}
.pl-logo{width:24px;height:24px;border-radius:7px;background:#1f6bff}
.pl-sp{flex:1}
.pl-wrap{margin:0 auto;padding:24px 20px}
.pl-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.pl-sk{display:block;border-radius:10px;background:linear-gradient(90deg,#e9edf5 0%,#f4f6fb 50%,#e9edf5 100%);background-size:200% 100%;animation:plsh 1.1s ease-in-out infinite}
.pl-card{width:100%;border-radius:16px;margin-bottom:14px}
.pl-cal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:1px;background:#e3e8f2;border:1px solid #e3e8f2;border-radius:14px;overflow:hidden}
.pl-cell{height:96px;background:#fff}
.pl-spin{width:22px;height:22px;border:2.5px solid #d6e0f3;border-top-color:#1f6bff;border-radius:50%;animation:plspin .7s linear infinite}
@keyframes plsh{0%{background-position:100% 0}100%{background-position:-100% 0}}
@keyframes plspin{to{transform:rotate(360deg)}}
@media(max-width:700px){.pl-cell{height:64px}.pl-wrap{padding:16px 12px}}
`;
