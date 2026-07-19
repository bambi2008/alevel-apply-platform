import { AlertTriangle, BarChart3, BookOpenCheck, FileStack } from "lucide-react";
import { getQuestionAuditDashboardData } from "@/lib/tests/audit/server";

const issueLabels: Record<string, string> = {
  DUPLICATE_PROMPT: "重复题面",
  EMPTY_TOPIC: "空知识点",
  MISSING_DIFFICULTY_LEVEL: "缺少难度层级",
  MISSING_FIXED_WRITTEN_PAPER: "缺少固定书面套卷",
  MISSING_WRITTEN_PRACTICE: "缺少书面练习",
  TEST_DIFFICULTY_SKEW: "整体难度失衡",
  TOPIC_IMBALANCE: "知识点题量失衡",
};

const calibrationLabels = {
  insufficient: "样本不足",
  "in-range": "符合标注",
  "easier-than-label": "实际偏易",
  "harder-than-label": "实际偏难",
};

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default async function QuestionAuditPage() {
  const { report, calibration, calibrationAvailable, calibrationMessage } =
    await getQuestionAuditDashboardData();
  const calibrated = calibration.filter((item) => item.status !== "insufficient");
  const anomalies = calibrated.filter((item) => item.status !== "in-range");
  const coverage = report.totals.topicsTotal
    ? report.totals.topicsCovered / report.totals.topicsTotal
    : 0;

  const metrics = [
    { label: "练习题", value: report.totals.questions, detail: `${report.totals.long} 道书面题`, icon: BookOpenCheck },
    { label: "固定套卷", value: report.totals.mockPapers, detail: `${report.totals.mockQuestionSlots} 个题位`, icon: FileStack },
    { label: "知识点覆盖", value: percent(coverage), detail: `${report.totals.topicsCovered}/${report.totals.topicsTotal}`, icon: BarChart3 },
    { label: "待处理告警", value: report.totals.warning, detail: `${report.totals.critical} 个阻断错误`, icon: AlertTriangle },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-xl font-bold text-neutral-950">题库质量审计</h1>
        <p className="mt-1 text-sm text-neutral-500">结构合规、覆盖缺口与真实作答难度校准</p>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="题库审计摘要">
        {metrics.map(({ label, value, detail, icon: Icon }) => (
          <div key={label} className="rounded-md border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-medium">{label}</span>
              <Icon className="size-4" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-neutral-950">{value}</p>
            <p className="mt-1 text-xs text-neutral-500">{detail}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-950">考试覆盖</h2>
            <p className="mt-0.5 text-xs text-neutral-500">按考试检查题型、知识点、难度和固定套卷</p>
          </div>
          <span className="text-xs text-neutral-500">共 {report.totals.tests} 项考试</span>
        </div>
        <div className="overflow-x-auto border-y border-neutral-200">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-neutral-50 text-xs text-neutral-500">
              <tr>
                <th className="px-3 py-2.5 font-medium">考试</th>
                <th className="px-3 py-2.5 font-medium">题量</th>
                <th className="px-3 py-2.5 font-medium">书面题</th>
                <th className="px-3 py-2.5 font-medium">知识点</th>
                <th className="px-3 py-2.5 font-medium">难度 1/2/3</th>
                <th className="px-3 py-2.5 font-medium">套卷</th>
                <th className="px-3 py-2.5 font-medium">固定书面卷</th>
                <th className="px-3 py-2.5 font-medium">告警</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {report.tests.map((test) => (
                <tr key={test.id} className="text-neutral-700">
                  <td className="px-3 py-3 font-semibold text-neutral-950">{test.abbr}</td>
                  <td className="px-3 py-3 tabular-nums">{test.questions}</td>
                  <td className="px-3 py-3 tabular-nums">{test.long}</td>
                  <td className="px-3 py-3 tabular-nums">{test.topicsCovered}/{test.topicsTotal}</td>
                  <td className="px-3 py-3 tabular-nums">{test.difficulty[1]}/{test.difficulty[2]}/{test.difficulty[3]}</td>
                  <td className="px-3 py-3 tabular-nums">{test.mockPapers}</td>
                  <td className="px-3 py-3 tabular-nums">{test.fixedWrittenPapers}</td>
                  <td className="px-3 py-3">
                    <span className={test.issues.warning ? "font-medium text-amber-700" : "text-emerald-700"}>
                      {test.issues.critical ? `${test.issues.critical} 错误` : `${test.issues.warning} 告警`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-950">优先修复清单</h2>
        <p className="mt-0.5 text-xs text-neutral-500">阻断错误优先，其次处理内容覆盖和格式缺口</p>
        <div className="mt-3 divide-y divide-neutral-100 border-y border-neutral-200">
          {report.issues.length === 0 ? (
            <p className="px-3 py-5 text-sm text-emerald-700">当前没有审计问题。</p>
          ) : report.issues.map((issue, index) => (
            <div key={`${issue.code}-${issue.questionId ?? issue.topicId ?? issue.testId}-${index}`} className="grid gap-1 px-3 py-3 sm:grid-cols-[150px_100px_1fr] sm:items-center">
              <span className={issue.severity === "critical" ? "text-xs font-semibold text-red-700" : "text-xs font-semibold text-amber-700"}>
                {issue.severity === "critical" ? "阻断" : "告警"} · {issue.testId?.toUpperCase()}
              </span>
              <span className="text-xs text-neutral-500">{issueLabels[issue.code] ?? issue.code}</span>
              <span className="text-sm text-neutral-700">{issue.message}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-neutral-950">真实难度校准</h2>
            <p className="mt-0.5 text-xs text-neutral-500">至少 10 次作答后，比较实际得分率与标注难度区间</p>
          </div>
          {calibrationAvailable && (
            <span className="text-xs text-neutral-500">{anomalies.length}/{calibrated.length} 道题需要复核</span>
          )}
        </div>
        {!calibrationAvailable ? (
          <p className="mt-3 border-y border-neutral-200 px-3 py-5 text-sm text-neutral-500">{calibrationMessage}</p>
        ) : calibration.length === 0 ? (
          <p className="mt-3 border-y border-neutral-200 px-3 py-5 text-sm text-neutral-500">尚无答题记录，积累样本后会自动生成校准结果。</p>
        ) : (
          <div className="mt-3 overflow-x-auto border-y border-neutral-200">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-neutral-50 text-xs text-neutral-500">
                <tr>
                  <th className="px-3 py-2.5 font-medium">题目</th>
                  <th className="px-3 py-2.5 font-medium">考试 / 知识点</th>
                  <th className="px-3 py-2.5 font-medium">标注</th>
                  <th className="px-3 py-2.5 font-medium">样本</th>
                  <th className="px-3 py-2.5 font-medium">实际得分率</th>
                  <th className="px-3 py-2.5 font-medium">结果</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {calibration.slice(0, 100).map((item) => (
                  <tr key={item.questionId} className="text-neutral-700">
                    <td className="px-3 py-3 font-mono text-xs text-neutral-950">{item.questionId}</td>
                    <td className="px-3 py-3">{item.testId.toUpperCase()} / {item.topicId}</td>
                    <td className="px-3 py-3">难度 {item.labelledDifficulty}</td>
                    <td className="px-3 py-3 tabular-nums">{item.attempts}</td>
                    <td className="px-3 py-3 tabular-nums">{percent(item.scoreRate)}</td>
                    <td className="px-3 py-3">{calibrationLabels[item.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
