import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { StoryIllustration } from "@/components/story-illustration";

type Value = { icon: string; title: string; desc: string };

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("story");
  const paras = t.raw("paras") as string[];
  const values = t.raw("values") as Value[];

  return (
    <div>
      {/* Hero */}
      <section className="mesh-hero grain relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 right-0 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.20),transparent_70%)] floaty" />
        <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-14 sm:pt-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="rise-in text-xs font-semibold text-[var(--indigo)] tracking-wide uppercase mb-3">
                {t("eyebrow")}
              </p>
              <h1 className="rise-in text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-[var(--ink)]">
                {t("aboutTitle")}
              </h1>
              <p className="rise-in-2 mt-5 text-lg text-[var(--ink-soft)] leading-relaxed">{t("aboutSubtitle")}</p>
            </div>
            <div className="rise-in-2">
              <StoryIllustration className="w-full h-auto floaty-slow" />
            </div>
          </div>
        </div>
      </section>

      {/* Story body */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <div className="space-y-6">
          {paras.map((p, i) => (
            <p
              key={i}
              className={`leading-[1.9] ${i === 0 ? "text-lg text-[var(--ink)]" : "text-[var(--ink-soft)]"}`}
            >
              {p}
            </p>
          ))}
          <p className="pt-2 text-right text-lg font-semibold text-gradient">{t("signoff")}</p>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-2xl font-bold text-center text-[var(--ink)] mb-8">{t("valuesTitle")}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {values.map((v) => (
            <div key={v.title} className="bento-card p-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-soft flex items-center justify-center text-2xl mb-4">
                {v.icon}
              </div>
              <h3 className="font-semibold mb-1.5 text-[var(--ink)]">{v.title}</h3>
              <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="bento-card text-center p-10 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)]">和我们一起，自己掌控这场申请</h2>
          <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
            <Link href="/match" className="btn-glow px-7 py-3.5 rounded-2xl font-semibold">
              免费试用选校匹配
            </Link>
            <Link
              href="/"
              className="px-7 py-3.5 rounded-2xl bg-white/70 backdrop-blur text-[var(--ink)] font-medium border border-[var(--border)] hover:border-indigo-200 hover:bg-white transition-colors"
            >
              回首页看功能
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
