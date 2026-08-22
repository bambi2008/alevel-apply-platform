# Execution Plan

Updated: 2026-08-22
Branch: `codex/core-four-redesign`

## Final Goal

Deliver a separate Beta version of QiaoShen focused on four core capabilities:

1. Entrance exam and A-Level practice and timed mocks.
2. Academic competitions and subject-related practical enrichment.
3. University interview training.
4. Personal statement training.

The experience must be direct and clear: after sign-in, students choose one of the four core capabilities. Existing exam pages must retain exam structure, knowledge points, history, and pre-study analysis.

## Immutable Constraints

- Preserve the existing production site and data. The redesigned Beta remains separate at `beta.qiaoshenedu.com`.
- Do not restore application-management or unrelated tool features to the four-core Beta.
- Keep the four exam subareas: structure, knowledge, history, and pre-study analysis.
- Registration must capture intended universities and majors, and the site must expose only relevant exams and subjects.
- Engineering majors, especially aerospace and aeronautical engineering, must retain CAIE 9709 mathematics.
- New questions must be original, researched, high quality, elevated in difficulty, and covered by structural and quality audits.
- The first student cohort remains invite-only.
- Never commit real API keys, passwords, secrets, server environment files, logs, caches, build output, or temporary files.
- Update this file after every verifiable subtask. After context compression or a new session, read only `AGENTS.md` if present, this file, `git status`, `git diff`, and files directly related to the current milestone.

## Acceptance Criteria

- Four-core navigation and post-login entry are complete and no unrelated application/tool workflow is exposed.
- The unwanted interview "training method" selector is removed without breaking interview entry points.
- Intended universities and majors are collected during account creation and persisted server-side.
- Exam and subject visibility is driven by the student's saved intent; engineering/aerospace users see CAIE 9709.
- CAIE 9709 question volume increases from 44 to 88 with four additional fixed 11-question papers and passing audits.
- Interview mathematics increases from 2 to 6 high-quality prompts and physics from 2 to 6, with passing audits.
- AI interview configuration supports explicit enablement, a server-only DeepSeek key, cross-border consent, and actionable disabled/missing-key errors.
- Relevant type checks, lint, focused tests, production build, desktop checks, and mobile checks pass.
- Beta deployment is healthy and the original production deployment remains unaffected.

## Completed Work And Evidence

- Four-core product direction and dashboard implemented: commits `939a9d7`, `ebc9321`, and `e241731`.
- Independent and same-host Beta deployment paths implemented: commits `4c85e3f` and `471e9e6`.
- CAIE 9709 research, knowledge structure, 44 questions, and four fixed P3 papers implemented: commits `4836ac4` and `367b7e2`; focused tests live in `lib/tests/mock-papers/caie9709-p3-papers.test.ts`.
- ESAT calculus and hard-mathematics expansion implemented: commit `891450b`.
- Existing exam pages retain structure, knowledge, history, and pre-study analysis.
- Beta domain and same-host containers have previously returned a healthy `/api/health` response; production and Beta use separate configuration and data.
- AI interview configuration now distinguishes disabled and missing-key states; the example environment and same-host operations guide document the DeepSeek and cross-border-consent settings. `git diff --check` and `pnpm typecheck` passed; targeted ESLint remains pending because the local workspace does not expose the `eslint` executable.
- Removed the interview training-method selector and its presentation-only metadata while preserving the direct subject interview list and all `/interview/[subject]` workflows. The entry copy now sends students directly to a training direction; `pnpm typecheck` passed.
- Registration now requires intended universities and intended majors, normalizes and validates 1–10 entries for each, and persists both arrays to `StudentProfile` in the same server transaction as account creation. Added the `intendedUniversities` migration; Prisma schema validation, three focused unit tests, `pnpm typecheck`, and `git diff --check` passed.
- Exam visibility now derives from saved university, major, and enrolled-subject intent. The tests center filters both cards and available subject tabs, keeps IELTS as the common UK/HK requirement, limits CSAT to Cambridge computer-science intent, and explicitly retains CAIE 9709 for engineering, aerospace, aeronautical, and mechanical intent in English and Chinese. Seven focused mapping tests passed alongside the three registration-intent tests; `pnpm typecheck` and `git diff --check` passed.
- CAIE 9709 P3 expanded from 44 to 88 original questions and from four to eight fixed 11-question papers. Each paper remains 110 minutes and 75 marks. New work was checked against the official Cambridge 2026–2027 P3 syllabus and passed five focused suites covering IDs and whole-question fingerprints, the nine-topic P3 allowlist, per-part answer completeness, difficulty marks, topic/paper balance, and independent recomputation of all four new iterative answers; `pnpm typecheck` and `git diff --check` passed.
- Mathematics and physics interview banks each expanded from two to six prompts. Each subject now has four explicitly marked challenge prompts with a timebox, format, at least four assessed skills, a full reasoning path, and three staged follow-ups. Five content/difficulty audits and five existing quantitative-interview regression tests passed; `pnpm typecheck` and `git diff --check` passed.
- Final local acceptance passed: all 260 Vitest tests, full TypeScript checking, Prisma schema validation, a production build, and ESLint across 524 tracked JavaScript/TypeScript files completed successfully. Desktop (1440×900) and mobile (390×844) browser checks verified the interview entry points, intent-filtered exam list, registration intent fields, zero horizontal overflow, and zero browser console errors. The registration hero was corrected to use an existing production asset after the HTTP resource check identified the stale image path.
- The verified implementation was committed as `4fe431e` and pushed to `origin/codex/core-four-redesign`; logs, caches, temporary files, build output, secrets, and the pre-existing `tsconfig.json` line-ending-only state were excluded.
- The same-host Beta checkout at `/opt/qiaoshen-core-beta` was safely fast-forwarded from `471e9e6` to `df4a61e` through Tencent Cloud Automation Assistant. The server-only `.dockerignore` addition for `backups-core-beta/` was verified non-conflicting and preserved; no production container was changed.

