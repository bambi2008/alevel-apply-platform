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

/** 桥主题主画面：一座跨越之桥连接「你」与「梦校」，呼应品牌。纯 SVG，清晰不失效。 */
function HeroArt() {
  return (
    <svg viewBox="0 0 480 380" className="w-full h-auto max-w-lg mx-auto drop-shadow-xl" role="img" aria-label="跨越之桥连接学生与理想大学">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef0ff" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="0.55" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="chip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      {/* 背景卡片 */}
      <rect x="8" y="8" width="464" height="364" rx="28" fill="url(#sky)" stroke="#e6e8f5" />

      {/* 主桥拱 */}
      <path d="M52 250 A 165 165 0 0 1 428 250" fill="none" stroke="url(#arc)" strokeWidth="7" strokeLinecap="round" />
      {/* 桥面 */}
      <line x1="52" y1="250" x2="428" y2="250" stroke="url(#arc)" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
      {/* 吊索 */}
      {[92, 140, 188, 240, 292, 340, 388].map((x, i) => {
        const y = 250 - Math.round(150 * Math.sin(Math.acos((x - 240) / 188)));
        return <line key={i} x1={x} y1={y + 4} x2={x} y2="250" stroke="#7c3aed" strokeWidth="2" opacity="0.35" />;
      })}
      {/* 桥墩 */}
      <line x1="52" y1="250" x2="52" y2="312" stroke="url(#arc)" strokeWidth="6" strokeLinecap="round" />
      <line x1="428" y1="250" x2="428" y2="312" stroke="url(#arc)" strokeWidth="6" strokeLinecap="round" />

      {/* 左岸：你（起点） */}
      <circle cx="52" cy="285" r="15" fill="#fff" stroke="url(#chip)" strokeWidth="3" />
      <circle cx="52" cy="280" r="5" fill="#7c3aed" />
      <path d="M44 293 Q52 285 60 293" fill="#7c3aed" />

      {/* 右岸：学位帽（梦校） */}
      <g transform="translate(410,270)">
        <path d="M0 6 L20 0 L40 6 L20 12 Z" fill="url(#chip)" />
        <path d="M8 9 L8 18 Q20 24 32 18 L32 9" fill="none" stroke="#4f46e5" strokeWidth="2.5" />
        <line x1="40" y1="6" x2="40" y2="16" stroke="#22d3ee" strokeWidth="2" />
      </g>

      {/* 悬浮卡片：选校匹配 / offer / 院校 */}
      <g transform="translate(150,70)">
        <rect width="96" height="34" rx="10" fill="#fff" stroke="#e6e8f5" />
        <circle cx="20" cy="17" r="9" fill="#eef0ff" />
        <text x="20" y="21" fontSize="11" textAnchor="middle">🎯</text>
        <text x="38" y="21" fontSize="12" fill="#0f1226" fontWeight="600">选校匹配</text>
      </g>
      <g transform="translate(268,44)">
        <rect width="80" height="34" rx="10" fill="#fff" stroke="#e6e8f5" />
        <circle cx="18" cy="17" r="9" fill="#eefcff" />
        <text x="18" y="21" fontSize="11" textAnchor="middle">🏛️</text>
        <text x="34" y="21" fontSize="12" fill="#0f1226" fontWeight="600">院校库</text>
      </g>
      <g transform="translate(210,120)">
        <rect width="70" height="30" rx="9" fill="url(#chip)" />
        <text x="35" y="20" fontSize="12" fill="#fff" textAnchor="middle" fontWeight="700">offer ✓</text>
      </g>
    </svg>
  );
}

function Landing({ t }: { t: Awaited<ReturnType<typeof getTranslations<"home">>> }) {
  const features = t.raw("features") as Feature[];
  const plans = t.raw("plans") as Plan[];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-soft border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block text-xs font-semibold text-[var(--indigo)] bg-white/70 rounded-full px-3 py-1 mb-5">
              {t("badge")}
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] text-[var(--ink)]">
              {t("titleLine1")}
              <br />
              {t("titleBefore")}
              <span className="text-gradient">{t("titleHighlight")}</span>
              {t("titleAfter")}
            </h1>
            <p className="mt-5 text-[var(--ink-soft)] text-lg max-w-xl">{t("subtitle")}</p>
            <div className="mt-8 flex items-center gap-3 flex-wrap">
              <Link href="/match" className="px-6 py-3 rounded-xl bg-brand text-white font-medium shadow-sm shadow-indigo-500/20 hover:opacity-90 transition-opacity">
                {t("ctaTry")}
              </Link>
              <Link href="/universities" className="px-6 py-3 rounded-xl bg-white border border-[var(--border)] font-medium text-[var(--ink)] hover:bg-[var(--surface)] transition-colors">
                {t("ctaBrowse")}
              </Link>
            </div>
            <p className="mt-4 text-sm text-[var(--ink-soft)]">{t("priceNote")}</p>
          </div>
          <div className="relative">
            <HeroArt />
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
