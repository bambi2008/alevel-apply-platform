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
- Exact duplicate prompts: 0
- Newly calibrated mocks with no findings: 2, 3, 5, 7, and 8
- Previously calibrated mocks meeting the benchmark: calibration 1, 6, 9, and 10
- Remaining warning backlog: mocks 1 and 4

The five papers calibrated in this round each retain 12 original opening questions and replace the final eight questions in both Paper 1 and Paper 2. This adds 80 original calibrated question slots. Their Paper 1 modules now contain seven difficulty-3 questions, while Paper 2 contains eight to ten. Paper 2 uses up to eight continuous options and the dominant answer position is no greater than 50%.

Five duplicate prompts in retained opening sections were replaced during the audit. No exact prompt duplicates remain across the 440 slots.

## Remaining warnings

Mock 1 and mock 4 remain below the current acceptance benchmark:

- too few difficulty-3 questions in both modules;
- strong answer-position bias in Paper 2;
- no six-to-eight-option reasoning items;
- mock 4 Paper 1 has especially severe answer-position concentration.

These papers remain usable for introductory timed practice, but should not be presented as the hardest full-fidelity mocks until recalibrated.

## Student-data calibration

Difficulty labels use expert calibration until a question has at least 10 valid student attempts. The calibration service compares observed score rate with these bands:

| Label | Expected score rate |
| --- | --- |
| 1 | 65%-95% |
| 2 | 40%-75% |
| 3 | 15%-55% |

When a sufficiently sampled question falls outside its band, the audit returns a one-level `suggestedDifficulty`. It does not silently rewrite the static bank.

No student-data adjustment was applied in this audit because the current workspace has no configured `DATABASE_URL` and no available TMUA attempt cohort. Fabricated or undersampled data must not be used to change labels.