## Current Milestone

Deploy and verify the Beta without modifying production.

## Remaining Tasks

1. Deploy and verify the Beta without modifying production.

## Confirmed Decisions - Do Not Reopen

- The product is centered on four core capabilities, not a broad application-management platform.
- The redesigned product is stored and deployed separately from the original production experience.
- CAIE 9709 is part of entrance/A-Level preparation and remains visible for engineering and aerospace intent.
- AI interview uses DeepSeek when enabled; the real key stays only in the server environment.
- Student testing is controlled by email-bound, one-time invitation codes and a cohort cap.
- Question expansion prioritizes quality, originality, difficulty calibration, and auditability over raw volume.

## Current Blockers

- No code blocker is known.
- Tencent Cloud console access is available through the authenticated in-app browser, and Beta deployment is in progress through Automation Assistant; production must remain untouched.
- Real API keys and server environment values are external operational dependencies and must never be committed.

## Latest Verification Snapshot

- `git diff --check`: passed; only LF/CRLF conversion warnings were reported.
- `pnpm typecheck`: passed (`tsc --noEmit --incremental false`).
- Interview selector removal: passed targeted source check and `pnpm typecheck` on 2026-08-22.
- Registration intent persistence: Prisma schema valid; 3 focused tests passed; `pnpm typecheck` and `git diff --check` passed on 2026-08-22.
- Intent-driven exam filtering: 7 focused mapping tests (10 combined registration/filter tests) passed; engineering and aerospace retain CAIE 9709; `pnpm typecheck` and `git diff --check` passed on 2026-08-22.
- CAIE 9709 expansion: 88 unique questions across 8 fixed papers; all 5 duplicate/structure/answer/difficulty/balance audit suites passed; `pnpm typecheck` and `git diff --check` passed on 2026-08-22.
- Interview expansion: mathematics 6 prompts and physics 6 prompts; 5 content/difficulty audits plus 5 quantitative-interview regression tests passed; `pnpm typecheck` and `git diff --check` passed on 2026-08-22.
- Full Vitest suite: 49 files and 260 tests passed on 2026-08-22.
- Full tracked-source ESLint: 524 files passed with 0 errors and 2 pre-existing unused-variable warnings in `app/[locale]/tests/[testId]/page.tsx`.
- Production build: passed using an isolated local Next.js output directory to avoid a lock held by an unrelated existing process.
- Desktop/mobile browser acceptance: passed at 1440×900 and 390×844; intent filtering retained CAIE 9709 and excluded LNAT/CSAT for Cambridge aerospace intent, registration fields rendered, no horizontal overflow occurred, and browser console errors remained at zero.
- Local HTTP resource checks: interview, tests, and registration pages returned HTTP 200 with all page resources available after correcting the registration hero path.
- Git delivery: `4fe431e` pushed successfully to `origin/codex/core-four-redesign` on 2026-08-22.
- Pre-deployment Beta baseline: `https://beta.qiaoshenedu.com/api/health` returned HTTP 200 with `status: ok`; database and storage checks both reported `ok` before the pending server pull/rebuild.
- Pre-deployment public smoke: health, home, tests, background, interview, and statements all returned HTTP 200; `scripts/smoke-core-beta.mjs` reported `smoke passed` on 2026-08-22.
- Server checkout: `/opt/qiaoshen-core-beta` reached `df4a61e` by fast-forward on 2026-08-22; Beta Compose configuration validated, Beta app/database containers were healthy before rebuild, 33 GB disk space remained, and the separately named production containers stayed running.
