import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { getReleasedPracticeQuestions } from "../lib/tests/practice-banks";
import { getMockPapersForTest } from "../lib/tests/mock-papers";
import { isReleasedPaper } from "../lib/tests/syllabus-release";

const directory = process.argv[2] ?? ".next";
const root = path.join(directory, "static", "chunks");
const tests = ["caie9709", "esat", "tmua", "step", "bmo", "bpho", "ucat", "lnat", "tara", "ielts", "csat"];
const canaries: Array<{ name: string; patterns: string[] }> = [];
for (const id of tests) {
  const released = getReleasedPracticeQuestions(id);
  const firstPaper = getMockPapersForTest(id).find(isReleasedPaper);
  const sampled = [released.find(q => q.type === "mcq"), released.find(q => q.type === "long"),
    firstPaper?.modules.flatMap(module => module.questions).find(q => q.type === "long")].filter(q => q !== undefined);
  for (const question of sampled) {
    const solution = question.type === "mcq" ? question.solution : question.fullSolution;
    const line = solution.split(/\r?\n/).find(value => value.trim().length >= 42)?.trim();
    if (!line) continue;
    const sample = line.slice(0, 72);
    const escaped = JSON.stringify(sample).slice(1, -1);
    const ascii = escaped.replace(/[^\x20-\x7e]/g, char => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`);
    canaries.push({ name: question.id, patterns: [...new Set([sample, escaped, ascii])] });
  }
}

async function audit() {
  if (canaries.length < 12) throw Error("Too few private solution canaries");
  const paths = (await readdir(root, { recursive: true, withFileTypes: true }))
    .filter(item => item.isFile() && item.name.endsWith(".js"))
    .map(item => path.join(item.parentPath, item.name));
  if (paths.length === 0) throw Error("No built client JavaScript chunks found");
  let leaked = false;
  for (const file of paths) {
    const contents = await readFile(file, "utf8");
    for (const canary of canaries) {
      if (canary.patterns.some(pattern => contents.includes(pattern))) {
        console.error(`[answer-key-audit] ${canary.name} appeared in ${path.relative(root, file)}`);
        leaked = true;
      }
    }
  }
  console.log(`[answer-key-audit] Checked ${paths.length} client chunks against ${canaries.length} private solution canaries`);
  if (leaked) process.exitCode = 1;
}

void audit().catch(error => { console.error(error.message); process.exitCode = 1; });
