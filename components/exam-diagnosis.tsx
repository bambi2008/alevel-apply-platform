"use client";

import { AlertCircle, BookOpen, CheckCircle2, RotateCcw, SearchCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AnswerDiagnosis, SessionDiagnosis } from "@/lib/tests/diagnosis";
import type { Question } from "@/lib/tests/questions/types";
import { lessonHref, remediationHref } from "@/lib/tests/diagnosis";
import { forceFullNavigation } from "@/lib/navigation";

const TONE = {
  positive: "border-[var(--success)] bg-[var(--success-bg)] text-[var(--success)]",
  attention: "border-[var(--warning)] bg-[var(--warning-bg)] text-[var(--warning)]",
  priority: "border-[var(--danger)] bg-[var(--danger-bg)] text-[var(--danger)]",
};

export function DiagnosisSummary({ diagnosis }: { diagnosis: SessionDiagnosis }) {
  if (diagnosis.answers.length === 0) return null;

  return (
    <section className="mt-8 border-y border-[var(--border)] py-6 text-left">
      <div className="flex items-start gap-3">
        <SearchCheck className="mt-0.5 size-5 shrink-0 text-[var(--indigo)]" aria-hidden="true" />
        <div>
          <h2 className="font-bold">本次错因诊断</h2>
          <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">
            根据得分、用时、改答、回看和标记行为推断；这是复习线索，不是对能力的定性判断。
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)]">
        <DiagnosisMetric value={diagnosis.secureCount} label="稳定掌握" />
        <DiagnosisMetric value={diagnosis.attentionCount} label="需要巩固" />
        <DiagnosisMetric value={diagnosis.priorityCount} label="优先补救" />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {diagnosis.breakdown.map((item) => (
          <span key={item.code} className={`rounded border px-2.5 py-1 text-xs font-medium ${TONE[item.severity]}`}>
            {item.label} {item.count}
          </span>
        ))}
      </div>

      {diagnosis.recommendations.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold">下一轮怎么练</h3>
          <ol className="mt-2 space-y-2 text-sm text-[var(--ink-soft)]">
            {diagnosis.recommendations.map((item, index) => (
              <li key={item} className="flex gap-2">
                <span className="font-semibold text-[var(--indigo)]">{index + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
function DiagnosisMetric({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white px-3 py-4 text-center">
      <strong className="block text-2xl">{value}</strong>
      <span className="text-xs text-[var(--ink-faint)]">{label}</span>
    </div>
  );
}

export function QuestionDiagnosis({
  diagnosis,
  question,
  compact = false,
  returnTo,
}: {
  diagnosis: AnswerDiagnosis;
  question: Question;
  compact?: boolean;
  returnTo?: string;
}) {
  const Icon = diagnosis.severity === "positive" ? CheckCircle2 : AlertCircle;
  const addReturnTo = (href: string) => returnTo
    ? `${href}${href.includes("?") ? "&" : "?"}returnTo=${encodeURIComponent(returnTo)}`
    : href;
  return (
    <div className={`${compact ? "mt-3" : "mt-4"} border-l-2 pl-3 ${diagnosis.severity === "positive" ? "border-[var(--success)]" : diagnosis.severity === "priority" ? "border-[var(--danger)]" : "border-[var(--warning)]"}`}>
      <div className="flex items-center gap-2">
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span className="text-sm font-semibold">{diagnosis.label}</span>
      </div>
      <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">{diagnosis.evidence}</p>
      {diagnosis.severity !== "positive" && (
        <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium">
          <Link href={addReturnTo(lessonHref(question))} onClick={forceFullNavigation} className="inline-flex items-center gap-1 text-[var(--indigo)] hover:underline">
            <BookOpen className="size-3.5" aria-hidden="true" /> 补知识
          </Link>
          <Link href={addReturnTo(remediationHref(question))} onClick={forceFullNavigation} className="inline-flex items-center gap-1 text-[var(--indigo)] hover:underline">
            <RotateCcw className="size-3.5" aria-hidden="true" /> 练同类题
          </Link>
        </div>
      )}
    </div>
  );
}
