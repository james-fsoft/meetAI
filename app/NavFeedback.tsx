"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Instant feedback for anything that navigates: a thin progress bar at the top of
 * the window plus a spinner on the clicked link, shown the moment you click — so
 * a slow server response never looks like "nothing happened".
 *
 * Triggers:
 *   - clicks on same-origin links (capture phase, before React/Link handlers)
 *   - postMessage {fm: "nav"} from the meeting iframe (its links open in the top window)
 *   - window events "fm:busy" / "fm:idle" for programmatic work (e.g. sign-out)
 * Any element can also opt into the spinner with the data-fm-busy attribute.
 * Styles live in globals.css (.fm-nprog, [data-fm-busy]) — an inline <style> in
 * the body breaks hydration on every page.
 */
export default function NavFeedback() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "run" | "end">("idle");
  const done = useRef<() => void>(() => {});

  useEffect(() => {
    let busyEl: HTMLElement | null = null;
    let safety: ReturnType<typeof setTimeout> | undefined;
    let endT: ReturnType<typeof setTimeout> | undefined;

    const clearBusy = () => { busyEl?.removeAttribute("data-fm-busy"); busyEl = null; };
    const finish = () => {
      clearTimeout(safety);
      clearBusy();
      setPhase((p) => (p === "run" ? "end" : p));
      clearTimeout(endT);
      endT = setTimeout(() => setPhase((p) => (p === "end" ? "idle" : p)), 450);
    };
    const start = (el: HTMLElement | null) => {
      clearBusy();
      if (el) { el.setAttribute("data-fm-busy", ""); busyEl = el; }
      clearTimeout(endT);
      setPhase("run");
      clearTimeout(safety);
      safety = setTimeout(finish, 15000); // never spin forever (e.g. navigation cancelled)
    };
    done.current = finish;

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      let url: URL;
      try { url = new URL(a.href, location.href); } catch { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page / #hash
      if (/\.[a-z0-9]{2,5}$/i.test(url.pathname) && !/\.html$/i.test(url.pathname)) return; // file download
      start(a);
    };
    const onMsg = (e: MessageEvent) => { if (e.origin === location.origin && e.data && e.data.fm === "nav") start(null); };
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) finish(); }; // back/forward cache restore
    const onBusy = () => start(null);

    document.addEventListener("click", onClick, true);
    window.addEventListener("message", onMsg);
    window.addEventListener("pageshow", onShow);
    window.addEventListener("fm:busy", onBusy);
    window.addEventListener("fm:idle", finish);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("message", onMsg);
      window.removeEventListener("pageshow", onShow);
      window.removeEventListener("fm:busy", onBusy);
      window.removeEventListener("fm:idle", finish);
      clearTimeout(safety); clearTimeout(endT);
    };
  }, []);

  // A client-side navigation has committed → complete the bar.
  useEffect(() => { done.current(); }, [pathname]);

  return <div className={`fm-nprog ${phase}`} aria-hidden="true" />;
}
