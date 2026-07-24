import { buildQuestionBankAudit } from "../lib/tests/audit";

const report = buildQuestionBankAudit();
const asJson = process.argv.includes("--json");

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("\nQuestion bank audit\n");
  console.table(report.tests.map((test) => ({
    test: test.abbr,
    questions: test.questions,
    mcq: test.mcq,
    written: test.long,
    topics: `${test.topicsCovered}/${test.topicsTotal}`,
    mocks: test.mockPapers,
    writtenMocks: test.fixedWrittenPapers,
    critical: test.issues.critical,
    warnings: test.issues.warning,
  })));
  console.log(
    `Total: ${report.totals.questions} questions, ${report.totals.mockPapers} papers, ` +
    `${report.totals.critical} critical, ${report.totals.warning} warnings.\n`
  );
  for (const issue of report.issues) {
    const scope = [issue.testId, issue.topicId, issue.questionId].filter(Boolean).join("/");
    console.log(`[${issue.severity.toUpperCase()}] ${issue.code}${scope ? ` (${scope})` : ""}: ${issue.message}`);
  }
}

if (report.totals.critical > 0 || report.totals.warning > 0) process.exitCode = 1;
