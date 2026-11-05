import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { STUDY_PLANS } from "@/lib/plans";
import { seasonPassOffer } from "@/lib/membership/config";
import { trialProgrammeEnabled } from "@/lib/membership/trial";
import { Link } from "@/i18n/navigation";
import { PUBLIC_CONTACT_EMAIL, PUBLIC_CONTACT_HREF } from "@/lib/site-config";
import { auth } from "@/auth";
import { paymentOffer } from "@/lib/payments/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "en" ? "Plans | QiaoShen" : "套餐说明 | 桥申" };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const en = locale === "en";
  const offer = seasonPassOffer();
  const checkout = paymentOffer((await auth())?.user);
  const trialEnabled = trialProgrammeEnabled();
  const plans = STUDY_PLANS.map(plan => plan.id === "season_pass" ? { ...plan, priceCny: offer.priceFen / 100, durationMonths: offer.months } : plan);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <h1 className="text-3xl font-semibold">{en ? "Plans" : "套餐说明"}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-soft)]">{en ? "Practice for A Level, competitions, university admissions tests and personal statements. Interviews are in development." : "覆盖 A Level、竞赛、大学入学考试与文书练习。面试功能开发中。"}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <section key={plan.id} className="flex flex-col border border-black/20 bg-white/40 p-5">
            <h2 className="text-lg font-semibold">{en ? plan.nameEn : plan.name}</h2>
            <p className="mt-4 text-3xl font-semibold">¥{plan.priceCny}</p>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">{plan.durationMonths ? (en ? `${plan.durationMonths} calendar months` : `${plan.durationMonths} 个自然月`) : (en ? "7 days" : "7 天")}</p>
            <p className="mt-5 flex-1 text-sm leading-6 text-[var(--ink-soft)]">{plan.id === "trial" ? (en ? "Once per new-user email. Seven days from registration when enabled. No payment method required. At expiry, new practice requires an Exam Season Pass." : "启用后按注册时刻起7天计算，同一邮箱仅可领取一次，不绑定付款方式。到期后需考季卡才能开始新练习。") : (en ? "One-time payment for site-wide practice. No automatic renewal or debit." : "一次性付费，覆盖全站练习，不自动续费或扣款。")}</p>
            {plan.id === "trial" && trialEnabled
              ? <Link href="/register" className="btn btn-secondary mt-5">{en ? "Create an account" : "注册账号"}</Link>
              : plan.id === "season_pass" && checkout.enabled
                ? <Link href="/purchase" className="btn btn-primary mt-5">{checkout.testPayment ? (en ? "Open administrator checkout" : "打开管理员测试支付") : (en ? "Buy Exam Season Pass" : "购买考季卡")}</Link>
                : <button type="button" disabled className="btn btn-secondary mt-5">{plan.id === "trial" ? (en ? "Trial not yet open" : "体验暂未开放") : (en ? "Available once payments open" : "支付开通后可购买")}</button>}
          </section>
        ))}
      </div>
      <section className="mt-9 border-t border-black/20 pt-5 text-sm leading-7 text-[var(--ink-soft)]">
        <h2 className="font-semibold text-[var(--ink)]">{en ? "Before you use AI" : "AI 使用说明"}</h2>
        <p>{en ? "AI feedback is for practice only and is not human or official marking. When enabled and separately consented to, submitted work is sent to DeepSeek. No score, admission, award or interview outcome is guaranteed." : "AI 反馈仅供练习参考，不是人工或官方评分。功能启用且经你单独同意后，提交的作答内容会发送给 DeepSeek。不保证考试分数、录取、获奖或面试结果。"}</p>
        <p>{en ? "When AI is enabled, trial and paid access share the same daily limits: 20 feedback actions in total, including up to 10 photo-based and 3 personal-statement actions. Limits reset at midnight Beijing time. Failed calls do not use an allowance." : "AI 启用时，体验和考季卡的每日上限相同：合计20次，其中拍照批改最多10次、文书批改最多3次；北京时间零点重置，调用失败不计次数。"}</p>
        <p>{en ? "Paid passes expire without automatic renewal. Contact: " : "付费卡到期不自动续费。联系邮箱："}<a className="inline-flex min-h-11 items-center underline" href={PUBLIC_CONTACT_HREF}>{PUBLIC_CONTACT_EMAIL}</a></p>
      </section>
    </div>
  );
}
