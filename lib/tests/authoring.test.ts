import { describe, expect, it } from "vitest";
import {
  advanceDraft,
  buildPaperPlan,
  createBlankDraft,
  createReleasePackage,
  diffQuestionDraft,
  validateDraft,
  type PaperCandidate,
  type QuestionDraft,
} from "./authoring";

function validDraft(): QuestionDraft {
  const draft = createBlankDraft("tmua", "tmua-algebra", new Date("2026-07-24T00:00:00.000Z"));
  if (draft.question.type !== "mcq") throw new Error("Fixture should be MCQ");
  return {
    ...draft,
    question: {
      ...draft.question,
      id: "tmua-authored-001",
      question: "What is $2+2$?",
      options: [
        { key: "A", text: "$4$" },
        { key: "B", text: "$5$" },
        { key: "C", text: "$6$" },
        { key: "D", text: "$7$" },
      ],
      answer: "A",
      solution: "$2+2=4$.",
      optionExplanations: {
        A: "Direct addition gives 4.",
        B: "This is one too large.",
        C: "This doubles the second addend.",
        D: "This does not follow from addition.",
      },
    },
  };
}

describe("question authoring workflow", () => {
  it("blocks incomplete content and uncleared rights", () => {
    const blank = createBlankDraft("tmua", "tmua-algebra");
    expect(validateDraft(blank).issues.some((issue) => issue.severity === "critical")).toBe(true);
    const restricted = { ...validDraft(), source: { ...validDraft().source, rights: "RESTRICTED" as const } };
    expect(validateDraft(restricted).issues.map((issue) => issue.code)).toContain("RIGHTS_NOT_CLEARED");
  });

  it("requires subject and teaching review before approval", () => {
    const subjectQueue = advanceDraft(validDraft(), "author").draft;
    expect(subjectQueue.review.stage).toBe("SUBJECT_REVIEW");
    const teachingQueue = advanceDraft(subjectQueue, "Dr Subject").draft;
    expect(teachingQueue.review.stage).toBe("TEACHING_REVIEW");
    expect(teachingQueue.review.subjectReviewer).toBe("Dr Subject");
    const approved = advanceDraft(teachingQueue, "Ms Teacher");
    expect(approved.draft.review.stage).toBe("APPROVED");
    expect(approved.draft.review.teachingReviewer).toBe("Ms Teacher");
    expect(approved.issues.filter((issue) => issue.severity === "critical")).toEqual([]);
  });

  it("exports only fully approved release packages", () => {
    expect(createReleasePackage([validDraft()]).releasable).toBe(false);
    const subjectQueue = advanceDraft(validDraft(), "author").draft;
    const teachingQueue = advanceDraft(subjectQueue, "Dr Subject").draft;
    const approved = advanceDraft(teachingQueue, "Ms Teacher").draft;
    const release = createReleasePackage([approved]);
    expect(release.releasable).toBe(true);
    expect(release.questions[0].id).toBe("tmua-authored-001");
  });

  it("shows field-level differences from the previous version", () => {
    const draft = validDraft();
    const previousQuestion = { ...draft.question, solution: "Old solution." };
    const diff = diffQuestionDraft({ ...draft, previousQuestion });
    expect(diff).toContainEqual(expect.objectContaining({ field: "solution", before: "Old solution." }));
  });

  it("validates essay prompts, rubric marks and word ranges", () => {
    const base = validDraft();
    const essay: QuestionDraft = {
      ...base,
      question: {
        id: "lnat-essay-authored-001",
        type: "long",
        testId: "lnat",
        topicId: "lnat-essay",
        difficulty: 3,
        totalMarks: 20,
        parts: [{ label: "Essay", marks: 20, question: "Choose one prompt.", solutionOutline: "Build a clear argument." }],
        fullSolution: "A strong response defines its terms, tests objections and reaches a supported conclusion.",
        responseKind: "essay",
        essayPrompts: [{ id: "a", title: "Should voting be compulsory?" }],
        recommendedWords: [500, 700],
        maxWords: 750,
        rubricDimensions: [
          { id: "argument", label: "Argument", maxMarks: 10, description: "Coherent and well supported." },
          { id: "expression", label: "Expression", maxMarks: 10, description: "Clear and precise." },
        ],
      },
    };
    expect(validateDraft(essay).issues.filter((issue) => issue.severity === "critical")).toEqual([]);
  });
});

describe("paper blueprint builder", () => {
  const candidates: PaperCandidate[] = Array.from({ length: 12 }, (_, index) => ({
    id: `q-${index + 1}`,
    testId: "tmua",
    topicId: index % 2 ? "logic" : "algebra",
    difficulty: ((index % 3) + 1) as 1 | 2 | 3,
    type: "mcq",
    answer: "ABCD"[index % 4] as "A" | "B" | "C" | "D",
  }));

  it("meets topic, difficulty and answer-balance targets deterministically", () => {
    const blueprint = {
      testId: "tmua",
      title: "Draft paper",
      questionCount: 9,
      mcqOnly: true,
      difficulty: { 1: 3, 2: 3, 3: 3 },
      topicIds: ["algebra", "logic"],
    };
    const first = buildPaperPlan(candidates, blueprint);
    const second = buildPaperPlan(candidates, blueprint);
    expect(first.selected).toHaveLength(9);
    expect(first.difficultyCounts).toEqual({ 1: 3, 2: 3, 3: 3 });
    expect(first.selected.map((item) => item.id)).toEqual(second.selected.map((item) => item.id));
    expect(first.issues.filter((issue) => issue.severity === "critical")).toEqual([]);
  });
});
