import type { GradeResponse } from "@/lib/tests/grading";

export function HandwritingRecognitionNote({
  review,
  compact = false,
}: {
  review: GradeResponse["imageReview"];
  compact?: boolean;
}) {
  if (!review?.parts.length) return null;
  const total = review.parts.reduce((sum, part) => sum + part.imageCount, 0);
  const needsReview = review.parts.some((part) => part.confidence === "low" || part.unclear.length > 0);
  return (
    <details className={`border-l-2 px-3 py-2 ${needsReview ? "border-[var(--warning)] bg-[var(--warning-bg)]" : "border-[var(--success)] bg-[var(--success-bg)]"}`}>
      <summary className={`${compact ? "text-xs" : "text-sm"} cursor-pointer font-semibold text-[var(--ink)]`}>
        已读取 {total} 张手写照片{needsReview ? " · 有内容需要核对" : " · 字迹识别清晰"}
      </summary>
      <div className="mt-3 space-y-3">
        {review.parts.map((part) => (
          <div key={part.label} className={`${compact ? "text-xs" : "text-sm"} text-[var(--ink-soft)]`}>
            <div className="flex flex-wrap items-center gap-2 font-semibold text-[var(--ink)]">
              <span>{part.label}</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs">
                {part.confidence === "high" ? "高置信度" : part.confidence === "medium" ? "中等置信度" : "低置信度"}
              </span>
            </div>
            <pre className="mt-1 whitespace-pre-wrap font-sans leading-relaxed">{part.transcript || "未能可靠读取"}</pre>
            {part.unclear.length > 0 && <p className="mt-1 text-[var(--warning)]">请核对：{part.unclear.join("；")}</p>}
          </div>
        ))}
      </div>
    </details>
  );
}
