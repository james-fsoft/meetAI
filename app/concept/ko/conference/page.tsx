import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "컨퍼런스·대형 행사 — Flash Meet",
};

export default function ConceptConferenceKoPage() {
  return (
    <iframe
      src="/concept-conference-ko.html"
      title="Flash Meet"
      // The live-translation trial inside needs the microphone.
      allow="microphone"
      style={{ border: 0, width: "100%", height: "100dvh", display: "block" }}
    />
  );
}
