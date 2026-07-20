import { buildTmuaMockAudit } from "../lib/tests/audit/tmua-mocks";

const report = buildTmuaMockAudit();

console.log("\nTMUA mock-paper audit\n");
console.table(report.papers.flatMap((paper) => paper.modules.map((module) => ({
  paper: paper.paperId,
  module: module.moduleId,
  questions: module.questions,
  easy: module.difficulty[1],
  medium: module.difficulty[2],
  hard: module.difficulty[3],
  maxOptions: module.maxOptionCount,
  answerBias: `${Math.round(module.dominantAnswerShare * 100)}%`,
  combo: module.statementCombinationQuestions,
  directLogic: module.directLogicQuestions,
}))));

if (report.issues.length) console.table(report.issues);
console.log(`Total: ${report.paperCount} papers, ${report.questionCount} questions, ${report.critical} critical, ${report.warnings} warnings.`);

if (report.critical > 0) process.exitCode = 1;
