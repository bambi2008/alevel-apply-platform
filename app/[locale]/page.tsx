import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { Dashboard } from "@/components/dashboard";
import { ProcessOverview } from "@/components/process-overview";
import { StoryIllustration } from "@/components/story-illustration";

type Feature = { emoji: string; href: string; title: string; desc: string };
type Plan = {
  name: string;
  price: string;
  unit: string;
  tagline: string;
  highlight?: boolean;
  perks: string[];
};

function Landing({ t, t2 }: { t: Awaited<ReturnType<typeof getTranslations<"home">>>; t2: Awaited<ReturnType<typeof getTranslations<"story">>> }) {
  const features = t.raw("features") as Feature[];
  const plans = t.raw("plans") as Plan[];
  const heroStats = t.raw("heroStats") as { num: string; label: string }[];

  return (
    <div>
      {/* Hero — gradient mesh, no photo (更时髦、无版权风险) */}
      <section className="mesh-hero grain relative overflow-hidden">
        {/* 漂浮的柔光球点缀 */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.25),transparent_70%)] floaty" />
        <div className="pointer-events-none absolute top-10 right-0 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.22),transparent_70%)] floaty-slow" />

        <div className="relative mx-auto max-w-6xl px-6 w-full pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="max-w-3xl">
            <p className="rise-in inline-flex items-center gap-2 text-xs font-semibold text-[var(--indigo)] bg-white/70 backdrop-blur rounded-full px-3.5 py-1.5 mb-7 border border-[var(--border)] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />
              {t("badge")}
            </p>
            <h1 className="rise-in text-[2.6rem] sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-[var(--ink)]">
              {t("titleLine1")}
              <br />
              {t("titleBefore")}
              <span className="text-gradient">{t("titleHighlight")}</span>
              {t("titleAfter")}
            </h1>
            <p className="rise-in-2 mt-6 text-[var(--ink-soft)] text-lg max-w-2xl leading-relaxed">{t("subtitle")}</p>
            <div className="rise-in-2 mt-9 flex items-center gap-3 flex-wrap">
              <Link href="/match" className="btn-glow px-7 py-3.5 rounded-2xl font-semibold">
                {t("ctaTry")}
              </Link>
              <Link
                href="/universities"
                className="px-7 py-3.5 rounded-2xl bg-white/70 backdrop-blur text-[var(--ink)] font-medium border border-[var(--border)] hover:border-indigo-200 hover:bg-white transition-colors"
              >
                {t("ctaBrowse")}
              </Link>
            </div>

            {/* 信任数据条 */}
            <div className="rise-in-3 mt-11 flex flex-wrap gap-x-10 gap-y-4">
              {heroStats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl sm:text-3xl font-extrabold stat-num">{s.num}</div>
                  <div className="text-xs text-[var(--ink-soft)] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="rise-in-3 mt-8 text-sm text-[var(--ink-soft)]">{t("priceNote")}</p>
          </div>
        </div>
      </section>

      {/* Process overview */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <ProcessOverview />
        </div>
      </section>

      {/* Features — bento 网格 */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <Link
              key={f.title}
              href={f.href}
              className={`bento-card group block p-6 ${i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-soft flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {f.emoji}
              </div>
              <h3 className="font-semibold mb-1.5 text-[var(--ink)] flex items-center gap-1.5">
                {f.title}
                <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[var(--indigo)]">→</span>
              </h3>
              <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
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

      {/* Story strip — 父子故事（写在最后） */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="bento-card grid md:grid-cols-2 gap-8 items-center p-8 sm:p-10">
          <div>
            <p className="text-xs font-semibold text-[var(--indigo)] tracking-wide uppercase mb-3">{t2("eyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] leading-snug">{t2("titleLine")}</h2>
            <p className="mt-4 text-[var(--ink-soft)] leading-relaxed">{t2("short")}</p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-1.5 text-[var(--indigo)] font-medium hover:gap-2.5 transition-all"
            >
              {t2("cta")} <span>→</span>
            </Link>
          </div>
          <div className="order-first md:order-last">
            <StoryIllustration className="w-full h-auto floaty-slow" />
          </div>
        </div>
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
  const t2 = await getTranslations("story");

  if (session?.user) {
    return <Dashboard email={session.user.email} />;
  }

  return <Landing t={t} t2={t2} />;
}
