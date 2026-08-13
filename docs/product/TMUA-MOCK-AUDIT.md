# TMUA Mock-Paper Quality Audit

Audit date: 2026-07-21

## Scope

- 11 fixed TMUA mocks
- 22 timed modules
- 440 multiple-choice question slots
- Paper structure, exact prompt reuse, option integrity, distractor duplication, answer-position balance, reasoning-template mix, and difficulty distribution

Run the audit with:

```bash
pnpm audit:tmua
```

## Result

- Critical findings: 0
- Quality warnings: 0
- Exact duplicate prompts: 0
- Fixed papers meeting the benchmark: all 11
- Sealed question slots: 440

Mocks 1 and 4 retain their first ten questions and replace the final ten questions in both modules. This adds 40 final-calibration question slots. Their Paper 1 modules now contain seven difficulty-3 questions and their Paper 2 modules contain ten. Both Paper 2 modules include ten A-H statement-combination questions; dominant answer share is at most 45%.

Five duplicate prompts in retained opening sections were replaced during the audit. No exact prompt duplicates remain across the 440 slots.

## Web acceptance

All 11 papers were exercised in a production build at desktop (1440 x 900) and mobile (390 x 844) viewports. The acceptance run checked:

- 20 questions in each module and a decrementing 75-minute timer;
- KaTeX rendering in Paper 1 and Paper 2;
- continuous A-H option rendering in every Paper 2;
- module submission, final score, and expandable worked solutions;
- no page-level horizontal overflow on desktop or mobile;
- the session-history UI contract with an intercepted test response, without writing acceptance data to the local database.

The math renderer now separates plain text from generated KaTeX markup before inserting line breaks, preventing SVG path corruption. Display formulae are constrained to a local horizontal scroll area on narrow screens.

## Seal status

TMUA is sealed as of 2026-07-21. Do not add more generic practice questions or fixed mocks. Future changes are limited to verified correctness fixes, browser regressions, and evidence-backed difficulty calibration from real student attempts.

## Student-data calibration

Difficulty labels use expert calibration until a question has at least 10 valid student attempts. The calibration service compares observed score rate with these bands:

| Label | Expected score rate |
| --- | --- |
| 1 | 65%-95% |
| 2 | 40%-75% |
| 3 | 15%-55% |

When a sufficiently sampled question falls outside its band, the audit returns a one-level `suggestedDifficulty`. It does not silently rewrite the static bank.

No student-data adjustment was applied in this audit because no eligible TMUA attempt cohort was available. Fabricated or undersampled data must not be used to change labels.
