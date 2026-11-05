import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { paymentAdmin } from "@/lib/payments/admin";
import { saveAiFeedbackLimits } from "@/lib/ai/settings-action";
import { DEFAULT_FEEDBACK_LIMITS } from "@/lib/ai/feedback-quota";
import { beijingDay, DAY_MS } from "@/lib/beijing-time";

export default async function AiFeedbackSettingsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>; searchParams: Promise<{ result?: string }>;
}) {
  const [{ locale }, { result }, admin] = await Promise.all([params, searchParams, paymentAdmin()]);
  if (!admin) notFound();
  const en = locale === "en";
  const now = new Date();
  const end = beijingDay(now).end;
  const weekStart = new Date(+end - 7 * DAY_MS);
  const [settings, usage, feedback] = await Promise.all([
    db.aiFeedbackSettings.findUnique({ where: { id: "daily" } }),
    db.aiEvaluation.groupBy({ where: { createdAt: { gte: weekStart, lte: now } }, by: ["route", "status"],
      _sum: { providerCalls: true, totalTokens: true }, _count: { _all: true } }),
    db.aiFeedbackUse.count({ where: { createdAt: { gte: weekStart, lte: now }, completedAt: { not: null } } }),
  ]);
  const limits = settings ?? DEFAULT_FEEDBACK_LIMITS;
  return <section>
    <h1 className="text-2xl font-semibold">{en ? "AI feedback settings" : "AI 批改设置"}</h1>
    <p className="mt-3 text-sm">{en ? "Daily limits apply to all accounts and reset at midnight Beijing time. Updates apply to the next request." : "每日额度适用于所有账号，北京时间零点重置。修改从下一次请求起生效。"}</p>
    <form className="mt-5 flex flex-wrap items-end gap-3" action={saveAiFeedbackLimits}>
      <input type="hidden" name="locale" value={locale} />
      {([["total", "合计", "Total"], ["photo", "拍照", "Photo"], ["statement", "文书", "Personal statement"]] as const).map(([key, zh, english]) =>
        <label key={key} className="text-sm">{en ? english : zh}<input className="input mt-1" required type="number" min={0} max={1_000} name={key} defaultValue={limits[key]} /></label>)}
      <button className="btn btn-primary">{en ? "Save limits" : "保存上限"}</button>
    </form>
    {result && <p role="status" className="mt-4 text-sm">{result === "saved" ? (en ? "Limits updated." : "已更新上限。")
      : (en ? "Each category limit must be within the total." : "拍照和文书上限不能超过合计上限。")}</p>}
    <h2 className="mt-8 font-semibold">{en ? "Usage over the last 7 Beijing dates" : "近 7 个北京时间日期的用量"}</h2>
    <p className="mt-2 text-sm">{en ? "Completed feedback actions" : "已完成批改次数"} {feedback}</p>
    <div className="mt-4 overflow-x-auto"><table className="w-full whitespace-nowrap text-left text-sm">
      <thead><tr>{(en ? ["Feature", "Status", "Requests", "Provider calls", "Known tokens"] : ["功能", "状态", "请求", "模型调用", "已知 Token"]).map(label => <th key={label} className="p-3">{label}</th>)}</tr></thead>
      <tbody>{usage.map(row => <tr key={`${row.route}:${row.status}`} className="border-t border-black/15">
        <td className="p-3">{row.route}</td><td className="p-3">{row.status}</td><td className="p-3">{row._count._all}</td>
        <td className="p-3">{row._sum.providerCalls ?? 0}</td><td className="p-3">{row._sum.totalTokens ?? "—"}</td>
      </tr>)}</tbody>
    </table></div>
  </section>;
}
