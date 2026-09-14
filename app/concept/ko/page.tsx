import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flash Meet — 내 언어로 말하면, 바로 통합니다.",
};

export default function ConceptKoPage() {
  return (
    <iframe
      src="/concept-ko.html"
      title="Flash Meet"
      // The live-translation trial inside needs the microphone.
      allow="microphone"
      style={{ border: 0, width: "100%", height: "100dvh", display: "block" }}
    />
  );
}
