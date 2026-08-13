import { buildTaraMockAudit } from "../lib/tests/audit/tara-mocks";

const report = buildTaraMockAudit();

console.log("\nTARA fixed-paper audit\n");
console.table(report.modules.map((module) => ({
  paper: module.paperId,
  module: module.moduleId,
  questions: module.questions,
  difficulty: `${module.difficulty[1]}/${module.difficulty[2]}/${module.difficulty[3]}`,
  answers: ["A", "B", "C", "D", "E"].map((key) => module.answerCounts[key] ?? 0).join("/"),
  skills: module.problemSkills
    ? `${module.problemSkills["relevant-selection"]}/${module.problemSkills["finding-procedures"]}/${module.problemSkills["identifying-similarity"]}`
    : Object.keys(module.criticalSkills ?? {}).length,
})));
if (report.issues.length) console.table(report.issues);
console.log(`Total: ${report.objectivePapers} objective papers, ${report.writtenPapers} writing papers, ${report.questionCount} objective slots, ${report.critical} critical, ${report.warnings} warnings.`);
if (report.critical > 0 || report.warnings > 0) process.exitCode = 1;
