import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conferences & events — Flash Meet",
};

export default function ConceptConferenceEnPage() {
  return (
    <iframe
      src="/concept-conference-en.html"
      title="Flash Meet"
      // The live-translation trial inside needs the microphone.
      allow="microphone"
      style={{ border: 0, width: "100%", height: "100dvh", display: "block" }}
    />
  );
}
