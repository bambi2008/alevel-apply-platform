import { EXAM_SCOPE_NOTES, isLimitedTrainingTest } from "@/lib/tests/syllabus-release";
import { OFFICIAL_SYLLABUS_SOURCES } from "@/lib/tests/syllabus-policy";
import { EXAM_SCOPE_NOTES_EN } from "@/lib/tests/scope-notes-en";

export function ExamScopeNote({testId, locale="zh-CN"}:{testId:string; locale?:string}) {
  const en = locale === "en";
  return <div className="my-4 text-sm text-[var(--muted)]">
    {isLimitedTrainingTest(testId) && <p role="note">{en ? "Limited preparation · Not a full examination · No claim of complete syllabus coverage or official difficulty" : "范围受限训练 · 非全真考试 · 不代表完整考纲覆盖或官方难度"}</p>}
    <details>
    <summary className="min-h-11 cursor-pointer py-2">{en ? "Training scope and sources" : "训练范围与来源"}</summary>
    <p className="mt-2 max-w-3xl">{en ? EXAM_SCOPE_NOTES_EN[testId] : EXAM_SCOPE_NOTES[testId]}</p>
    <a className="mt-2 inline-flex min-h-11 items-center underline" href={OFFICIAL_SYLLABUS_SOURCES[testId]} target="_blank" rel="noreferrer">{en ? "Examination-body source ↗" : "查看考试机构来源 ↗"}</a>
    <p className="mt-2">{en ? "Original practice, not official questions. Scope checks do not establish equivalent difficulty or complete coverage." : "原创训练，并非考试机构发布的试卷。范围检查不代表难度等同或完整覆盖考纲。"}</p>
    </details>
  </div>;
}
