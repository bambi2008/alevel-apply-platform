import { AlertTriangle, BarChart3, BookOpenCheck, Database, FileStack, ShieldCheck, Users } from "lucide-react";
import { getQuestionAuditDashboardData } from "@/lib/tests/audit/server";
import { CalibrationWorkbench } from "@/components/admin/calibration-workbench";

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default async function QuestionAuditPage() {
  const data = await getQuestionAuditDashboardData();
  const { report, dataHealth, governance } = data;
  const coverage = report.totals.topicsTotal ? report.totals.topicsCovered / report.totals.topicsTotal : 0;
  const telemetryCoverage = dataHealth.answers ? dataHealth.telemetryAnswers / dataHealth.answers : 0;
  const metrics = [
    { label: "练习题", value: report.totals.questions, detail: `${report.totals.long} 道书面题`, icon: BookOpenCheck },
    { label: "固定套卷", value: report.totals.mockPapers, detail: `${report.totals.mockQuestionSlots} 个题位`, icon: FileStack },
    { label: "真实会话", value: dataHealth.sessions, detail: `${dataHealth.uniqueStudents} 位学生`, icon: Users },
    { label: "行为数据覆盖", value: percent(telemetryCoverage), detail: `${dataHealth.telemetryAnswers}/${dataHealth.answers} 次作答`, icon: Database },
  ];

  return (
    <div className="space-y-9">
      <header>
        <h1 className="text-xl font-bold text-neutral-950">题库质量与难度校准</h1>
        <p className="mt-1 text-sm text-neutral-500">结构审计、真实作答信号、题目质量告警与可回滚校准决策</p>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="题库运营摘要">
        {metrics.map(({ label, value, detail, icon: Icon }) => (
          <div key={label} className="rounded-md border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between text-neutral-500"><span className="text-xs font-medium">{label}</span><Icon className="size-4" /></div>
            <p className="mt-2 text-2xl font-semibold text-neutral-950">{value}</p>
            <p className="mt-1 text-xs text-neutral-500">{detail}</p>
          </div>
        ))}
      </section>

      <section className="border-y border-neutral-200 py-4" aria-label="人工审核覆盖">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-950"><ShieldCheck className="size-4" />人工质量签字</h2>
            <p className="mt-1 text-xs text-neutral-500">只有来源与版权清晰、且由两名不同管理员完成学科与教学审核的题目才计为已认证。</p>
          </div>
          <strong className="text-lg tabular-nums text-neutral-950">{governance.certified} / {governance.staticQuestions}</strong>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-neutral-600">
          <span>来源记录 <strong className="block text-base text-neutral-950">{governance.sourceRecorded}</strong></span>
          <span>版权许可 <strong className="block text-base text-neutral-950">{governance.rightsCleared}</strong></span>
          <span>双人签字 <strong className="block text-base text-neutral-950">{governance.dualReviewed}</strong></span>
        </div>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div><h2 className="text-base font-semibold text-neutral-950">全站考试覆盖</h2><p className="mt-0.5 text-xs text-neutral-500">题型、知识点、难度与固定套卷结构</p></div>
          <div className="flex gap-4 text-xs text-neutral-500"><span><BarChart3 className="mr-1 inline size-3.5" />知识点 {percent(coverage)}</span><span><AlertTriangle className="mr-1 inline size-3.5" />{report.totals.critical} 错误 / {report.totals.warning} 告警</span></div>
        </div>
        <div className="overflow-x-auto border-y border-neutral-200">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-neutral-50 text-xs text-neutral-500"><tr><th className="px-3 py-2.5">考试</th><th className="px-3 py-2.5">题量</th><th className="px-3 py-2.5">书面题</th><th className="px-3 py-2.5">知识点</th><th className="px-3 py-2.5">难度 1/2/3</th><th className="px-3 py-2.5">套卷</th><th className="px-3 py-2.5">状态</th></tr></thead>
            <tbody className="divide-y divide-neutral-100">{report.tests.map((test) => (
              <tr key={test.id} className="text-neutral-700"><td className="px-3 py-3 font-semibold text-neutral-950">{test.abbr}</td><td className="px-3 py-3 tabular-nums">{test.questions}</td><td className="px-3 py-3 tabular-nums">{test.long}</td><td className="px-3 py-3 tabular-nums">{test.topicsCovered}/{test.topicsTotal}</td><td className="px-3 py-3 tabular-nums">{test.difficulty[1]}/{test.difficulty[2]}/{test.difficulty[3]}</td><td className="px-3 py-3 tabular-nums">{test.mockPapers}</td><td className="px-3 py-3 text-emerald-700">{test.issues.critical || test.issues.warning ? `${test.issues.critical}/${test.issues.warning}` : "通过"}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <CalibrationWorkbench calibration={data.calibration} decisions={data.decisions} dataHealth={dataHealth} message={data.calibrationMessage} />
    </div>
  );
}
