import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { STUDY_PLANS } from "@/lib/plans";
import { PUBLIC_CONTACT_EMAIL, PUBLIC_CONTACT_HREF } from "@/lib/site-config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "en" ? "Plans | QiaoShen" : "套餐说明 | 桥申" };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const en = locale === "en";
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <h1 className="text-3xl font-semibold">{en ? "Plans" : "套餐说明"}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-soft)]">{en ? "A Level, competitions, university admissions tests, interviews and personal statements. Purchases are not yet available." : "覆盖 A Level、竞赛、大学入学考试、面试与文书。支付尚未开通，暂不可购买。"}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STUDY_PLANS.map((plan) => (
          <section key={plan.id} className="flex flex-col border border-black/20 bg-white/40 p-5">
            <h2 className="text-lg font-semibold">{en ? plan.nameEn : plan.name}</h2>
            <p className="mt-4 text-3xl font-semibold">¥{plan.priceCny}</p>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">{plan.durationMonths ? (en ? `${plan.durationMonths} months` : `${plan.durationMonths} 个月`) : plan.durationDays ? (en ? "7 days" : "7 天") : (en ? "No expiry" : "长期有效")}</p>
            <p className="mt-5 flex-1 text-sm leading-6 text-[var(--ink-soft)]">{plan.id === "trial" ? (en ? "Once per new account. No card required. Returns to Basic Practice after 7 days, with no charge. Activation is not yet available." : "每个新账号1次，不绑卡。7天到期后回到基础练习，不会扣费。暂未开放领取。") : plan.priceCny > 0 ? (en ? "One-time payment. Site-wide access. No automatic renewal." : "一次性付费，覆盖全站，不自动续费。") : (en ? "Basic practice. Allowances will be published when enabled." : "基础练习，具体额度以启用时公布的规则为准。")}</p>
            {(plan.priceCny > 0 || plan.id === "trial") && <button type="button" disabled className="mt-5 min-h-11 w-full cursor-not-allowed border border-black/20 bg-black/5 px-3 py-2 text-sm text-black/60">{plan.id === "trial" ? (en ? "Trial not yet open" : "体验暂未开放") : (en ? "Available once payments open" : "支付开通后可购买")}</button>}
          </section>
        ))}
      </div>
      <section className="mt-9 border-t border-black/20 pt-5 text-sm leading-7 text-[var(--ink-soft)]">
        <h2 className="font-semibold text-[var(--ink)]">{en ? "Before you use AI" : "AI 使用说明"}</h2>
        <p>{en ? "AI feedback is not human or official marking and may be inaccurate or unavailable. When you request AI feedback and give separate consent, your submitted work is sent to DeepSeek. We do not promise score improvements, admission, awards or interview success." : "AI 反馈不是真人或官方批改，不保证一定可用或准确。你主动使用 AI 功能并单独同意后，提交的作答内容会发送给 DeepSeek 生成反馈。不承诺提分、录取、获奖或面试通过。"}</p>
        <p>{en ? "Paid passes expire without automatic renewal. Contact: " : "付费卡到期不自动续费。联系邮箱："}<a className="inline-flex min-h-11 items-center underline" href={PUBLIC_CONTACT_HREF}>{PUBLIC_CONTACT_EMAIL}</a></p>
      </section>
    </div>
  );
}
