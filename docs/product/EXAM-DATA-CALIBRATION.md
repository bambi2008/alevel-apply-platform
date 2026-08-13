# Exam data and difficulty calibration

## Scope

The calibration loop covers every supported test and all three answer surfaces:

- fixed papers, including written papers and LNAT
- generated or preset mock papers
- topic practice

Each completed session stores its source, elapsed time and optional client context. Each objective answer can store active time, answer changes, visits, flag state and the first selected option. The client context is deliberately limited to product diagnostics such as schema version, locale and viewport; it does not create a device fingerprint.

## Aggregation rules

- Use the latest response from each student for a question so repeated practice does not dominate the result.
- Do not release a difficulty recommendation below 30 responses and 20 unique students.
- Report accuracy with a 95% Wilson confidence interval.
- Calculate discrimination from the score-rate gap between the top and bottom 27% of sessions.
- Report median active time, answer-change rate, flag rate and telemetry coverage.
- Mark an option as an ineffective distractor when it attracts less than 5% of eligible responses.
- Lower confidence when the sample is only just above the gate or telemetry coverage is incomplete.

The current accuracy bands are:

| Observed accuracy | Suggested difficulty |
| --- | --- |
| 75% or above | Easy |
| 40% to 74.9% | Medium |
| Below 40% | Hard |

These bands are recommendations, not automatic source edits. Reviewers should consider confidence intervals, discrimination, timing and distractor quality together.

## Review workflow

The admin question-audit page shows all eligible recommendations and data-quality warnings. An administrator can:

1. approve a recommendation as a versioned calibration decision;
2. dismiss it with an optional note;
3. roll back a previously approved decision.

Every action writes a `CalibrationDecision` record and an `AuditLog` entry. Approval records the reviewed override but does not rewrite the TypeScript question bank at runtime. Static question metadata remains release-controlled and should be updated in a normal reviewed commit when the evidence is accepted.

## Operations

Apply the database migration before deploying the new application version:

```powershell
pnpm exec prisma migrate deploy
pnpm exec prisma generate
```

After deployment, verify these signals in the admin workbench:

- sessions and unique students are increasing;
- telemetry coverage is increasing across all test types;
- no recommendation is actionable below the release gate;
- approved, dismissed and rolled-back decisions remain visible in history.

Run the repository gates before changing question-bank labels:

```powershell
pnpm test
pnpm audit:questions
pnpm build
```
