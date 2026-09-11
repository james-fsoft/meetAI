"use client";

import { useEffect, useState } from "react";

export default function ConferenceViewPage() {
  const [src, setSrc] = useState("/conference-view.html");
  useEffect(() => setSrc(`/conference-view.html${window.location.search}`), []);
  return (
    <iframe
      src={src}
      title="Flash Meet Conference Viewer"
      style={{ border: 0, width: "100%", height: "100vh", display: "block" }}
    />
  );
}
