# Adaptive learning loop

## Student loop

The first usable version connects the existing question banks and exam-session data into one loop:

1. diagnose across topics when fewer than 12 distinct questions have been answered;
2. calculate topic mastery, confidence, trend and priority after each saved session;
3. schedule review from the latest response to each question;
4. select due questions, weak-topic questions and difficulty-matched unseen questions;
5. return the student to an updated plan and ability profile.

No additional persistence model is required. The profile is derived from `ExamSession`, `ExamAnswer` and the version-controlled question metadata, so historical answers become useful immediately.

## Mastery

Each topic starts with a conservative 55% prior. The latest answer to each distinct question contributes to mastery with:

- recency decay with a 45-day half-life and a 35% minimum weight;
- a small difficulty adjustment, so success on a hard question contributes more and failure on an easy question contributes less;
- a confidence score that grows with the number of distinct questions.

Repeated attempts remain visible in activity and trend metrics, but repeating the same question cannot dominate the mastery score. Topic priority combines the mastery gap, uncertainty and time since the topic was last practised.

## Review schedule

The latest score determines the next review date:

| Latest score | Review interval |
| --- | --- |
| Below 50% | 1 day |
| 50% to 79% | 3 days |
| 80% or above | 10 days |

Due questions are ranked before unseen questions. Topic-strengthening sessions add new questions at the difficulty that best matches current mastery, which prevents a review loop from becoming memorisation of exact answers.

## Readiness

Readiness combines confidence-weighted topic mastery and syllabus coverage. It is used only to choose the current training stage:

- diagnostic;
- foundation;
- building;
- exam-ready.

It is not an official score prediction and the product must not present it as an admissions outcome. Mock-paper performance remains the stronger evidence for exam-day readiness.

## Release checks

Changes to the adaptive engine require:

```powershell
pnpm test
pnpm audit:questions
pnpm build
```

Browser acceptance should cover plan, analysis, adaptive practice and review routes at desktop and 390px mobile widths. Anonymous users must receive a login prompt without exposing student data or generating expected authorization errors in the browser console.
