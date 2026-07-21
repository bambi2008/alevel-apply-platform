import { buildLnatMockAudit } from "../lib/tests/audit/lnat-mocks";

const report = buildLnatMockAudit();

console.log("\nLNAT fixed-paper audit\n");
console.table(report.papers.map((paper) => ({
  paper: paper.paperId,
  questions: paper.questions,
  passages: paper.passages,
  passageSplit: paper.passageSplit,
  difficulty: `${paper.difficulty[1]}/${paper.difficulty[2]}/${paper.difficulty[3]}`,
  answers: ["A", "B", "C", "D"].map((key) => paper.answerCounts[key] ?? 0).join("/"),
})));
if (report.issues.length) console.table(report.issues);
console.log(`Total: ${report.objectivePapers} objective papers, ${report.writtenPapers} writing papers, ${report.questionCount} objective slots, ${report.critical} critical, ${report.warnings} warnings.`);
if (report.critical > 0 || report.warnings > 0) process.exitCode = 1;
