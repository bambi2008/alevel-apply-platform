import katex from "katex";

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;")
  .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

export function renderStudyMath(math: string, displayMode = false): string {
  return katex.renderToString(math.trim(), {
    displayMode, throwOnError: false, trust: false, maxExpand: 1000, maxSize: 20,
  });
}

/** Safe study Markdown: paragraphs, emphasis, lists, rules, headings, code,
 * quotations and http(s)/mailto/relative links. Raw HTML is always escaped.
 * Protect math before interpreting Markdown so LaTeX *, _ and \\ survive.
 */
export function renderStudyText(source: string, block = false): string {
  const protectedHtml: Array<{ html: string; block: boolean }> = [];
  const protect = (html: string, isBlock: boolean) => {
    const index = protectedHtml.push({ html, block: isBlock }) - 1;
    return `\u0000M${index}\u0000`;
  };
  const text = source.replace(/\u0000/g, "\ufffd").replace(/\r\n?/g, "\n")
    .replace(/```[^\n]*\n([\s\S]*?)```|`([^`\n]+)`|(?<!\\)\$\$([\s\S]*?)\$\$|(?<!\\)\$([^$\n]+)\$/g,
      (_match, fenced: string | undefined, code: string | undefined, display: string | undefined, inline: string | undefined) => {
        if (fenced !== undefined) return protect(block ? `<pre class="overflow-x-auto"><code>${escapeHtml(fenced)}</code></pre>` : `<code>${escapeHtml(fenced)}</code>`, block);
        if (code !== undefined) return protect(`<code>${escapeHtml(code)}</code>`, false);
        return protect(renderStudyMath(display ?? inline ?? "", display !== undefined), display !== undefined);
      })
    // Legacy source strings contain literal escaped line breaks. Normalize only
    // prose AFTER protecting math/code: never corrupt \\ne, \\nmid or code samples,
    // and never rewrite saved questions or historical answer keys.
    .replace(/\\n(?![a-z])/g, "\n");
  const inline = (value: string, depth = 0): string => {
    if (depth > 8) return escapeHtml(value);
    return value.split(/(\u0000M\d+\u0000|\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|\[[^\]\n]+\]\([^\s)]+\))/g).map((segment) => {
      const token = /^\u0000M(\d+)\u0000$/.exec(segment);
      if (token) return protectedHtml[Number(token[1])]?.html ?? "";
      if ((segment.startsWith("**") && segment.endsWith("**")) || (segment.startsWith("__") && segment.endsWith("__"))) return `<strong>${inline(segment.slice(2, -2), depth + 1)}</strong>`;
      if (segment.startsWith("*") && segment.endsWith("*")) return `<em>${inline(segment.slice(1, -1), depth + 1)}</em>`;
      const link = /^\[([^\]]+)\]\(([^\s)]+)\)$/.exec(segment);
      if (link) {
        const safe = /^(?:https?:\/\/|mailto:)/i.test(link[2]) || /^\/(?!\/)/.test(link[2]) || link[2].startsWith("#");
        return safe ? `<a href="${escapeHtml(link[2])}" rel="noopener noreferrer" class="underline">${inline(link[1], depth + 1)}</a>` : inline(link[1], depth + 1);
      }
      return escapeHtml(segment).replace(/\n/g, "<br>");
    }).join("");
  };
  if (!block) return inline(text);

  const result: string[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let listType: "ul" | "ol" = "ul";
  const flushParagraph = () => {
    if (paragraph.length) result.push(`<p>${inline(paragraph.join("\n"))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) result.push(`<${listType} class="${listType === "ul" ? "list-disc" : "list-decimal"} pl-6">${list.map((item) => `<li>${inline(item)}</li>`).join("")}</${listType}>`);
    list = [];
  };
  for (const line of text.split("\n")) {
    if (!line.trim()) { flushParagraph(); flushList(); continue; }
    const token = /^\s*\u0000M(\d+)\u0000\s*$/.exec(line);
    if (token && protectedHtml[Number(token[1])]?.block) {
      flushParagraph(); flushList(); result.push(protectedHtml[Number(token[1])].html); continue;
    }
    if (/^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushParagraph(); flushList(); result.push('<hr class="my-4 border-black/20">'); continue;
    }
    const item = /^\s*(?:([-+*])|\d+[.)])\s+(.+)$/.exec(line);
    if (item) {
      flushParagraph();
      const nextType = item[1] ? "ul" : "ol";
      if (list.length && listType !== nextType) flushList();
      listType = nextType; list.push(item[2]); continue;
    }
    flushList();
    const heading = /^#{1,6}\s+(.+)$/.exec(line);
    if (heading) { flushParagraph(); result.push(`<h3 class="my-3 font-semibold">${inline(heading[1])}</h3>`); continue; }
    const quote = /^>\s?(.*)$/.exec(line);
    if (quote) { flushParagraph(); result.push(`<blockquote class="border-l-2 pl-4">${inline(quote[1])}</blockquote>`); continue; }
    paragraph.push(line);
  }
  flushParagraph(); flushList();
  return result.join("");
}
