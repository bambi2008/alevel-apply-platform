import { readFileSync } from "node:fs";
import { questionDraftSchema, validateDraft } from "../lib/tests/authoring";

const path = process.argv[2];
if (!path) {
  console.error("Usage: pnpm audit:release <workspace-drafts.json>");
  process.exit(1);
}

let payload: unknown;
try {
  payload = JSON.parse(readFileSync(path, "utf8"));
} catch (error) {
  console.error(`Cannot read release input: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const rawDrafts = Array.isArray(payload)
  ? payload
  : payload && typeof payload === "object" && "drafts" in payload
    ? (payload as { drafts?: unknown }).drafts
    : undefined;
if (!Array.isArray(rawDrafts)) {
  console.error("Expected an array of drafts or an object with a drafts array.");
  process.exit(1);
}

let failures = 0;
for (const [index, rawDraft] of rawDrafts.entries()) {
  const parsed = questionDraftSchema.safeParse(rawDraft);
  if (!parsed.success) {
    failures += parsed.error.issues.length;
    for (const issue of parsed.error.issues) {
      console.error(`[critical] draft ${index + 1} ${issue.path.join(".")}: ${issue.message}`);
    }
    continue;
  }
  const validation = validateDraft(parsed.data);
  const issues = [
    ...validation.issues,
    ...(parsed.data.review.stage === "APPROVED"
      ? []
      : [{ code: "DRAFT_NOT_APPROVED", severity: "critical" as const, message: "题目尚未完成双重审核。" }]),
  ];
  failures += issues.filter((issue) => issue.severity !== "info").length;
  for (const issue of issues) {
    console.error(`[${issue.severity}] ${parsed.data.question.id} ${issue.code}: ${issue.message}`);
  }
}

if (failures > 0) {
  console.error(`Release blocked: ${failures} issue(s).`);
  process.exit(1);
}
console.log(`Release ready: ${rawDrafts.length} approved question(s), 0 blocking issues.`);
