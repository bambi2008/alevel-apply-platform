import { describe, it, expect } from "vitest";
import { getKnowledgeByTopicId } from "@/lib/tests/knowledge";
import { getTestById } from "@/lib/tests";

// 有题库的考试，其每个知识点都应有「学习讲解」内容（否则 learn 页 404）。
const TESTS_WITH_BANK = ["mat", "step", "esat", "tmua"];

describe("knowledge coverage", () => {
  for (const testId of TESTS_WITH_BANK) {
    it(`${testId}: every topic has learn content`, () => {
      const test = getTestById(testId);
      expect(test, `unknown test ${testId}`).toBeTruthy();
      const missing = test!.topics
        .filter((t) => !getKnowledgeByTopicId(t.id))
        .map((t) => t.id);
      expect(missing, `${testId} topics missing knowledge`).toEqual([]);
    });
  }
});

describe("knowledge entry integrity", () => {
  for (const testId of TESTS_WITH_BANK) {
    it(`${testId}: entries are well-formed`, () => {
      const test = getTestById(testId)!;
      for (const t of test.topics) {
        const k = getKnowledgeByTopicId(t.id);
        if (!k) continue; // 覆盖率由上一组测试保证
        expect(k.overview.length, `${t.id}: empty overview`).toBeGreaterThan(0);
        expect(k.concepts.length, `${t.id}: no concepts`).toBeGreaterThan(0);
        expect(
          k.workedExamples.length,
          `${t.id}: no worked examples`
        ).toBeGreaterThan(0);
        for (const c of k.concepts) {
          expect(c.name.length, `${t.id}: empty concept name`).toBeGreaterThan(0);
          expect(c.body.length, `${t.id}: empty concept body`).toBeGreaterThan(0);
        }
      }
    });
  }
});
