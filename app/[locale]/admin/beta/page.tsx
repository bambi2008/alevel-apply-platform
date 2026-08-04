import { getBetaAnalytics } from "@/lib/admin/beta-analytics";

function date(value: Date | null) {
  return value
    ? new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", month: "2-digit", day: "2-digit" }).format(value)
    : "-";
}

function rate(value: number, total: number) {
  return total ? `${value} · ${Math.round((value / total) * 100)}%` : "0 · -";
}

export default async function BetaAnalyticsPage() {
  const data = await getBetaAnalytics();
  const total = data.funnel.registered;
  const cards = [
    ["注册", `${total}`],
    ["档案完成", rate(data.funnel.profileCompleted, total)],
    ["完成诊断", rate(data.funnel.diagnostic, total)],
    ["首次练习", rate(data.funnel.firstPractice, total)],
    ["首次整卷", rate(data.funnel.firstMock, total)],
    ["7日回访", rate(data.funnel.sevenDayReturn, total)],
    ["完成补弱", rate(data.funnel.remediation, total)],
    ["可测学习增益", data.funnel.averageGain == null ? `${data.funnel.measuredGain} 人` : `${data.funnel.measuredGain} 人 · ${data.funnel.averageGain >= 0 ? "+" : ""}${data.funnel.averageGain}pp`],
  ];
  const aiCost = data.ai.estimatedCostMicros == null
    ? "未配置单价"
    : `$${(data.ai.estimatedCostMicros / 1_000_000).toFixed(2)}`;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-bold text-neutral-950">Beta 学生数据</h1>
        <p className="mt-1 text-sm text-neutral-500">服务器事件口径，更新时间 {data.generatedAt.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</p>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="border border-neutral-200 bg-white p-4">
            <p className="text-xs text-neutral-500">{label}</p>
            <p className="mt-1 text-xl font-bold tabular-nums text-neutral-950">{value}</p>
          </div>
        ))}
      </section>

      <section className="border-y border-neutral-200 py-4">
        <div className="mb-3">
          <h2 className="font-semibold text-neutral-950">AI 评分运行质量</h2>
          <p className="mt-1 text-xs text-neutral-500">近 {data.ai.periodDays} 天，按每次评分请求记录双评、裁决、Token、延迟与失败原因。</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-4">
          <div><span className="text-xs text-neutral-500">成功率</span><strong className="mt-1 block text-lg tabular-nums">{data.ai.successRate == null ? "-" : `${data.ai.successRate}%`}</strong><small className="text-neutral-500">{data.ai.succeeded}/{data.ai.evaluations} 次</small></div>
          <div><span className="text-xs text-neutral-500">失败 / 超时</span><strong className="mt-1 block text-lg tabular-nums">{data.ai.failed} / {data.ai.timedOut}</strong><small className="text-neutral-500">滞留任务 {data.ai.staleRunning}</small></div>
          <div><span className="text-xs text-neutral-500">平均延迟</span><strong className="mt-1 block text-lg tabular-nums">{data.ai.averageLatencyMs == null ? "-" : `${(data.ai.averageLatencyMs / 1000).toFixed(1)}s`}</strong><small className="text-neutral-500">低置信度 {data.ai.lowConfidence}</small></div>
          <div><span className="text-xs text-neutral-500">Token / 估算成本</span><strong className="mt-1 block text-lg tabular-nums">{data.ai.totalTokens.toLocaleString("zh-CN")}</strong><small className="text-neutral-500">{aiCost}</small></div>
        </div>
      </section>

      <section>
        <div className="mb-3">
          <h2 className="font-semibold text-neutral-950">学生明细</h2>
          <p className="mt-1 text-xs text-neutral-500">学习增益采用同一考试的首次诊断（没有诊断时用首个有效成绩）与其后最新成绩之差。</p>
        </div>
        <div className="overflow-x-auto border-y border-neutral-200">
          <table className="w-full min-w-[1180px] text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500"><tr><th className="px-3 py-2">学生</th><th className="px-3 py-2">注册 / 活跃</th><th className="px-3 py-2">档案</th><th className="px-3 py-2">诊断</th><th className="px-3 py-2">练习</th><th className="px-3 py-2">整卷</th><th className="px-3 py-2">7日</th><th className="px-3 py-2">补弱</th><th className="px-3 py-2">考试 / 面试</th><th className="px-3 py-2">前后测</th></tr></thead>
            <tbody className="divide-y divide-neutral-100">
              {data.rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-3"><strong className="block text-neutral-900">{row.name}</strong><span className="block text-neutral-500">{row.account}</span><span className="block text-neutral-400">{row.school}</span></td>
                  <td className="px-3 py-3 tabular-nums">{date(row.registeredAt)} / {date(row.lastActiveAt)}</td>
                  <td className="px-3 py-3">{row.profileComplete ? "完成" : "待补"}</td>
                  <td className="px-3 py-3">{date(row.firstDiagnosticAt)}</td>
                  <td className="px-3 py-3">{date(row.firstPracticeAt)}</td>
                  <td className="px-3 py-3">{date(row.firstMockAt)}</td>
                  <td className="px-3 py-3">{row.returnedAfterSevenDays ? "已回访" : "-"}</td>
                  <td className="px-3 py-3 tabular-nums">{row.remediationCompleted}</td>
                  <td className="px-3 py-3 tabular-nums">{row.examSessions} / {row.interviewRecords}</td>
                  <td className="px-3 py-3">{row.gain ? `${row.gain.testId.toUpperCase()} ${row.gain.preScore}% → ${row.gain.postScore}% (${row.gain.delta >= 0 ? "+" : ""}${row.gain.delta}pp)` : "数据不足"}</td>
                </tr>
              ))}
              {data.rows.length === 0 && <tr><td colSpan={10} className="px-3 py-12 text-center text-neutral-400">暂无 Beta 学生</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
