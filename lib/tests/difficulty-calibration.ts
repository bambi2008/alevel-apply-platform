import data from "@/data/question-bank/difficulty-20261026.json";
import type { Question, QuestionDifficulty } from "./questions/types";
import type { MockPaper } from "./mock-papers";

export const CALIBRATION_SUFFIX = "-cal20261026";
export const DIFFICULTY_TARGETS = data.targets as Record<string, QuestionDifficulty>;
export const calibrationSourceId = (id: string) => id.replace(/(?:-rev2026102[56]|-cal20261026)+$/g, "");
const HELD = new Set(["mat-b-009", "mat-b-010", "mat-written-5-01", "mat-written-5-02", "tara-ct2-032", "tara-mk3-ct-12", "lnat-ex5-031", "lnat-ex5-033", "lnat-ex5-036", "ielts-w-02", "ielts-s-02", "ielts-full1-writing-task2", "ielts-written-diagnostic-writing-02"]);

/** A reviewed label projection, never a mutation or a syllabus-release decision.
 * IDs identify new versions so saved practice attempts retain their old labels. */
export function calibrateQuestion(original: Question, versionAll = false): Question {
  if (original.id.endsWith(CALIBRATION_SUFFIX)) return original;
  const id = calibrationSourceId(original.id);
  const difficulty = HELD.has(id) || /^ucat-m[1-5]-sjt-\d+-4$/.test(id)
    ? original.difficulty : DIFFICULTY_TARGETS[id] ?? original.difficulty;
  if (!versionAll && difficulty === original.difficulty) return original;
  return { ...original, id: original.id + CALIBRATION_SUFFIX, difficulty };
}

/** Part 7's explicit duration decisions; no unpublished legacy format is released. */
export function calibratePaper(original: MockPaper): MockPaper {
  if (original.id.endsWith(CALIBRATION_SUFFIX)) return original;
  const sourceId = calibrationSourceId(original.id);
  const bphoRound1 = original.testId === "bpho" && /^(?:bpho-written-|bpho-mock-)/.test(sourceId);
  const bmoRound2 = /^bmo-r2-mock-/.test(sourceId);
  const matChoices = /^mat-mock-/.test(sourceId);
  const patChoices = /^pat-mock-/.test(sourceId);
  const durationChanges = bphoRound1 || bmoRound2 || matChoices;
  if (!durationChanges && !patChoices && !original.modules.some(section => section.questions.some(q => calibrateQuestion(q) !== q))) return original;
  const note = matChoices || /^mat-written-/.test(sourceId)
    ? "官方历史整卷 2.5 小时，未规定分段时长；本站按分值比例拆分为 105/45 分钟。"
    : patChoices ? "PAT 选择题分段训练（非整卷时长）；60 分钟为平台训练时长，历史官方整卷为 2 小时。" : "";
  return { ...original, id: original.id + CALIBRATION_SUFFIX,
    ...(patChoices ? { title: "PAT 选择题分段训练（非整卷时长）", titleEn: "PAT segmented MCQ practice (not a full paper)" } : {}),
    description: note ? `${original.description}\n${note}` : original.description,
    modules: original.modules.map(section => ({ ...section,
      ...(bphoRound1 ? { durationSec: 3600 } : bmoRound2 ? { durationSec: 3150 } : matChoices ? { durationSec: 6300 } : {}),
      ...(matChoices ? { title: "选择题分段训练（105 分钟）", titleEn: "MCQ practice (105 minutes)" } : {}),
      questions: section.questions.map(q => calibrateQuestion(q, true)),
    })),
  };
}
