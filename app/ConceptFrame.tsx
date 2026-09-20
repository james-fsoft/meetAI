/**
 * The landing page. Its markup is built ahead of time into public/concept*.html
 * (one file per language) and shown here full-bleed; the live-translation trial
 * inside it needs the microphone.
 */
export default function ConceptFrame({ src, title }: { src: string; title: string }) {
  return (
    <iframe
      src={src}
      title={title}
      allow="microphone"
      style={{ border: 0, width: "100%", height: "100dvh", display: "block" }}
    />
  );
}
