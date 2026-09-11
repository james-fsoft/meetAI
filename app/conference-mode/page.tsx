export default function ConferenceModePage() {
  return (
    <iframe
      src="/conference-display.html"
      title="Flash Meet Conference Mode"
      allow="microphone; clipboard-write"
      style={{ border: 0, width: "100%", height: "100vh", display: "block" }}
    />
  );
}
