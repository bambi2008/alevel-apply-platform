import { describe, expect, it } from "vitest";
import { BACKGROUND_CATALOG } from "./catalog";
import { backgroundStaticCopy } from "./presentation";
import { contentText } from "../content-language";
import dictionary from "@/data/background-copy-en.json";
import { uiCopy } from "../ui-copy";

describe("lightweight English catalogue descriptions", () => {
  it("covers every current description and planning-time hint with the reviewed translation", () => {
    for (const item of BACKGROUND_CATALOG) for (const field of ["description", "timing"] as const) {
      const shown = backgroundStaticCopy(item[field], "en");
      expect(shown, `${item.id}.${field}`).not.toMatch(/[\u3400-\u9fff]/u);
      expect(shown).toBe(contentText(item[field], "en"));
      expect(backgroundStaticCopy(item[field], "zh-CN")).toBe(item[field]);
    }
    expect(JSON.stringify(dictionary).length).toBeLessThan(15000);
  });
  it("keeps personal project text unknown and handles only fixed recommendation reasons", () => {
    expect(backgroundStaticCopy("我的项目原文 x=2", "en")).toBe("我的项目原文 x=2");
    for (const reason of ["与你的目标专业方向匹配", "与你的 A-Level 选科相关"]) expect(uiCopy("en", reason)).not.toMatch(/[\u3400-\u9fff]/u);
    expect(backgroundStaticCopy("constructor", "en")).toBe("constructor");
  });
});
