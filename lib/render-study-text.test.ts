import { describe, expect, it } from "vitest";
import { renderStudyText } from "./render-study-text";

describe("safe study Markdown and math", () => {
  it("normalizes legacy escaped prose newlines without changing math or code", () => {
    const html = renderStudyText(String.raw`**a)** First.\n\n**b)** Second.\n- Check $x\ne0$ and $p\nmid n$.\nNext.`, true);
    expect(html).toContain("<p><strong>a)</strong> First.</p>");
    expect(html).toContain("<strong>b)</strong> Second.");
    expect(html).toContain("<ul ");
    expect(html).toContain("Next.");
    expect(html).not.toContain("katex-error");
    expect(html).not.toContain(String.raw`\nNext`);
    expect(renderStudyText(String.raw`The literal code is \`line\nend\`.`, true)).toContain(String.raw`line\nend`);
  });
  it("renders strong, emphasis, paragraphs, lists and rules instead of literal markers", () => {
    const html = renderStudyText("**Proof**\n\nA *method*.\n\n---\n\n- First\n- Second\n\n1. Finish\n2. Check", true);
    expect(html).toContain("<strong>Proof</strong>");
    expect(html).toContain("<em>method</em>");
    expect(html).toContain("<hr ");
    expect(html).toContain('<ul class="list-disc pl-6"><li>First</li><li>Second</li></ul>');
    expect(html).toContain('<ol class="list-decimal pl-6"><li>Finish</li><li>Check</li></ol>');
    expect(html).not.toContain("**");
  });
  it("protects LaTeX stars, underscores, not-equals and divisibility commands", () => {
    const html = renderStudyText("**Cases:** $x_i*x_j\\ne0$\n\n$$p\\nmid n \\quad \\frac{a_b}{2}$$", true);
    expect(html.match(/class="katex"/g)).toHaveLength(2);
    expect(html).not.toContain("katex-error");
    expect(html).toContain("<strong>Cases:</strong>");
  });
  it("escapes raw HTML and refuses active link protocols", () => {
    const html = renderStudyText('<img src=x onerror="alert(1)"><script>alert(2)</script> [bad](javascript:alert) [safe](https://example.org)', true);
    expect(html).not.toMatch(/<img|<script|href="javascript:/);
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain('href="https://example.org"');
  });
  it("does not execute math HTML extensions", () => {
    const html = renderStudyText("$\\href{javascript:alert(1)}{click}$", true);
    expect(html).not.toContain('href="javascript:');
  });
  it("keeps inline code literal and has the same output on repeated render", () => {
    expect(renderStudyText("`**not bold** $x$`", false)).toBe("<code>**not bold** $x$</code>");
    expect(renderStudyText("$a_b$", true)).toBe(renderStudyText("$a_b$", true));
    expect(renderStudyText("**Name**", false)).toBe("<strong>Name</strong>");
  });
  it("cannot inject protected-token HTML or attributes through input", () => {
    expect(renderStudyText("\u0000M0\u0000<script>x</script>", true)).not.toContain("<script>");
    expect(renderStudyText('[x](https://example.org/"onmouseover="evil)', true)).not.toContain(' onmouseover="');
  });
});
