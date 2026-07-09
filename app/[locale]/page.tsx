import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { Dashboard } from "@/components/dashboard";
import { ProcessOverview } from "@/components/process-overview";
import { StoryIllustration } from "@/components/story-illustration";
import { HeroBridge, SceneCompass, SceneDocs, SceneChat, SceneGrowth } from "@/components/illustrations";
import { Photo } from "@/components/photo";

type Feature = { emoji: string; href: string; title: string; desc: string };
type Plan = {
  name: string;
  price: string;
  unit: string;
  tagline: string;
  highlight?: boolean;
  perks: string[];
};

const TILE = ["tile-blue", "tile-yellow", "tile-green", "tile-pink", "tile-purple", "tile-orange"];
const SCENES = [SceneCompass, SceneDocs, SceneChat, SceneGrowth];

function Landing({ t, t2 }: { t: Awaited<ReturnType<typeof getTranslations<"home">>>; t2: Awaited<ReturnType<typeof getTranslations<"story">>> }) {
  const features = t.raw("features") as Feature[];
  const plans = t.raw("plans") as Plan[];
  const heroStats = t.raw("heroStats") as { num: string; label: string }[];

  return (
    <div className="bg-white">
      {/* ── Hero：左文 + 右漫画色块 ─────────────────────────── */}
      <section className="border-b border-[var(--border-soft)]">
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-16 sm:pt-20 sm:pb-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <h1 className="rise-in ucas-title">
              {t("titleLine1")}
              <br className="hidden sm:block" />
              {t("titleBefore")}
              <span className="text-[var(--indigo)]">{t("titleHighlight")}</span>
              {t("titleAfter")}
            </h1>
            <p className="rise-in-2 mt-6 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">
              {t("subtitle")}
            </p>
            <div className="rise-in-2 mt-8 flex items-center gap-3 flex-wrap">
              <Link href="/tests" className="btn btn-primary group">
                {t("ctaTry")}<span className="notion-arrow">→</span>
              </Link>
              <Link href="/match" className="btn btn-secondary">{t("ctaBrowse")}</Link>
            </div>
            {/* Notion callout：招牌 emoji + 软色底提示 */}
            <div className="rise-in-3 mt-6 callout callout-blue max-w-md">
              <span className="callout-emoji">💡</span>
              <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{t("priceNote")}</p>
            </div>
          </div>

          <div className="rise-in-2">
            <div className="tile tile-blue notion-zoom rounded-2xl">
              <Photo
                src="/images/hero-student.jpg"
                alt={t("titleHighlight")}
                className="w-full"
                imgClassName="h-auto w-full rounded-xl object-cover aspect-[4/3]"
                fallback={<HeroBridge className="w-full h-auto doodle-idle" />}
              />
            </div>
          </div>
        </div>

        {/* 信任数据条 */}
        <div className="border-t border-[var(--border-soft)]">
          <div className="mx-auto max-w-6xl px-6 py-8 flex flex-wrap items-stretch gap-y-4 divide-x divide-[var(--border)]">
            {heroStats.map((s) => (
              <div key={s.label} className="px-6 sm:px-10 first:pl-0">
                <div className="text-3xl font-extrabold tracking-[-0.02em] text-[var(--ink)] tabular-nums">{s.num}</div>
                <div className="mt-1 t-caption">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <SectionHead eyebrow={t("processEyebrow")} title={t("processTitle")} />
        <div className="mt-12 max-w-2xl mx-auto">
          <ProcessOverview />
        </div>
      </section>

      {/* ── Capabilities：Notion 色块 bento 拼贴 ─────────────── */}
      <section className="border-y border-[var(--border-soft)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHead eyebrow={t("capEyebrow")} title={t("capTitle")} sub={t("capSub")} />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Scene = SCENES[i % SCENES.length];
              return (
                <Link
                  key={f.title}
                  href={f.href}
                  className={`group tile ${TILE[i % TILE.length]} notion-lift flex flex-col`}
                >
                  <div className="notion-zoom rounded-xl bg-white/70 border border-black/5 mb-4">
                    <Scene className="w-full h-36" />
                  </div>
                  <h3 className="h-section flex items-center gap-2">
                    <span className="text-xl emoji-bounce">{f.emoji}</span>
                    {f.title}
                    <span className="notion-arrow ml-auto text-[var(--ink-faint)]">→</span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{f.desc}</p>
                </Link>
              );
            })}
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
              className={`relative notion-lift rounded-2xl p-7 border ${
                p.highlight
                  ? "tile-blue border-[color:var(--on-blue)]/25"
                  : "bg-white border-[var(--border)]"
              }`}
            >
              {p.highlight && (
                <span className="absolute top-5 right-5 badge" style={{ background: "var(--on-blue)", color: "#fff" }}>推荐</span>
              )}
              <h3 className="font-semibold text-[var(--ink)]">{p.name}</h3>
              <p className="text-xs mt-0.5 text-[var(--ink-faint)]">{p.tagline}</p>
              <div className="mt-5 mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-[-0.02em] tabular-nums text-[var(--ink)]">{p.price}</span>
                {p.unit && <span className="text-[var(--ink-faint)]">{p.unit}</span>}
              </div>
              <ul className="space-y-2.5 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex gap-2.5 text-[var(--ink-soft)]">
                    <span className="text-[var(--indigo)]">✓</span>
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
            <Link href="/about" className="group mt-7 inline-flex items-center gap-1.5 font-medium text-[var(--indigo)]">
              {t2("cta")} <span className="notion-arrow">→</span>
            </Link>
          </div>
          <div className="order-first md:order-last">
            <div className="tile tile-yellow notion-zoom rounded-2xl">
              <Photo
                src="/images/story-warm.jpg"
                alt={t2("titleLine")}
                className="w-full"
                imgClassName="h-auto w-full rounded-xl object-cover aspect-[4/3]"
                fallback={<StoryIllustration className="w-full h-auto doodle-idle-slow" />}
              />
            </div>
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
