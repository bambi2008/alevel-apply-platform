"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ENGLISH_REQUIREMENTS } from "@/lib/english/requirements";
import {
  analyseIeltsReadiness,
  buildIeltsTimeline,
  type IeltsScores,
} from "@/lib/english/planner";
import { loadProfile, saveIeltsScores } from "@/lib/profile/store";

const SKILLS = [
  { id: "listening", label: "听力", topic: "ielts-listening", action: "先用官方音频做完整段落，再用文字稿标出漏听、改口和拼写错误。" },
  { id: "reading", label: "阅读", topic: "ielts-reading", action: "按题型限时训练，强制为每个答案标出文本证据和同义替换。" },
  { id: "writing", label: "写作", topic: "ielts-writing", action: "交替完成 Task 1 与 Task 2，按四项量表定位反复失分点并重写。" },
  { id: "speaking", label: "口语", topic: "", action: "进行 11–14 分钟连续模拟，复盘流利度、展开、语法准确性和自然修正。" },
] as const;

export function EnglishPrepCenter() {
  const [targetId, setTargetId] = useState("oxford-standard");
  const [scores, setScores] = useState<IeltsScores>({
    listening: 6.5,
    reading: 6.5,
    writing: 6,
    speaking: 6.5,
  });
  const [testDate, setTestDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const target = ENGLISH_REQUIREMENTS.find((item) => item.id === targetId) ?? ENGLISH_REQUIREMENTS[0];

  useEffect(() => {
    void loadProfile().then((profile) => {
      const saved = profile?.ieltsSubscores;
      if (!saved) return;
      setScores((current) => ({
        listening: saved.listening ?? current.listening,
        reading: saved.reading ?? current.reading,
        writing: saved.writing ?? current.writing,
        speaking: saved.speaking ?? current.speaking,
      }));
    });
    try {
      const planning = JSON.parse(window.localStorage.getItem("alevel:ielts-plan:v1") ?? "{}") as {
        targetId?: string;
        testDate?: string;
        deadline?: string;
      };
      if (planning.targetId) setTargetId(planning.targetId);
      if (planning.testDate) setTestDate(planning.testDate);
      if (planning.deadline) setDeadline(planning.deadline);
    } catch {
      // Ignore malformed local planning data.
    }
  }, []);

  const analysis = useMemo(
    () => analyseIeltsReadiness(scores, target),
    [scores, target],
  );
  const weakest = SKILLS.find((skill) => skill.id === analysis.weakest)!;
  const timeline = useMemo(
    () => buildIeltsTimeline(new Date().toISOString().slice(0, 10), testDate, deadline),
    [deadline, testDate],
  );

  async function savePlan() {
    setSaveState("saving");
    await saveIeltsScores(analysis.overall, scores);
    window.localStorage.setItem("alevel:ielts-plan:v1", JSON.stringify({
      targetId,
      testDate,
      deadline,
    }));
    setSaveState("saved");
    window.setTimeout(() => setSaveState("idle"), 1800);
  }

  return (
    <div className="space-y-10">
      <section className="border-y border-[var(--border)] py-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--ink)]">目标与分差规划器</h2>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">选择院校基线并录入最近一次四项成绩。总分为训练估算，正式结果以 IELTS 报告为准。</p>
          </div>
          <label className="block min-w-[260px] text-sm font-medium text-[var(--ink)]">
            目标要求
            <select
              value={targetId}
              onChange={(event) => setTargetId(event.target.value)}
              className="mt-1 block h-10 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm"
            >
              {ENGLISH_REQUIREMENTS.map((item) => (
                <option key={item.id} value={item.id}>{item.institution} · {item.overall}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SKILLS.map((skill) => (
              <label key={skill.id} className="border border-[var(--border)] bg-white p-3 text-sm font-medium text-[var(--ink)]">
                {skill.label}
                <input
                  type="number"
                  min="0"
                  max="9"
                  step="0.5"
                  value={scores[skill.id]}
                  onChange={(event) => setScores((current) => ({
                    ...current,
                    [skill.id]: Math.max(0, Math.min(9, Number(event.target.value))),
                  }))}
                  className="mt-2 h-10 w-full rounded-md border border-[var(--border)] px-2 text-lg font-semibold"
                />
              </label>
            ))}
          </div>

          <div className="border-l-4 border-[var(--indigo)] bg-[var(--info-bg)] p-4">
            <p className="text-xs font-semibold uppercase text-[var(--indigo)]">当前判断</p>
            <p className="mt-1 text-2xl font-bold text-[var(--ink)]">估算总分 {analysis.overall.toFixed(1)}</p>
            <p className={`mt-2 text-sm font-semibold ${analysis.ready ? "text-[var(--success)]" : "text-[var(--warning)]"}`}>
              {analysis.ready ? "已达到所选基线" : `尚差：总分 ${analysis.overallGap.toFixed(1)} / 最弱单项 ${analysis.componentGaps[analysis.weakest].toFixed(1)}`}
            </p>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              优先项：{weakest.label}（{scores[analysis.weakest].toFixed(1)}）
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 border-t border-[var(--border)] pt-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="text-sm font-medium text-[var(--ink)]">
            下一次考试日期
            <input type="date" value={testDate} onChange={(event) => setTestDate(event.target.value)} className="input mt-1 h-10 w-full" />
          </label>
          <label className="text-sm font-medium text-[var(--ink)]">
            Offer / 语言条件截止日
            <input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} className="input mt-1 h-10 w-full" />
          </label>
          <button type="button" onClick={savePlan} disabled={saveState === "saving"} className="btn btn-primary h-10">
            {saveState === "saved" ? "已保存" : saveState === "saving" ? "保存中…" : "保存成绩与计划"}
          </button>
        </div>
      </section>

      <section className="border-y border-[var(--border)] py-6">
        <h2 className="text-xl font-bold text-[var(--ink)]">语言条件兑现与重考决策</h2>
        <div className="mt-4 grid gap-px bg-[var(--border)] lg:grid-cols-3">
          <div className="bg-white p-4">
            <p className="text-xs font-semibold uppercase text-[var(--ink-faint)]">条件差距</p>
            <p className="mt-2 font-bold text-[var(--ink)]">
              {analysis.ready
                ? "当前四项均达到所选基线"
                : `未达标：${analysis.belowTarget.map((skill) => SKILLS.find((item) => item.id === skill)?.label).join("、") || "总分"}`}
            </p>
            <p className="mt-1 text-xs text-[var(--ink-soft)]">总分差 {analysis.overallGap.toFixed(1)}；以课程页和正式 Offer 原文为准。</p>
          </div>
          <div className="bg-white p-4">
            <p className="text-xs font-semibold uppercase text-[var(--ink-faint)]">重考建议</p>
            <p className="mt-2 font-bold text-[var(--ink)]">
              {analysis.recommendation === "ready"
                ? "暂不需要安排重考"
                : analysis.recommendation === "verify-one-skill-retake"
                  ? `先核实 ${weakest.label} One Skill Retake`
                  : "优先安排完整 IELTS 重考"}
            </p>
            <p className="mt-1 text-xs text-[var(--ink-soft)]">
              One Skill Retake 是否被学校、课程及签证路径接受必须逐项核实，平台不默认认可。
            </p>
          </div>
          <div className="bg-white p-4">
            <p className="text-xs font-semibold uppercase text-[var(--ink-faint)]">时间窗口</p>
            <p className="mt-2 font-bold text-[var(--ink)]">
              {timeline.daysToTest === null ? "录入日期后生成倒计时" : `距考试 ${timeline.daysToTest} 天`}
            </p>
            <p className={`mt-1 text-xs ${timeline.warning === "none" ? "text-[var(--ink-soft)]" : "text-[var(--danger)]"}`}>
              {timeline.warning === "test-date-passed"
                ? "考试日期已过，请更新下一场安排。"
                : timeline.warning === "result-window-tight"
                  ? `考试后距截止日仅 ${timeline.daysFromTestToDeadline} 天，出分或复议窗口偏紧。`
                  : timeline.daysFromTestToDeadline === null
                    ? "建议为出分、复议和再次报考预留缓冲。"
                    : `考试后距截止日 ${timeline.daysFromTestToDeadline} 天。`}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-[var(--ink)]">四项训练路径</h2>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">先补最弱单项，再用短诊断检查迁移；不要只刷最擅长的一项。</p>
          </div>
          <Link href="/tests/ielts/paper/ielts-reading-full-1" className="btn btn-primary">开始全长 Reading</Link>
        </div>
        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {SKILLS.map((skill) => (
            <div key={skill.id} className="grid gap-3 py-4 sm:grid-cols-[110px_minmax(0,1fr)_auto] sm:items-center">
              <div>
                <p className="font-semibold text-[var(--ink)]">{skill.label}</p>
                <p className="text-xs text-[var(--ink-faint)]">当前 {scores[skill.id].toFixed(1)}</p>
              </div>
              <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{skill.action}</p>
              {skill.id === "speaking" ? (
                <Link href="/interview/ielts-speaking" className="btn btn-secondary text-sm">进入口语模拟</Link>
              ) : skill.id === "listening" ? (
                <a
                  href="https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary text-sm"
                >
                  官方音频样题
                </a>
              ) : (
                <Link href={`/tests/ielts/practice?topic=${skill.topic}`} className="btn btn-secondary text-sm">专项练习</Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[var(--ink)]">全长固定机考卷</h2>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">四个模块分别计时与存档，便于单项重考和定位分差；Speaking 采用打字模拟，发音另行复盘。</p>
        <div className="mt-4 grid gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/tests/ielts/paper/ielts-listening-full-1" className="bg-white p-4 hover:bg-[var(--surface)]">
            <strong className="block text-[var(--ink)]">Listening</strong>
            <span className="mt-1 block text-xs text-[var(--ink-soft)]">4 节 · 40 题 · 30 分钟 · 一次性录音</span>
          </Link>
          <Link href="/tests/ielts/paper/ielts-reading-full-1" className="bg-white p-4 hover:bg-[var(--surface)]">
            <strong className="block text-[var(--ink)]">Academic Reading</strong>
            <span className="mt-1 block text-xs text-[var(--ink-soft)]">4 篇 · 40 题 · 60 分钟</span>
          </Link>
          <Link href="/tests/ielts/paper/ielts-written-full-1" className="bg-white p-4 hover:bg-[var(--surface)]">
            <strong className="block text-[var(--ink)]">Academic Writing</strong>
            <span className="mt-1 block text-xs text-[var(--ink-soft)]">Task 1 + Task 2 · 60 分钟 · AI 量表反馈</span>
          </Link>
          <Link href="/interview/ielts-speaking" className="bg-white p-4 hover:bg-[var(--surface)]">
            <strong className="block text-[var(--ink)]">Speaking</strong>
            <span className="mt-1 block text-xs text-[var(--ink-soft)]">3 套 · Part 1–3 · 计时与整场复盘</span>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[var(--ink)]">院校英语基线</h2>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">这是申请规划基线，不替代课程页面、语言豁免规则或个人 Offer。</p>
        <div className="mt-4 overflow-x-auto border border-[var(--border)]">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="bg-[var(--surface)] text-[var(--ink-soft)]">
              <tr>
                <th className="px-4 py-3 font-semibold">院校</th>
                <th className="px-4 py-3 font-semibold">总分</th>
                <th className="px-4 py-3 font-semibold">单项</th>
                <th className="px-4 py-3 font-semibold">说明</th>
                <th className="px-4 py-3 font-semibold">来源</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {ENGLISH_REQUIREMENTS.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-[var(--ink)]">{item.institution}</td>
                  <td className="px-4 py-3">{item.overall.toFixed(1)}</td>
                  <td className="px-4 py-3">{item.component ? `${item.component.toFixed(1)}+` : "一般未统一列出"}</td>
                  <td className="max-w-md px-4 py-3 text-[var(--ink-soft)]">{item.note}</td>
                  <td className="px-4 py-3">
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="font-medium text-[var(--indigo)] hover:underline">
                      官网 · {item.checkedAt}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
