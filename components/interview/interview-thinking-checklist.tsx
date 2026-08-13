import { Check } from "lucide-react";

export type InterviewThinkingStepId = "model" | "method" | "calculation" | "check" | "adapt";

export const INTERVIEW_THINKING_STEPS: { id: InterviewThinkingStepId; title: string; detail: string }[] = [
  { id: "model", title: "先说变量、假设和模型", detail: "先定义要研究什么，哪些条件暂时忽略。" },
  { id: "method", title: "说明为什么选这个方法", detail: "说出公式、定理或比较方法与题目的连接。" },
  { id: "calculation", title: "边算边解释每一步", detail: "让面试官听见关系式、代入和中间结论。" },
  { id: "check", title: "检查单位、数量级和合理性", detail: "算完主动检查方向、范围、单位和误差来源。" },
  { id: "adapt", title: "面对提示或变化时修正", detail: "新条件出现后，指出哪个假设改变并重新推进。" },
];

export function InterviewThinkingChecklist({
  emphasis = [],
  compact = false,
}: {
  emphasis?: InterviewThinkingStepId[];
  compact?: boolean;
}) {
  return (
    <section className={`border border-[var(--indigo)]/20 bg-[var(--info-bg)] ${compact ? "p-3" : "p-4"}`} aria-label="面试五步思考提醒">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--indigo)]">答题前先走五步</p>
        {emphasis.length > 0 && <span className="text-[11px] font-medium text-[var(--indigo)]">本题重点已标出</span>}
      </div>
      <div className={`mt-3 grid gap-2 ${compact ? "sm:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-5"}`}>
        {INTERVIEW_THINKING_STEPS.map((step, index) => {
          const active = emphasis.includes(step.id);
          return (
            <div key={step.id} className={`border-l-2 pl-2 ${active ? "border-[var(--indigo)] bg-white/70 py-1 pr-1" : "border-[var(--indigo)]/20"}`}>
              <div className="flex items-start gap-1.5"><span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${active ? "bg-[var(--indigo)] text-white" : "bg-white text-[var(--indigo)]"}`}>{active ? <Check className="size-2.5" /> : index + 1}</span><p className="text-xs font-semibold leading-snug text-[var(--ink)]">{step.title}</p></div>
              {!compact && <p className="mt-1 pl-5 text-[11px] leading-relaxed text-[var(--ink-soft)]">{step.detail}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
