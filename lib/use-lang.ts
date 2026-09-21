"use client";

import { useEffect, useState } from "react";

export type Lang = "en" | "vi" | "ko";

/**
 * Shared language state for standalone pages (login, pricing).
 * Reads/writes the same localStorage key ("mr_lang") used by the in-app
 * switcher and the top-bar shell, so language stays consistent everywhere.
 */
export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const read = () => {
      const v = localStorage.getItem("mr_lang");
      setLang(v === "vi" || v === "ko" ? v : "en");
    };
    // A link can state the language it was followed in (?lang=vi); it wins and is remembered,
    // so arriving from a Vietnamese page never drops the reader into English.
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "vi" || q === "ko" || q === "en") {
      try { localStorage.setItem("mr_lang", q); } catch {}
      setLang(q);
    } else read();
    const onStorage = (e: StorageEvent) => { if (e.key === "mr_lang") read(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const set = (l: Lang) => {
    try { localStorage.setItem("mr_lang", l); } catch {}
    setLang(l);
  };
  return [lang, set];
}
