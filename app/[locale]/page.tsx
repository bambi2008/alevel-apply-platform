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
    <div className="bg-white">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[var(--border-soft)]">
        {/* 极淡的单色光晕，只占顶部（Stripe 手法） */}
        <div className="pointer-events-none absolute inset-x-0 -top-40 h-[40rem] bg-[radial-gradient(60rem_32rem_at_50%_0%,rgba(79,70,229,0.07),transparent_70%)]" />

        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-24 sm:pt-32 sm:pb-28 text-center">
          <p className="rise-in inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3.5 py-1.5 text-xs font-medium text-[var(--ink-soft)] shadow-[var(--shadow-sm)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--indigo)]" />
            {t("badge")}
          </p>

          <h1 className="rise-in mx-auto mt-7 max-w-4xl text-[clamp(2.6rem,6.4vw,4.75rem)] font-extrabold leading-[1.03] tracking-[-0.04em] text-[var(--ink)]">
            {t("titleLine1")}
            <br className="hidden sm:block" />
            {t("titleBefore")}
            <span className="text-[var(--indigo)]">{t("titleHighlight")}</span>
            {t("titleAfter")}
          </h1>

          <p className="rise-in-2 mx-auto mt-7 max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">
            {t("subtitle")}
          </p>

          <div className="rise-in-2 mt-9 flex items-center justify-center gap-3 flex-wrap">
            <Link href="/match" className="btn btn-primary">{t("ctaTry")}</Link>
            <Link href="/universities" className="btn btn-secondary">{t("ctaBrowse")}</Link>
          </div>

          <p className="rise-in-3 mt-5 t-caption">{t("priceNote")}</p>

          {/* 信任数据：tabular 数字 + 细分隔 */}
          <div className="rise-in-3 mt-14 flex items-stretch justify-center divide-x divide-[var(--border)]">
            {heroStats.map((s) => (
              <div key={s.label} className="px-6 sm:px-9 first:pl-0 last:pr-0">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] text-[var(--ink)] tabular-nums">{s.num}</div>
                <div className="mt-1 t-caption">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <SectionHead eyebrow={t("processEyebrow")} title={t("processTitle")} />
        <div className="mt-12 max-w-2xl mx-auto">
          <ProcessOverview />
        </div>
      </section>

      {/* ── Capabilities ───────────────────────────────────── */}
      <section className="border-y border-[var(--border-soft)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionHead eyebrow={t("capEyebrow")} title={t("capTitle")} sub={t("capSub")} />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)]">
            {features.map((f) => (
              <Link key={f.title} href={f.href} className="group relative bg-white p-7 transition-colors hover:bg-[var(--surface)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface)] text-xl ring-1 ring-[var(--border)]">
                  {f.emoji}
                </div>
                <h3 className="mt-5 h-section flex items-center gap-1.5">
                  {f.title}
                  <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--indigo)]">→</span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-5xl px-6 py-24 scroll-mt-16">
        <SectionHead eyebrow={t("pricingEyebrow")} title={t("pricingHeading")} sub={t("pricingSub")} />
        <div className="mt-14 grid sm:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-7 ${p.highlight ? "bg-[var(--ink)] text-white shadow-[var(--shadow-lg)]" : "bg-white border border-[var(--border)] shadow-[var(--shadow-sm)]"}`}
            >
              {p.highlight && (
                <span className="absolute top-5 right-5 badge badge-brand !bg-white/15 !text-white">推荐</span>
              )}
              <h3 className={`font-semibold ${p.highlight ? "text-white" : "text-[var(--ink)]"}`}>{p.name}</h3>
              <p className={`text-xs mt-0.5 ${p.highlight ? "text-white/60" : "text-[var(--ink-faint)]"}`}>{p.tagline}</p>
              <div className="mt-5 mb-6 flex items-baseline gap-1">
                <span className={`text-4xl font-extrabold tracking-[-0.02em] tabular-nums ${p.highlight ? "text-white" : "text-[var(--ink)]"}`}>{p.price}</span>
                {p.unit && <span className={p.highlight ? "text-white/60" : "text-[var(--ink-faint)]"}>{p.unit}</span>}
              </div>
              <ul className="space-y-2.5 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className={`flex gap-2.5 ${p.highlight ? "text-white/85" : "text-[var(--ink-soft)]"}`}>
                    <span className={p.highlight ? "text-white" : "text-[var(--indigo)]"}>✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center t-caption mt-8">{t("pricingNote")}</p>
      </section>

      {/* ── Story ──────────────────────────────────────────── */}
      <section className="border-t border-[var(--border-soft)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="t-caption font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">{t2("eyebrow")}</p>
            <h2 className="mt-3 h-title">{t2("titleLine")}</h2>
            <p className="mt-5 t-body">{t2("short")}</p>
            <Link href="/about" className="mt-7 inline-flex items-center gap-1.5 font-medium text-[var(--indigo)] hover:gap-2.5 transition-all">
              {t2("cta")} <span>→</span>
            </Link>
          </div>
          <div className="order-first md:order-last">
            <StoryIllustration className="w-full h-auto" />
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <p className="t-caption font-semibold uppercase tracking-[0.14em] text-[var(--indigo)]">{eyebrow}</p>
      <h2 className="mt-3 h-title">{title}</h2>
      {sub && <p className="mt-4 t-body">{sub}</p>}
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
