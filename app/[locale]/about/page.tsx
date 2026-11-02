import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Owner-approved replacement copy has not been supplied. Never publish a draft
// biography or resurrect the former student story while awaiting that copy.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AboutPage() {
  notFound();
}
