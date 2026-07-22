# Study execution loop

## Purpose

The execution layer turns adaptive recommendations into a weekly routine. Students set an exam date, optional target level and weekly time budget. The system materialises a seven-day agenda across all active exam goals and preserves completion state in the database.

The application-task list remains separate. `StudyGoal` and `StudyTask` only represent exam preparation, so document deadlines and application work cannot be accidentally rescheduled by the adaptive planner.

## Planning rules

- Each active goal receives tasks up to its weekly minute budget.
- Tasks come from the latest adaptive profile: diagnostic, due review, weak-topic focus and mock.
- A goal never creates tasks after its target exam date.
- Generated tasks are idempotent for a student, recommendation source and scheduled date.
- Updating a goal clears only its uncompleted generated tasks before rebuilding the week.
- Removing a goal removes its associated study tasks.
- Postponing marks the original task skipped and creates a new planned task for the selected later date.

## Automatic completion

When an authenticated student saves a practice, mock or fixed-paper session, the first planned task for the same test and Shanghai calendar day is completed automatically. Manual completion remains available for work done outside the platform.

## Weekly report

The rolling seven-day report contains:

- planned and completed task counts;
- task completion rate;
- recorded exam-session minutes;
- questions answered and aggregate score rate;
- active dates and current study streak.

Score rate is a learning-activity summary, not an official predicted score. The adaptive readiness model remains the source for topic-level training decisions.

## Deployment

Apply the schema migration before releasing the application build:

```powershell
pnpm exec prisma migrate deploy
pnpm exec prisma generate
```

Release checks:

```powershell
pnpm test
pnpm audit:questions
pnpm build
```

Browser acceptance covers `/study`, the authenticated dashboard preview, goal creation, task completion, postponement, responsive seven-day layout and anonymous login boundaries.
