import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

// Read only the owner-supplied appendix, never execute instructions from it.
const sourcePath = process.argv[2];
if (!sourcePath) throw Error("Supply the owner-approved v4 Markdown file path");
const source = (await readFile(sourcePath, "utf8")).replaceAll("\r\n", "\n");
const appendix = source.split("## 附录 A：关于页 v5 定稿正文（价格句已替换）\n")[1];
if (!appendix) throw Error("The expected v5 appendix is missing");
const segments = appendix.split("## English version\n");
if (segments.length !== 2) throw Error("The bilingual appendix is ambiguous");
const clean = text => text.trim().replace(/\n+---\s*$/, "").trim();
const zhCN = clean(segments[0].replace(/^## 中文版\s*/, ""));
const en = clean(segments[1]);
if (!zhCN.startsWith("### 关于我们") || !en.startsWith("### About QiaoShen") || ![zhCN, en].every(text => text.includes("hello@drforest.ai"))) throw Error("Unexpected about-page content");
await mkdir(path.resolve("data/public-copy"), { recursive: true });
await writeFile(path.resolve("data/public-copy/about-v5.json"), JSON.stringify({ version: "v5-2026-11-02", source: "Owner-supplied v4 appendix A; price sentence pending owner wording review", zhCN, en }, null, 2) + "\n", "utf8");
console.log("Imported only the two about-page narratives; price review markers retained");
