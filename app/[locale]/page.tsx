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
    <div>
      {/* Fullscreen hero with photo background */}
      <section className="relative min-h-[86vh] flex items-center overflow-hidden">
        {/* 背景大图（你的毕业照） */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* 渐变遮罩：保证文字清晰，同时带品牌色 */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1226]/90 via-[#0f1226]/70 to-[#4f46e5]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1226]/70 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-6xl px-6 w-full py-20">
          <div className="max-w-2xl">
            <p className="inline-block text-xs font-semibold text-white bg-white/15 backdrop-blur rounded-full px-3 py-1 mb-6 border border-white/20">
              {t("badge")}
            </p>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              {t("titleLine1")}
              <br />
              {t("titleBefore")}
              <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
              {t("titleAfter")}
            </h1>
            <p className="mt-6 text-white/85 text-lg max-w-xl leading-relaxed">{t("subtitle")}</p>
            <div className="mt-9 flex items-center gap-3 flex-wrap">
              <Link
                href="/match"
                className="px-7 py-3.5 rounded-xl bg-white text-[var(--indigo)] font-semibold hover:bg-white/90 transition-colors shadow-lg shadow-black/20"
              >
                {t("ctaTry")}
              </Link>
              <Link
                href="/universities"
                className="px-7 py-3.5 rounded-xl bg-white/10 backdrop-blur text-white font-medium border border-white/25 hover:bg-white/20 transition-colors"
              >
                {t("ctaBrowse")}
              </Link>
            </div>
            <p className="mt-5 text-sm text-white/70">{t("priceNote")}</p>
          </div>
        </div>
      </section>

      {/* Process overview */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="max-w-2xl mx-auto">
          <ProcessOverview />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="card-hover block rounded-2xl border border-[var(--border)] bg-white p-5 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-soft flex items-center justify-center text-2xl mb-3">{f.emoji}</div>
            <h3 className="font-semibold mb-1 text-[var(--ink)]">{f.title}</h3>
            <p className="text-sm text-[var(--ink-soft)]">{f.desc}</p>
          </Link>
        ))}
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[var(--ink)]">{t("pricingHeading")}</h2>
        <p className="text-center text-[var(--ink-soft)] mb-8">{t("pricingSub")}</p>
        <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-6 ${p.highlight ? "border-transparent ring-2 ring-[var(--indigo)] bg-brand-soft" : "border-[var(--border)] bg-white"}`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-[var(--ink)]">{p.name}</h3>
                <span className="text-xs text-[var(--ink-soft)]">{p.tagline}</span>
              </div>
              <div className="mt-3 mb-4">
                <span className="text-3xl font-extrabold text-[var(--ink)]">{p.price}</span>
                {p.unit && <span className="text-[var(--ink-soft)]">{p.unit}</span>}
              </div>
              <ul className="space-y-2 text-sm text-[var(--ink-soft)]">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex gap-2">
                    <span className="text-[var(--indigo)]">✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-[var(--ink-soft)] mt-6">{t("pricingNote")}</p>
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
