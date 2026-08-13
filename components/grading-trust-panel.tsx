"use client";

import { Scale, ShieldCheck, TriangleAlert } from "lucide-react";
import type { GradeAssessment } from "@/lib/tests/grading";

const COPY = {
  high: {
    label: "高置信度",
    className: "border-green-300 bg-green-50 text-green-900",
    icon: ShieldCheck,
  },
  medium: {
    label: "中等置信度",
    className: "border-blue-300 bg-blue-50 text-blue-900",
    icon: Scale,
  },
  low: {
    label: "建议复核",
    className: "border-amber-300 bg-amber-50 text-amber-950",
    icon: TriangleAlert,
  },
} as const;

export function GradingTrustPanel({ assessment, compact = false }: {
  assessment: GradeAssessment;
  compact?: boolean;
}) {
  const copy = COPY[assessment.confidence];
  const Icon = copy.icon;
  return (
    <div className={`border-l-2 px-3 py-2 ${copy.className}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="inline-flex items-center gap-1 font-semibold">
          <Icon className="size-3.5" aria-hidden="true" />
          {copy.label}
        </span>
        <span>
          {assessment.method === "deterministic-empty"
            ? "规则评分"
            : assessment.method === "single-pass"
              ? "单轮评分"
              : assessment.method === "dual-pass-adjudicated"
                ? "双轮评分 + 分歧裁决"
                : "双轮独立评分"}
        </span>
        {assessment.passScores.length > 1 && (
          <span>阅卷分数 {assessment.passScores.join(" / ")} · 分差 {assessment.scoreDelta}</span>
        )}
        {assessment.passScores.length > 1 && <span>小问一致率 {assessment.agreementRate}%</span>}
      </div>
      {!compact && <p className="mt-1 text-xs leading-5 opacity-80">{assessment.rationale}</p>}
    </div>
  );
}
