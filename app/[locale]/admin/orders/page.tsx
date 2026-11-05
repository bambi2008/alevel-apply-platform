import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { orderFilter, paymentAdmin, paymentRevenue } from "@/lib/payments/admin";

type Query = Record<string, string | string[] | undefined>;
const statuses = [["pending", "待确认", "Pending"], ["paid", "已付", "Paid"], ["failed", "失败", "Failed"], ["closed", "已关闭", "Closed"]] as const;

export default async function AdminOrders({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Query> }) {
  const [{ locale }, query, admin] = await Promise.all([params, searchParams, paymentAdmin()]);
  if (!admin) notFound();
  const en = locale === "en";
  const [rows, revenue] = await Promise.all([
    db.paymentOrder.findMany({
      where: orderFilter(query), orderBy: { createdAt: "desc" }, take: 100,
      select: { id: true, outTradeNo: true, amountFen: true, status: true, createdAt: true, testPayment: true,
        user: { select: { email: true } }, _count: { select: { complaints: true } } },
    }),
    paymentRevenue(),
  ]);
  const queryText = new URLSearchParams({ locale });
  for (const [key, value] of Object.entries(query)) if (typeof value === "string") queryText.set(key, value);
  const format = new Intl.DateTimeFormat(en ? "en-GB" : "zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "medium", timeStyle: "short" });
  const get = (key: string) => typeof query[key] === "string" ? query[key] : undefined;
  return <section>
    <h1 className="text-2xl font-semibold">{en ? "Orders" : "订单管理"}</h1>
    <p className="mt-3 text-sm">{en ? "Confirmed payments (Beijing time, excluding tests)" : "已确认收款（北京时间，测试单另计）"}</p>
    <p className="mt-2">{en ? "Today" : "今日"} ¥{(revenue.today / 100).toFixed(2)} · {en ? "This month" : "本月"} ¥{(revenue.month / 100).toFixed(2)}</p>
    <form className="my-6 flex flex-wrap items-end gap-3">
      <label className="text-sm">{en ? "Order number or email" : "订单号或邮箱"}<input className="input mt-1" name="q" defaultValue={get("q")} maxLength={200} /></label>
      <label className="text-sm">{en ? "From" : "起始日期"}<input className="input mt-1" name="from" type="date" defaultValue={get("from")} /></label>
      <label className="text-sm">{en ? "Through" : "结束日期"}<input className="input mt-1" name="through" type="date" defaultValue={get("through")} /></label>
      <label className="text-sm">{en ? "Status" : "状态"}<select className="input mt-1" name="status" defaultValue={get("status")}>
        <option value="">{en ? "All" : "全部"}</option>{statuses.map(([id, zh, english]) => <option key={id} value={id}>{en ? english : zh}</option>)}
      </select></label>
      <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" name="complaints" value="1" defaultChecked={get("complaints") === "1"} />{en ? "Complaints" : "有投诉"}</label>
      <button className="btn btn-secondary">{en ? "Filter" : "筛选"}</button>
    </form>
    <a className="inline-flex min-h-11 items-center text-sm underline" href={`/api/admin/orders?${queryText}`} download>{en ? "Export orders CSV" : "导出订单 CSV"}</a>
    <div className="mt-2 overflow-x-auto">
      <table className="w-full whitespace-nowrap text-left text-sm">
        <thead><tr>{(en ? ["Order", "Account", "Amount", "Status", "Created"] : ["订单", "账号", "金额", "状态", "创建时间"]).map(title => <th key={title} className="p-3">{title}</th>)}</tr></thead>
        <tbody>{rows.map(row => <tr key={row.id} className="border-t border-black/15">
          <th scope="row" className="p-3"><Link className="underline" href={`/admin/orders/${row.id}`}>{row.outTradeNo}</Link></th>
          <td className="p-3">{row.user?.email ?? "—"}</td><td className="p-3">¥{(row.amountFen / 100).toFixed(2)}</td>
          <td className="p-3">{statuses.find(([id]) => id === row.status)?.[en ? 2 : 1]}{row.testPayment && (en ? " · Test" : " · 测试")}
            {row._count.complaints > 0 && <span className="ml-2 font-semibold text-red-800">{en ? "Complaint" : "投诉"}</span>}</td>
          <td className="p-3">{format.format(row.createdAt)}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <p className="mt-4 text-sm text-neutral-600">{rows.length === 100 ? (en ? "Showing the latest 100 matches. Filter for more detail." : "显示最新 100 条匹配记录，可继续缩小筛选范围。") : !rows.length ? (en ? "No matching orders." : "没有匹配订单。") : ""}</p>
  </section>;
}
