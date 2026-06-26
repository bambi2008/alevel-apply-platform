import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { Dashboard } from "@/components/dashboard";
import { ProcessOverview } from "@/components/process-overview";

type Feature = { emoji: string; href: string; title: string; desc: string };
type Plan = {
  name: string;
  price: string;
  unit: string;
  tagline: string;
  highlight?: boolean;
  perks: string[];
};

function Landing({ t }: { t: Awaited<ReturnType<typeof getTranslations<"home">>> }) {
  const features = t.raw("features") as Feature[];
  const plans = t.raw("plans") as Plan[];

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="py-16 sm:py-24 text-center">
        <p className="inline-block text-xs font-medium text-blue-700 bg-blue-50 rounded-full px-3 py-1 mb-5">
          {t("badge")}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          {t("titleLine1")}
          <br className="hidden sm:block" />
          {t("titleBefore")}
          <span className="text-blue-600">{t("titleHighlight")}</span>
          {t("titleAfter")}
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-neutral-600 text-lg">{t("subtitle")}</p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link href="/match" className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
            {t("ctaTry")}
          </Link>
          <Link href="/universities" className="px-6 py-3 rounded-lg border border-neutral-300 font-medium hover:bg-neutral-50">
            {t("ctaBrowse")}
          </Link>
        </div>
        <p className="mt-4 text-sm text-neutral-400">{t("priceNote")}</p>
      </section>

      {/* Process overview */}
      <section className="py-12 border-t border-neutral-100">
        <div className="max-w-2xl mx-auto">
          <ProcessOverview />
        </div>
      </section>

      {/* Features */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8 border-t border-neutral-100 pt-12">
        {features.map((f) => (
          <Link key={f.title} href={f.href} className="block rounded-xl border border-neutral-200 p-5 hover:border-blue-300 hover:shadow-sm transition">
            <div className="text-2xl mb-2">{f.emoji}</div>
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-neutral-600">{f.desc}</p>
          </Link>
        ))}
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 scroll-mt-16">
        <h2 className="text-2xl font-bold text-center mb-2">{t("pricingHeading")}</h2>
        <p className="text-center text-neutral-500 mb-8">{t("pricingSub")}</p>
        <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-xl border p-6 ${p.highlight ? "border-blue-500 ring-1 ring-blue-200" : "border-neutral-200"}`}>
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold">{p.name}</h3>
                <span className="text-xs text-neutral-400">{p.tagline}</span>
              </div>
              <div className="mt-3 mb-4">
                <span className="text-3xl font-bold">{p.price}</span>
                {p.unit && <span className="text-neutral-500">{p.unit}</span>}
              </div>
              <ul className="space-y-2 text-sm text-neutral-600">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex gap-2">
                    <span className="text-blue-600">✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-neutral-400 mt-6">{t("pricingNote")}</p>
      </section>
    </div>
  );
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const t = await getTranslations("home");

  if (session?.user) {
    return <Dashboard email={session.user.email} />;
  }

  return <Landing t={t} />;
}
