import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { paymentAdmin } from "@/lib/payments/admin";
import { Link } from "@/i18n/navigation";

export default async function AdminOrderDetail({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const [{ locale, id }, admin] = await Promise.all([params, paymentAdmin()]);
  if (!admin) notFound();
  const order = id.length <= 100 && await db.paymentOrder.findUnique({
    where: { id }, include: { complaints: { orderBy: { createdAt: "desc" } }, user: { select: { email: true } } },
  });
  if (!order) notFound();
  const en = locale === "en";
  const date = new Intl.DateTimeFormat(en ? "en-GB" : "zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "medium", timeStyle: "short" });
  const labels = en ? { pending: "Pending", paid: "Paid", failed: "Failed", closed: "Closed" }
    : { pending: "待确认", paid: "已付", failed: "失败", closed: "已关闭" };
  return <section className="max-w-3xl">
    <Link href="/admin/orders" className="inline-flex min-h-11 items-center text-sm underline">{en ? "All orders" : "返回订单列表"}</Link>
    <h1 className="break-all text-2xl font-semibold">{order.outTradeNo}</h1>
    <dl className="mt-5 grid grid-cols-[auto_1fr] gap-3 text-sm">
      {[
        [en ? "Account" : "账号", order.user?.email],
        [en ? "Status" : "状态", labels[order.status]],
        [en ? "Amount" : "金额", `¥${(order.amountFen / 100).toFixed(2)}`],
        [en ? "Agreed (Beijing time)" : "同意时间（北京时间）", date.format(order.agreedAt)],
        [en ? "Agreement version" : "协议版本", order.termsVersion],
        [en ? "Provider charge" : "支付流水", order.providerChargeId],
        [en ? "Payment confirmed" : "确认付款", order.paidAt && date.format(order.paidAt)],
        [en ? "Expiry when credited" : "开通时到期日", order.membershipEndsAt && date.format(order.membershipEndsAt)],
      ].map(([key, value]) => <div key={key} className="contents"><dt className="font-semibold">{key}</dt><dd className="break-all">{value ?? "—"}</dd></div>)}
    </dl>
    {order.complaints.map(complaint => <article key={complaint.id} className="mt-6 border border-red-800/30 p-4">
      <h2 className="font-semibold text-red-800">{en ? "Payment complaint" : "支付投诉"}</h2>
      <p className="mt-2 whitespace-pre-wrap break-words text-sm">{complaint.detail}</p>
      {complaint.payerPhone && <p className="mt-2 text-sm">{en ? "Payer phone" : "付款人电话"} {complaint.payerPhone}</p>}
      <time dateTime={complaint.createdAt.toISOString()} className="mt-2 block text-sm">{date.format(complaint.createdAt)}</time>
    </article>)}
  </section>;
}
