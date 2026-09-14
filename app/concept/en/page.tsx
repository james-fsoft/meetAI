import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flash Meet — Speak your language. Understood instantly.",
};

export default function ConceptEnPage() {
  return (
    <iframe
      src="/concept-en.html"
      title="Flash Meet"
      // The live-translation trial inside needs the microphone.
      allow="microphone"
      style={{ border: 0, width: "100%", height: "100dvh", display: "block" }}
    />
  );
}
