import type { Metadata } from "next";
import { StaticProse } from "@/components/static-prose";
import narrative from "@/data/public-copy/about-v5.json";

// Exact supplied v5 narrative. Keep the price-review draft out of search indexes.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16"><StaticProse text={locale === "en" ? narrative.en : narrative.zhCN} /></main>;
}
