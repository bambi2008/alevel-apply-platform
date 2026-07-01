import { getAdminStatsAction } from "@/lib/admin/actions";

export default async function AdminDashboardPage() {
  const s = await getAdminStatsAction();

  const cards: { label: string; value: number; hint?: string }[] = [
    { label: "用户总数", value: s.users, hint: `其中管理员 ${s.admins}` },
    { label: "申请记录", value: s.applications, hint: `已获 Offer ${s.offers}` },
    { label: "上传资料", value: s.documents },
    { label: "个人陈述", value: s.statements },
    { label: "待办事项", value: s.tasks },
    { label: "笔试记录", value: s.examSessions },
    { label: "院校数量", value: s.universities },
    { label: "专业数量", value: s.programs },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">平台总览</h1>
      <p className="text-sm text-neutral-500 mb-6">关键数据一览。</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-neutral-200 bg-white p-4"
          >
            <p className="text-xs text-neutral-500">{c.label}</p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{c.value}</p>
            {c.hint && <p className="text-xs text-neutral-400 mt-0.5">{c.hint}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
