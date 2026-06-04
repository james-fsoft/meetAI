"use client";

/**
 * Meeting AI — main shell.
 * Serves the meeting UI from public/meeting.html inside an iframe.
 */
export default function MeetingApp() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <iframe
        src="/meeting.html?v=23"
        title="Meeting AI"
        allow="microphone; display-capture; clipboard-write"
        style={{ border: "none", width: "100%", flex: 1, display: "block" }}
      />
    </div>
  );
}
