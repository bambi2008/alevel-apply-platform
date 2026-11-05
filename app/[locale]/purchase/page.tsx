import Image from "next/image";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { PaymentCheckout } from "@/components/payment-checkout";
import { paymentOffer, PURCHASE_TERMS_VERSION } from "@/lib/payments/config";

export default async function PurchasePage({ params }: { params: Promise<{ locale: string }> }) {
  const [{ locale }, session, incoming] = await Promise.all([params, auth(), headers()]);
  const en = locale === "en";
  const offer = paymentOffer(session?.user);
  const agent = incoming.get("user-agent") ?? "";
  const embeddedWeChat = /MicroMessenger/i.test(agent);
  const mobile = /Mobile|Android|iPhone|iPad/i.test(agent);
  const checkoutUrl = offer.enabled ? new URL(`/${locale}/purchase`, process.env.APP_ORIGIN).href : null;
  const qr = offer.enabled && session && !mobile && checkoutUrl
    ? await QRCode.toDataURL(checkoutUrl, { width: 224, margin: 4 }) : null;

  return <section className="mx-auto max-w-3xl px-5 py-12">
    <h1 className="text-3xl font-semibold">{en ? "Exam Season Pass" : "考季卡"}</h1>
    <p className="mt-3 text-lg">{en ? `${offer.months} calendar months · ¥${offer.priceFen / 100}` : `${offer.months} 个自然月 · ¥${offer.priceFen / 100}`}</p>
    <p className="mt-3 text-sm leading-6">{en ? "Access to A Level, competitions, university admissions tests and personal statement practice. Interviews are in development." : "可使用 A Level、竞赛、大学入学考试和文书练习。面试功能开发中。"}</p>
    {offer.testPayment && <p className="mt-3 text-sm font-semibold">{en ? "Administrator payment test" : "管理员小额付款测试"}</p>}
    <div className="mt-6 border border-black/20 bg-white/50 p-4 text-sm leading-7">
      <p className="font-semibold">{en ? "The Exam Season Pass is a digital service. Purchases are non-refundable, subject to applicable rights and service availability." : "考季卡为数字服务，售出后不退款。适用法律另有规定或服务无法提供的情形按适用规则处理。"}</p>
      <p>{en ? "Your payment is one-time. We will remind you before expiry, and you can choose whether to renew." : "不会自动扣款。到期前我们会提醒你，你可以自己选择是否续费。"}</p>
      {offer.parentHint && <p>{en ? "We suggest asking a parent or guardian to pay." : "建议由家长或监护人付款。"}</p>}
    </div>
    {!offer.enabled ? <button className="btn btn-secondary mt-5" disabled>{en ? "Available once payments open" : "支付开通后可购买"}</button>
      : !session ? <Link className="btn btn-primary mt-5" href="/login?next=purchase">{en ? "Sign in to purchase" : "登录后购买"}</Link>
      : embeddedWeChat ? <p className="mt-5 text-sm" role="status">{en ? "Use WeChat's menu to open this page in your phone browser and continue." : "请使用微信右上角菜单，在手机浏览器中打开本页后继续。"}</p>
      : qr ? <div className="mt-5 space-y-3">
        <p className="text-sm">{en ? "Scan on your phone and sign in with the same account to pay." : "请用手机扫码打开本站，并登录同一账号付款。"}</p>
        <Image src={qr} width={224} height={224} unoptimized alt={en ? "QR code for the QiaoShen mobile purchase page" : "桥申手机购买页二维码"} />
        <a className="text-sm underline" href={checkoutUrl!}>{en ? "Mobile purchase link" : "手机购买链接"}</a>
      </div>
      : <PaymentCheckout locale={en ? "en" : "zh-CN"} priceFen={offer.priceFen} months={offer.months} termsVersion={PURCHASE_TERMS_VERSION} />}
    <Link className="mt-6 inline-block text-sm underline" href="/purchase/notice">{en ? "Read the purchase terms" : "查看购买须知"}</Link>
  </section>;
}
