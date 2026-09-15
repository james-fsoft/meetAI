import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hội nghị, sự kiện lớn — Flash Meet",
};

export default function ConceptConferencePage() {
  return (
    <iframe
      src="/concept-conference.html"
      title="Flash Meet"
      // The live-translation trial inside needs the microphone.
      allow="microphone"
      style={{ border: 0, width: "100%", height: "100dvh", display: "block" }}
    />
  );
}
