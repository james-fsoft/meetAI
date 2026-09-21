import { notFound } from "next/navigation";
import {
  FOOTER,
  FP_LANGS,
  FP_UI,
  LANG_LABEL,
  fpPath,
  getPage,
  localHref,
  resolveSlug,
  type FpLang,
} from "@/lib/footer-pages";

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="fp-logo">
      <svg viewBox="0 0 100 100" width={compact ? 27 : 31} height={compact ? 27 : 31} aria-hidden="true">
        <path
          d="M22 8 H78 a16 16 0 0 1 16 16 V60 a16 16 0 0 1 -16 16 H50 l-20 18 v-18 H22 a16 16 0 0 1 -16 -16 V24 A16 16 0 0 1 22 8 Z"
          fill="#1f6bff"
        />
        <g fill="#fff">
          <rect x="26" y="38" width="7.5" height="12" rx="3.75" />
          <rect x="39" y="29" width="7.5" height="30" rx="3.75" />
          <rect x="52" y="22" width="7.5" height="44" rx="3.75" />
          <rect x="65" y="32" width="7.5" height="24" rx="3.75" />
        </g>
      </svg>
      <span>Flash Meet</span>
    </span>
  );
}

function FooterColumn({
  title,
  links,
  lang,
}: {
  title: string;
  links: readonly (readonly [string, string])[];
  lang: FpLang;
}) {
  return (
    <div className="fp-footer-col">
      <h3>{title}</h3>
      <nav aria-label={title}>
        {links.map(([label, href]) => (
          <a key={href} href={localHref(lang, href)}>
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}

function Footer({ lang, slug }: { lang: FpLang; slug: string }) {
  const ui = FP_UI[lang];
  const cols = FOOTER[lang];
  return (
    <footer className="fp-footer">
      <div className="fp-footer-grid">
        <div className="fp-brand-col">
          <a href="/" className="fp-footer-brand" aria-label="Flash Meet">
            <Logo />
          </a>
          <p>{ui.tagline}</p>
          <div className="fp-social" aria-label={ui.socialAria}>
            <span title="LinkedIn">in</span>
            <span title="YouTube">▶</span>
            <span title="Facebook">f</span>
            <span title="X">𝕏</span>
          </div>
          <small>{ui.copyright}</small>
        </div>

        <FooterColumn title={ui.colProduct} links={cols.product} lang={lang} />
        <FooterColumn title={ui.colResources} links={cols.resources} lang={lang} />
        <FooterColumn title={ui.colCompany} links={cols.company} lang={lang} />

        <div className="fp-news">
          <h3>{ui.newsTitle}</h3>
          <form
            action="mailto:support@transflash.app"
            method="post"
            encType="text/plain"
          >
            <div className="fp-news-row">
              <input type="email" name="email" placeholder={ui.newsPlaceholder} required />
              <button type="submit" aria-label={ui.newsBtnAria}>→</button>
            </div>
            <label>
              <input type="checkbox" name="consent" value="yes" required />
              <span>{ui.newsConsent}</span>
            </label>
          </form>

          {/* The same page in the other two languages — this used to be a label that did nothing. */}
          <nav className="fp-lang" aria-label={ui.langAria}>
            <span aria-hidden="true">◎</span>
            {FP_LANGS.map((l) => (
              <a
                key={l}
                href={fpPath(l, slug)}
                hrefLang={l}
                className={l === lang ? "on" : undefined}
                aria-current={l === lang ? "true" : undefined}
              >
                {LANG_LABEL[l]}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default function FooterPageView({ lang, slug }: { lang: FpLang; slug: string }) {
  const key = resolveSlug(slug);
  const page = getPage(lang, key);
  if (!page) notFound();
  const ui = FP_UI[lang];
  const L = (href: string) => localHref(lang, href);

  return (
    <div className="fp-page" lang={ui.htmlLang}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="fp-header">
        <a href="/" className="fp-head-brand" aria-label={ui.homeAria}>
          <Logo compact />
        </a>
        <nav className="fp-head-nav" aria-label={ui.navAria}>
          {ui.nav.map(([label, href]) => (
            <a key={href} href={L(href)}>
              {label}
            </a>
          ))}
        </nav>
        <a className="fp-open" href="/?app=1">
          {ui.openApp}
        </a>
      </header>

      <main>
        <section className="fp-hero">
          <div className="fp-hero-inner">
            <div className="fp-eyebrow">{page.eyebrow}</div>
            <h1>{page.title}</h1>
            <p>{page.lead}</p>
            {page.actions && (
              <div className="fp-actions">
                {page.actions.map((action) => (
                  <a
                    key={action.href + action.label}
                    href={L(action.href)}
                    className={action.primary ? "fp-btn fp-btn-primary" : "fp-btn"}
                  >
                    {action.label}
                    <span aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="fp-main">
          {page.sections.map((section) => (
            <section className="fp-section" key={section.title}>
              <div className="fp-section-head">
                <h2>{section.title}</h2>
                {section.intro && <p>{section.intro}</p>}
              </div>

              {section.cards && (
                <div className="fp-card-grid">
                  {section.cards.map((card) => (
                    <article className={card.img ? "fp-card fp-card-photo" : "fp-card"} key={card.title}>
                      {card.img && <img className="fp-card-img" src={card.img} alt="" loading="lazy" />}
                      {card.badge && <div className="fp-badge">{card.badge}</div>}
                      <h3>{card.title}</h3>
                      <p>{card.text}</p>
                      {card.href && (
                        <a href={L(card.href)} className="fp-card-link">
                          {card.cta || ui.learnMore} <span aria-hidden="true">→</span>
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              )}

              {section.bullets && (
                <div className="fp-bullets">
                  {section.bullets.map((item) => (
                    <div key={item} className="fp-bullet">
                      <span aria-hidden="true">✓</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {page.note && <aside className="fp-note">{page.note}</aside>}

          <section className="fp-bottom-cta">
            <div>
              <span>{ui.ctaKicker}</span>
              <h2>{ui.ctaTitle}</h2>
              <p>{ui.ctaText}</p>
            </div>
            <div className="fp-bottom-actions">
              <a href="/?app=1" className="fp-btn fp-btn-primary">{ui.ctaPrimary}</a>
              <a href={L("/guide")} className="fp-btn">{ui.ctaSecondary}</a>
            </div>
          </section>
        </div>
      </main>

      <Footer lang={lang} slug={key} />
    </div>
  );
}

const CSS = `
:root{--fp-ink:#0b1631;--fp-muted:#64708a;--fp-blue:#1468ff;--fp-line:#e5eaf3;--fp-soft:#f6f9fd}
.fp-page{min-height:100vh;background:#fff;color:var(--fp-ink);font-family:'Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;letter-spacing:-.015em}
.fp-page *{box-sizing:border-box}
.fp-header{height:68px;display:flex;align-items:center;gap:28px;padding:0 32px;border-bottom:1px solid #edf0f5;background:rgba(255,255,255,.94);backdrop-filter:blur(12px);position:sticky;top:0;z-index:20}
.fp-head-brand,.fp-footer-brand{text-decoration:none;color:inherit}
.fp-logo{display:inline-flex;align-items:center;gap:9px;font-size:18px;font-weight:900;letter-spacing:-.035em;white-space:nowrap}
.fp-head-nav{display:flex;align-items:center;gap:23px;margin-left:auto}
.fp-head-nav a{font-size:13px;font-weight:700;color:#63708a;text-decoration:none;transition:.16s}
.fp-head-nav a:hover{color:var(--fp-blue)}
.fp-open{font-size:13px;font-weight:800;color:#fff;background:var(--fp-blue);text-decoration:none;padding:10px 16px;border-radius:10px;box-shadow:0 8px 20px -12px rgba(20,104,255,.8)}
.fp-hero{position:relative;overflow:hidden;border-bottom:1px solid #eef2f7;background:
radial-gradient(700px 360px at 18% 0%,rgba(20,104,255,.105),transparent 62%),
radial-gradient(620px 300px at 86% 10%,rgba(80,180,255,.09),transparent 62%),
linear-gradient(180deg,#fbfdff,#fff)}
.fp-hero-inner{max-width:1120px;margin:0 auto;padding:82px 28px 76px}
.fp-eyebrow{font-size:12px;font-weight:900;letter-spacing:.12em;color:var(--fp-blue);margin-bottom:18px}
.fp-hero h1{max-width:820px;font-size:clamp(38px,5.1vw,66px);line-height:1.035;letter-spacing:-.052em;margin:0;font-weight:900}
.fp-hero p{max-width:760px;margin:22px 0 0;color:#596781;font-size:18px;line-height:1.7}
.fp-actions{display:flex;flex-wrap:wrap;gap:11px;margin-top:30px}
.fp-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:44px;padding:0 18px;border:1px solid #dfe5ef;border-radius:11px;background:#fff;color:#17213b;text-decoration:none;font-size:13.5px;font-weight:800;transition:.16s}
.fp-btn:hover{border-color:#b9cbed;transform:translateY(-1px);box-shadow:0 10px 22px -18px rgba(20,41,90,.55)}
.fp-btn-primary{background:linear-gradient(135deg,#1769ff,#3d83ff);border-color:transparent;color:#fff;box-shadow:0 12px 25px -15px rgba(20,104,255,.9)}
.fp-main{max-width:1120px;margin:0 auto;padding:62px 28px 76px}
.fp-section{margin-bottom:66px}
.fp-section-head{margin-bottom:22px;max-width:760px}
.fp-section-head h2{font-size:27px;line-height:1.2;letter-spacing:-.035em;margin:0;font-weight:900}
.fp-section-head p{font-size:15px;color:var(--fp-muted);line-height:1.65;margin:10px 0 0}
.fp-card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.fp-card{min-height:185px;border:1px solid var(--fp-line);border-radius:18px;padding:22px;background:linear-gradient(180deg,#fff,#fbfdff);box-shadow:0 16px 34px -32px rgba(20,41,90,.6);transition:.18s}
.fp-card:hover{border-color:#cbd8ec;transform:translateY(-2px);box-shadow:0 22px 42px -31px rgba(20,70,160,.42)}
.fp-badge{display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:25px;padding:0 9px;border-radius:20px;background:#eef4ff;color:#1c62d5;font-size:10.5px;font-weight:900;letter-spacing:.06em;margin-bottom:13px}
.fp-card h3{font-size:17px;line-height:1.3;margin:0 0 9px;letter-spacing:-.02em;font-weight:850}
.fp-card p{font-size:14px;color:#66728a;line-height:1.65;margin:0}
.fp-card-link{display:inline-flex;gap:7px;margin-top:16px;color:#1769ff;text-decoration:none;font-size:13px;font-weight:800}
.fp-bullets{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.fp-bullet{display:flex;align-items:flex-start;gap:11px;padding:15px 17px;border:1px solid var(--fp-line);border-radius:14px;background:#fbfdff}
.fp-bullet>span{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;flex:0 0 24px;background:#eaf2ff;color:#1769ff;font-size:12px;font-weight:900}
.fp-bullet p{font-size:14px;color:#596781;line-height:1.55;margin:1px 0 0}
.fp-note{margin:8px 0 58px;padding:18px 20px;border:1px solid #dce8fb;border-radius:14px;background:#f6f9ff;color:#52627f;font-size:13.5px;line-height:1.65}
.fp-bottom-cta{display:flex;align-items:center;justify-content:space-between;gap:30px;padding:32px 34px;border-radius:22px;background:#0d1830;color:#fff;box-shadow:0 22px 50px -35px rgba(5,17,45,.75)}
.fp-bottom-cta>div:first-child{max-width:690px}
.fp-bottom-cta span{font-size:10.5px;font-weight:900;letter-spacing:.14em;color:#83b0ff}
.fp-bottom-cta h2{font-size:25px;line-height:1.25;letter-spacing:-.035em;margin:7px 0 7px}
.fp-bottom-cta p{font-size:13.5px;line-height:1.6;color:#aab7ce;margin:0}
.fp-bottom-actions{display:flex;flex-direction:column;gap:9px;flex:0 0 auto}
.fp-bottom-cta .fp-btn:not(.fp-btn-primary){background:transparent;border-color:#34445f;color:#dce6f7}
.fp-footer{border-top:1px solid #e7ebf2;background:#f8fbff;padding:40px 32px 28px}
.fp-footer-grid{max-width:1370px;margin:0 auto;display:grid;grid-template-columns:1.35fr .88fr 1fr 1.08fr 1.65fr;gap:34px;align-items:start}
.fp-brand-col p{font-size:13px;color:#68758e;margin:8px 0 16px}
.fp-social{display:flex;align-items:center;gap:19px;margin:8px 0 22px;color:#1f2c47}
.fp-social span{display:inline-flex;align-items:center;justify-content:center;height:24px;min-width:20px;font-size:14px;font-weight:900}
.fp-brand-col small{font-size:11.5px;color:#75819a}
.fp-footer-col h3,.fp-news h3{font-size:13px;color:#10192d;margin:0 0 10px;font-weight:900}
.fp-footer-col nav{display:flex;flex-direction:column;gap:7px}
.fp-footer-col a{font-size:12.5px;color:#68758e;text-decoration:none;line-height:1.25}
.fp-footer-col a:hover{color:#1769ff}
.fp-news{min-width:0}
.fp-news-row{display:flex;width:100%;height:42px}
.fp-news-row input{min-width:0;flex:1;border:1px solid #d9e0ec;border-right:none;border-radius:8px 0 0 8px;background:#fff;padding:0 13px;font:inherit;font-size:12.5px;color:#17213b;outline:none}
.fp-news-row input:focus{border-color:#9dbcf5}
.fp-news-row button{width:45px;border:none;border-radius:0 8px 8px 0;background:#0f67f8;color:#fff;font-size:21px;cursor:pointer}
.fp-news label{display:flex;align-items:flex-start;gap:8px;margin-top:9px;font-size:11.5px;color:#6d7890;line-height:1.35}
.fp-news label input{margin-top:2px}
.fp-lang{margin-top:24px;text-align:right;font-size:12px;font-weight:700;color:#34425e}
@media(max-width:960px){
  .fp-head-nav{display:none}
  .fp-footer-grid{grid-template-columns:1.2fr 1fr 1fr;gap:32px}
  .fp-news{grid-column:2/4}
  .fp-card-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .fp-bottom-cta{align-items:flex-start;flex-direction:column}
  .fp-bottom-actions{flex-direction:row}
}
@media(max-width:640px){
  .fp-header{height:60px;padding:0 16px}
  .fp-logo{font-size:16px}
  .fp-open{padding:8px 12px;font-size:12px}
  .fp-hero-inner{padding:52px 18px 50px}
  .fp-hero h1{font-size:39px}
  .fp-hero p{font-size:16px;line-height:1.6}
  .fp-main{padding:42px 18px 56px}
  .fp-section{margin-bottom:48px}
  .fp-section-head h2{font-size:23px}
  .fp-card-grid,.fp-bullets{grid-template-columns:1fr}
  .fp-card{min-height:0;padding:19px}
  .fp-bottom-cta{padding:26px 21px}
  .fp-bottom-actions{width:100%;flex-direction:column}
  .fp-footer{padding:34px 20px 24px}
  .fp-footer-grid{grid-template-columns:1fr 1fr;gap:30px 22px}
  .fp-brand-col,.fp-news{grid-column:1/3}
  .fp-news{order:5}
  .fp-lang{text-align:left}
}

/* use-case style cards: a photo on top, the text below */
.fp-card-photo{padding:0;overflow:hidden;display:flex;flex-direction:column}
.fp-card-img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;background:#e9eff8}
.fp-card-photo h3{margin:16px 20px 8px}
.fp-card-photo p{margin:0 20px}
.fp-card-photo .fp-card-link{margin:14px 20px 18px}
.fp-lang{margin-top:24px;display:flex;flex-wrap:wrap;align-items:center;gap:10px;justify-content:flex-end;font-size:12px;font-weight:700;color:#34425e}
.fp-lang a{color:#63708a;text-decoration:none;padding:3px 9px;border-radius:14px;border:1px solid transparent;transition:.14s}
.fp-lang a:hover{color:var(--fp-blue);border-color:#d7e2f5}
.fp-lang a.on{color:#17213b;background:#eef4ff;border-color:#d7e2f5}
`;
