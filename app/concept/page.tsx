export default function ConceptPage() {
  return (
    <iframe
      src="/concept.html"
      title="Meetflash Premium Concept"
      // The live-translation trial inside needs the microphone.
      allow="microphone"
      style={{ border: 0, width: "100%", height: "100dvh", display: "block" }}
    />
  );
}
