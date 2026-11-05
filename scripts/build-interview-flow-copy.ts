import { mkdir, writeFile } from "node:fs/promises";
import { CAMBRIDGE_ASSESSMENT_FLOWS } from "../lib/interview/cambridge-assessment-flows";
import { HK_INTERVIEW_FLOWS } from "../lib/interview/hk-interview-flows";
import { contentText } from "../lib/content-language";

// Only these UI titles/notes, never the global question/solution translations.
async function main() {
const sources = [...new Set([...CAMBRIDGE_ASSESSMENT_FLOWS, ...HK_INTERVIEW_FLOWS].flatMap(flow => [flow.title, flow.note]))];
const translated = Object.fromEntries(sources.map(source => [source, contentText(source, "en")]));
if (Object.values(translated).some(text => /[\u3400-\u9fff]/u.test(text))) throw Error("Untranslated interview-flow UI copy");
await mkdir("data/ui-copy", { recursive: true });
await writeFile("data/ui-copy/interview-flows-en.json", JSON.stringify(translated, null, 2) + "\n", "utf8");
console.log(`Built ${sources.length} UI flow labels; no question-bank translations included`);
}
main().catch(error => { console.error(error instanceof Error ? error.message : "Flow-copy build failed"); process.exitCode = 1; });
