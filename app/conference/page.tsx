import type { Metadata } from "next";
import ConceptFrame from "../ConceptFrame";

const LANGUAGES = { en: "/conference", vi: "/vi/conference", ko: "/ko/conference", "x-default": "/conference" };

export const metadata: Metadata = {
  title: 'Conferences & events',
  description: 'Live translated captions for a whole room: large captions on the projected screen, a floating panel over your slides, and a QR code so the audience can follow on their phones.',
  alternates: { canonical: '/conference', languages: LANGUAGES },
  openGraph: { title: 'Conferences & events — Flash Meet', description: 'Live translated captions for a whole room: large captions on the projected screen, a floating panel over your slides, and a QR code so the audience can follow on their phones.', url: "https://meet.transflash.app" + '/conference', locale: 'en_US' },
};

export default function ConferenceEn() {
  return <ConceptFrame src='/concept-conference-en.html' title='Conferences & events — Flash Meet' />;
}
