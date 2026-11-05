import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { paymentAdmin } from "@/lib/payments/admin";
import { extendMembershipAction } from "@/lib/payments/admin-actions";
import { isMembershipActive } from "@/lib/membership/policy";

export default async function AdminMembers({ params, searchParams }: {
  params: Promise<{ locale: string }>; searchParams: Promise<{ email?: string; result?: string }>;
}) {
  const [{ locale }, query, admin] = await Promise.all([params, searchParams, paymentAdmin()]);
  if (!admin) notFound();
  const en = locale === "en";
  const email = typeof query.email === "string" ? query.email.trim().slice(0, 200) : "";
  const [members, audit] = await Promise.all([
    db.user.findMany({
      where: email ? { email: { equals: email, mode: "insensitive" } } : { membership: { isNot: null } },
      select: { id: true, email: true, membership: true },
      orderBy: { createdAt: "desc" }, take: 50,
    }),
    db.auditLog.findMany({
      where: { action: "MEMBERSHIP_MANUAL_EXTENSION" }, orderBy: { createdAt: "desc" }, take: 20,
      select: { id: true, createdAt: true, actor: { select: { email: true } }, meta: true },
    }),
  ]);
  const date = new Intl.DateTimeFormat(en ? "en-GB" : "zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "medium", timeStyle: "short" });
  return <section>
    <h1 className="text-2xl font-semibold">{en ? "Memberships" : "会员管理"}</h1>
    <form className="my-5 flex flex-wrap items-end gap-3">
      <label className="text-sm">{en ? "Exact account email" : "完整账号邮箱"}<input name="email" type="email" className="input mt-1" defaultValue={email} /></label>
      <button className="btn btn-secondary">{en ? "Search" : "查询"}</button>
    </form>
    {query.result && <p className="my-4 text-sm" role="status">{query.result === "saved"
      ? (en ? "Membership updated and audit entry saved." : "会员权益已更新并写入审计记录。")
      : (en ? "Check the reason and the paid order belonging to this account." : "请核对原因和属于此账号的已付款订单。")}</p>}
    <div className="divide-y divide-black/15 border-y border-black/15">
      {members.map(member => <article className="py-4" key={member.id}>
        <h2 className="font-semibold">{member.email ?? (en ? "Account without email" : "未绑定邮箱的账号")}</h2>
        <p className="mt-1 text-sm text-neutral-600">{member.membership
          ? `${member.membership.plan === "trial" ? (en ? "Trial" : "体验") : en ? "Exam Season Pass" : "考季卡"} · ${isMembershipActive(member.membership) ? (en ? "Active" : "有效") : en ? "Inactive" : "已失效"} · ${date.format(member.membership.endsAt)}`
          : en ? "No membership" : "无会员权益"}</p>
        <details className="mt-3">
          <summary className="cursor-pointer text-sm underline">{en ? "Restore or extend membership" : "补开或延长权益"}</summary>
          <form className="mt-4 flex flex-wrap items-end gap-3" action={extendMembershipAction}>
            <input type="hidden" name="userId" value={member.id} /><input type="hidden" name="locale" value={locale} /><input type="hidden" name="requestId" value={randomUUID()} />
            <label className="text-sm">{en ? "Related paid order" : "关联已付订单号"}<input name="tradeNo" className="input mt-1" required pattern="qs[a-f0-9]{28}" /></label>
            <label className="text-sm">{en ? "Calendar months" : "自然月数"}<input name="months" className="input mt-1" type="number" min={1} max={36} defaultValue={3} required /></label>
            <label className="text-sm">{en ? "Reason" : "原因"}<input name="reason" className="input mt-1" minLength={5} maxLength={300} required /></label>
            <button className="btn btn-primary">{en ? "Save change" : "保存调整"}</button>
          </form>
        </details>
      </article>)}
      {!members.length && <p className="py-4 text-sm">{en ? "No matching accounts." : "没有匹配账号。"}</p>}
    </div>
    <h2 className="mt-8 font-semibold">{en ? "Recent membership adjustments" : "最近权益调整"}</h2>
    <ul className="mt-3 divide-y divide-black/15">
      {audit.map(entry => {
        const meta = entry.meta && typeof entry.meta === "object" && !Array.isArray(entry.meta) ? entry.meta : {};
        return <li key={entry.id} className="py-3 text-sm">
          <p>{date.format(entry.createdAt)} · {entry.actor?.email ?? "—"} · {String(meta.outTradeNo ?? "—")}</p>
          <p className="text-neutral-600">{String(meta.reason ?? "—")}</p>
        </li>;
      })}
    </ul>
  </section>;
}
