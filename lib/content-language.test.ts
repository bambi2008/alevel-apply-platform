import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { ENGLISH_CONTENT_SOURCES } from "../scripts/export-english-content";
import translations from "@/data/content-language/en.json";
import manifest from "@/data/content-language/source-manifest-20261026.json";
import mathLabels from "@/data/content-language/math-labels-en.json";
import { contentText, localizeStaticContent } from "./content-language";
import { CONTENT_STRUCTURAL_FIELDS, contentLanguageKey, HAS_HAN } from "./content-language-key";
import { getReleasedPracticeQuestions } from "./tests/practice-banks";
import { getMockPapersForTest } from "./tests/mock-papers";
import { syllabusFingerprint } from "./tests/syllabus-policy";

const lockedPattern = /```[\s\S]*?```|`[^`\n]+`|\$\$[\s\S]*?\$\$|\$(?:\\.|[^$])+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|https?:\/\/[^\s)]+|\d+(?:[.,]\d+)*(?:%|°)?/g;
const hashes = manifest.sourceHashes as Record<string, string>;
const labels = mathLabels as Record<string, string>;
const entries = translations.translations as Record<string, string>;

describe("offline English learning content", () => {
  it("covers every current exported field and detects stale or colliding sources", () => {
    expect(ENGLISH_CONTENT_SOURCES.entries).toHaveLength(3214);
    expect(Object.keys(entries).sort()).toEqual(ENGLISH_CONTENT_SOURCES.entries.map(e => e.key).sort());
    for (const { key, source } of ENGLISH_CONTENT_SOURCES.entries) {
      expect(contentLanguageKey(source)).toBe(key);
      expect(createHash("sha256").update(source).digest("hex"), key).toBe(hashes[key]);
      const text = contentText(source, "en");
      expect(HAS_HAN.test(text), key).toBe(false);
      expect(text, key).not.toMatch(/@@P\d{4}@@/);
      expect(text.trim().length, key).toBeGreaterThan(0);
      expect(contentText(source, "zh-CN")).toBe(source);
    }
  });

  it("restores every locked formula, number, link and code occurrence", () => {
    for (const { key, source } of ENGLISH_CONTENT_SOURCES.entries) {
      const required = new Map<string, number>();
      for (const locked of source.match(lockedPattern) ?? []) {
        const expected = labels[locked] ?? locked;
        required.set(expected, (required.get(expected) ?? 0) + 1);
      }
      for (const [expected, count] of required) {
        expect(entries[key].split(expected).length - 1, `${key}: ${expected}`).toBeGreaterThanOrEqual(count);
      }
    }
    const mathematicalContent = (s: string) => s.replace(/\\(?:text|mathrm)\{[^{}]*\}/g, "").replace(/[\u3400-\u9fff]/gu, "").replace(/\s+/g, "");
    for (const [source, english] of Object.entries(labels)) {
      expect(mathematicalContent(english), source).toBe(mathematicalContent(source));
      expect(english).not.toMatch(/[\u3400-\u9fff]/u);
    }
  });

  it("does not change IDs, answers, marks, structure or the canonical release", () => {
    const banks = ["caie9709", "bmo", "bpho", "lnat", "tara", "ucat"].flatMap(getReleasedPracticeQuestions);
    const papers = ["caie9709", "bmo", "bpho", "lnat", "tara", "ucat"].flatMap(getMockPapersForTest);
    const originals = syllabusFingerprint(banks[0]);
    function compare(raw: unknown, shown: unknown, field = "") {
      if (CONTENT_STRUCTURAL_FIELDS.has(field)) { expect(shown).toEqual(raw); return; }
      if (typeof raw === "string") { expect(typeof shown).toBe("string"); return; }
      if (Array.isArray(raw)) {
        expect(shown).toHaveLength(raw.length);
        raw.forEach((v, i) => compare(v, (shown as unknown[])[i], field));
      } else if (raw && typeof raw === "object") {
        expect(Object.keys(shown as object).sort()).toEqual(Object.keys(raw).sort());
        for (const [key, value] of Object.entries(raw)) compare(value, (shown as Record<string, unknown>)[key], key);
      } else expect(shown).toBe(raw);
    }
    for (const raw of [...banks, ...papers]) {
      const shown = localizeStaticContent(raw, "en");
      compare(raw, shown);
      expect(localizeStaticContent(raw, "en")).toBe(shown);
      expect(localizeStaticContent(raw, "zh-CN")).toBe(raw);
    }
    expect(syllabusFingerprint(banks[0])).toBe(originals);
    expect(contentText("An unknown student's own work", "en")).toBe("An unknown student's own work");
    const userFields = { studentWork: "这是我的答案", work: "这是我的答案", feedback: "学生反馈", transcript: "学生口述" };
    expect(localizeStaticContent(userFields, "en")).toEqual(userFields);
  });

  it("records actual usage and stays below the owner's ceiling without credentials", () => {
    expect(manifest.ownerBudgetCny).toBe(20);
    expect(manifest.spendableCapCny).toBe(19);
    expect(manifest.costUpperCny).toBeCloseTo(2.217222, 6);
    expect(manifest.costUpperCny).toBeLessThan(manifest.spendableCapCny);
    expect(manifest.promptTokens).toBe(229475);
    expect(manifest.completionTokens).toBe(219784);
    expect(JSON.stringify(manifest)).not.toMatch(/Bearer |sk-[A-Za-z0-9]/);
  });
});
