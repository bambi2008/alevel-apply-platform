import { EXAM_SCOPE_NOTES, isLimitedTrainingTest } from "@/lib/tests/syllabus-release";
import { OFFICIAL_SYLLABUS_SOURCES } from "@/lib/tests/syllabus-policy";

export function ExamScopeNote({testId}:{testId:string}) {
  return <div className="my-4 text-sm text-[var(--muted)]">
    {isLimitedTrainingTest(testId) && <p role="note">范围受限训练 · 非全真考试 · 不代表完整考纲覆盖或官方难度</p>}
    <details>
    <summary className="cursor-pointer">训练范围与来源</summary>
    <p className="mt-2 max-w-3xl">{EXAM_SCOPE_NOTES[testId]}</p>
    <a className="mt-2 inline-block underline" href={OFFICIAL_SYLLABUS_SOURCES[testId]} target="_blank" rel="noreferrer">查看考试机构来源 ↗</a>
    <p className="mt-2">原创训练，不是官方真题。范围检查不代表难度等同或完整覆盖考纲。</p>
    </details>
  </div>;
}
