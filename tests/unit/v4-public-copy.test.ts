import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import narrative from "../../data/public-copy/about-v5.json";
import { StaticProse } from "../../components/static-prose";
import { seasonPassOffer } from "../../lib/membership/config";

describe("v4 owner-supplied public prose", () => {
  it("renders both supplied narratives, preserving only the authorized price review markers", () => {
    const zh = renderToStaticMarkup(createElement(StaticProse, { text: narrative.zhCN }));
    const en = renderToStaticMarkup(createElement(StaticProse, { text: narrative.en }));
    expect(zh).toContain("我是一名父亲，清华毕业");
    expect(zh).toContain("【请 Jose 确认措辞】");
    expect(en).toContain("[Jose to confirm wording]");
    expect(en).not.toMatch(/[\u3400-\u9fff]/u);
    for (const html of [zh, en]) {
      expect(html.match(/<h1/g)).toHaveLength(1);
      expect(html).toContain('href="mailto:hello@drforest.ai"');
    }
  });
  it("treats document HTML and arbitrary links as text", () => {
    const html = renderToStaticMarkup(createElement(StaticProse, { text: '### Title\n\n<script>alert(1)</script> [link](javascript:alert(1)) **bold**' }));
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("<strong>bold</strong>");
  });
  it("uses integer-fen server offers and rejects malformed price or duration settings", () => {
    expect(seasonPassOffer({})).toEqual({ priceFen: 39900, months: 3 });
    expect(seasonPassOffer({ SEASON_PASS_PRICE_FEN: "49900", SEASON_PASS_MONTHS: "4" })).toEqual({ priceFen: 49900, months: 4 });
    for (const value of ["", "0", "-1", "399.00", "NaN", "1e4"]) expect(() => seasonPassOffer({ SEASON_PASS_PRICE_FEN: value })).toThrow();
    expect(() => seasonPassOffer({ SEASON_PASS_MONTHS: "37" })).toThrow();
  });
});
