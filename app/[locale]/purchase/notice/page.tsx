import { LegalPage } from "@/components/legal-page";
import { seasonPassOffer } from "@/lib/membership/config";
import { PURCHASE_TERMS_VERSION } from "@/lib/payments/config";
import { PUBLIC_CONTACT_EMAIL, PUBLIC_CONTACT_HREF } from "@/lib/site-config";

export default async function PurchaseNoticePage({ params }: { params: Promise<{ locale: string }> }) {
  const en = (await params).locale === "en";
  const { months, priceFen } = seasonPassOffer();
  return <LegalPage title={en ? "Purchase terms" : "购买须知"} versionLabel={en ? "Version" : "版本"} version={PURCHASE_TERMS_VERSION}
    intro={en ? "Review the scope and terms of your Exam Season Pass before paying." : "付款前请确认考季卡的权益范围和购买规则。"}>
    <section>
      <h2>{en ? "Price and access" : "价格和权益"}</h2>
      <p>{en ? `¥${priceFen / 100} for ${months} calendar months. Includes A Level, competitions, university admissions tests and personal statement practice. Interviews are in development.` : `¥${priceFen / 100}，${months} 个自然月。包含 A Level、竞赛、大学入学考试和文书练习。面试功能开发中。`}</p>
      <p>{en ? "A purchase during active access extends the current expiry. After expiry, access starts when payment succeeds. Dates follow Beijing time." : "有效期内购买从现有到期时间延长。到期后购买从付款成功时开始。有效期按北京时间计算。"}</p>
    </section>
    <section>
      <h2>{en ? "Payments and renewal" : "付款与续费"}</h2>
      <p>{en ? "The pass is a digital service. Purchases are non-refundable, subject to applicable rights and service availability. Mianbaoduo Pay processes payment. We will remind you before expiry. Each renewal requires your agreement and a new payment." : "考季卡为数字服务，售出后不退款。适用法律另有规定或服务无法提供的情形按适用规则处理。支付由面包多 Pay 处理。到期前会提醒你，每次续费都需你重新同意并付款，不会自动扣款。"}</p>
    </section>
    <section>
      <h2>{en ? "AI feedback" : "AI 反馈"}</h2>
      <p>{en ? "The default daily allowance is 20 feedback actions in total, including up to 10 photo reviews and 3 personal statement reviews. It resets at midnight Beijing time. When AI is enabled and you have consented, submitted work is sent to DeepSeek to generate feedback." : "默认每天合计 20 次，其中拍照批改最多 10 次，文书批改最多 3 次，北京时间零点重置。AI 启用且你已同意后，提交的作答会发送给 DeepSeek 生成反馈。"}</p>
      <p>{en ? "AI feedback is for practice only and is not human or official marking. The service does not guarantee scores, admission or awards." : "AI 反馈仅供练习参考，不是人工或官方评分。平台不承诺分数、录取或获奖。"}</p>
    </section>
    <section><h2>{en ? "Contact" : "联系方式"}</h2><p><a href={PUBLIC_CONTACT_HREF} className="underline">{PUBLIC_CONTACT_EMAIL}</a></p></section>
  </LegalPage>;
}
