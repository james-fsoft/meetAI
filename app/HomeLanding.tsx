"use client";

// Home-page marketing block that follows the user's selected language. Renders
// English on the server/first paint (matches the en canonical for crawlers),
// then swaps to the user's mr_lang after hydration.
import { useLang } from "@/lib/use-lang";
import LandingContent from "./LandingContent";

export default function HomeLanding() {
  const [lang] = useLang();
  return <LandingContent lang={lang} />;
}
