import { buildEsatMockAudit } from "../lib/tests/audit/esat-mocks";

const report = buildEsatMockAudit();

console.log("\nESAT mock-paper audit\n");
console.table(report.modules.map((module) => ({
  paper: module.paperId,
  module: module.moduleId,
  subject: module.subject,
  questions: module.questions,
  easy: module.difficulty[1],
  medium: module.difficulty[2],
  hard: module.difficulty[3],
  answers: ["A", "B", "C", "D", "E"].map((key) => module.answerCounts[key] ?? 0).join("/"),
  maxRun: module.longestAnswerRun,
})));

if (report.issues.length) console.table(report.issues);
console.log(`Total: ${report.paperCount} papers, ${report.moduleCount} modules, ${report.questionCount} question slots, ${report.critical} critical, ${report.warnings} warnings.`);

if (report.critical > 0 || report.warnings > 0) process.exitCode = 1;
