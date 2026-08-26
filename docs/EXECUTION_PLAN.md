# Execution Plan

Updated: 2026-08-27
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
- Beta release `5034ab5` was built and started with `compose.core-beta.same-host.yml`. The production environment preflight passed; the only warning was that optional Sentry/webhook external alerting is not configured. Beta app and backup containers were recreated from the new image while the existing healthy Beta PostgreSQL container and all separately named production containers were left in place.
- Post-deployment routing verification found and corrected a shared-network DNS collision: the production Caddy upstream `app:3000` could resolve the same-host Beta service's `app` alias. The production route now uses the unique `qiaoshen-app-1:3000` container name. Caddy validation and a graceful reload passed; production immediately returned its unchanged `367b7e2` release while Beta returned `5034ab5`, and neither application nor database container was restarted.
- The quantitative interview practice bank now presents the five-step thinking framework once above the exercise list instead of repeating it inside every question card. Questions now begin directly with the prompt while retaining metadata and expandable thinking hints. Focused TypeScript checking and `git diff --check` passed; desktop and mobile browser checks confirmed one framework, six working hint controls, no horizontal overflow, and zero console errors. Isolated `.next*` build directories are now ignored so binary preview artifacts cannot pollute Tailwind source scanning.
- The cleaner interview practice-bank layout was committed as `795f8ee`, pushed to `origin/codex/core-four-redesign`, and deployed only to the same-host Beta checkout. Beta rebuilt successfully and reports release `795f8ee`; its existing PostgreSQL container remained healthy.
- The Beta container recreation exposed the previously loaded production Caddy config's stale `app:3000` route again. The persisted host config was already correct at `qiaoshen-app-1:3000`; that validated config was copied to a temporary container path and gracefully hot-reloaded. Public production and `www` remained on release `367b7e2`, Beta returned `795f8ee`, and the production app, database, and Caddy containers retained their existing uptimes.
- Four-core entry-page visual audit completed from the supplied desktop captures. Interview is the reference: a shared-width title block, restrained dividers, compact secondary controls, and border-separated rows. Tests currently diverges through a hero image and dense cards; background through oversized tabs, cards, and full-width buttons; statements through a narrow shell, icon-heavy process strip, and boxed notices. The redesign will preserve each workflow while moving all four entry pages to the interview hierarchy.
- Shared four-core layout primitives now provide the same 6xl shell, title hierarchy, compact tab treatment, section heading, and border-separated list across tests, background, interview, and statements. Tests no longer uses a hero image or card grid; background recommendations and project entries are rows with text actions; statements uses the same shell and restrained process/region navigation. Existing filters, planning actions, question-bank links, editors, coaching, and saving behavior remain wired. `pnpm typecheck` and `git diff --check` passed.
- Four-core entry-page browser acceptance passed. Direct desktop checks covered all four routes and their principal tabs/filters with zero console errors or horizontal overflow; local resource audits returned HTTP 200 with no failed assets. Mobile-width captures confirmed the shared responsive shell and stacked row treatment. Side-by-side comparisons against the supplied interview reference are recorded in `design-qa.md`; no material P0-P2 visual discrepancy remains.
- The unified four-core entry pages were committed as `b5ec778`, pushed to `origin/codex/core-four-redesign`, and deployed only to the same-host Beta application. The Beta image completed Prisma generation, Next.js production compilation, TypeScript checking, and static-page generation before the app reached healthy status. Public Beta reports release `b5ec778`; production and `www` continue to report `367b7e2`, with production app/database/Caddy uptimes preserved.
- A site-wide footer feedback contact now exposes `mao8teen@gmail.com` in both Chinese and English. The address is a direct `mailto:` link with a prefilled “桥申 Beta 使用反馈” subject so students can report issues without locating a separate form. Commit `6df5df5` passed TypeScript and rendered-link checks, was pushed to GitHub, and is healthy on Beta; production remains unchanged.
- Homepage first-screen density audit completed from the supplied 1440-class desktop capture. The two-column card layout is appropriate, but the tall title block, 250 px minimum card height, and generous card padding push the second row below the viewport. The next revision will keep the same four links and content while reducing only vertical spacing and card height so the full 2×2 set is visible without scrolling.
- The homepage dashboard now uses a compact title block and 190 px two-column cards. Each card groups its icon, title, and subtitle in one row, keeps the full description and tags, and places its action beside the tags to remove unused vertical space. All four destinations and focus/hover behavior remain unchanged; `pnpm typecheck` and `git diff --check` passed.
- Homepage first-screen browser acceptance passed at 1280×720: both card rows are fully visible, with the second row ending at 649 px, and no horizontal overflow. The tests entry navigation/back path worked, browser console errors and warnings remained at zero, and 21 local page resources returned without failure. The normalized source/implementation comparison and measured bounds are recorded in `design-qa.md` with `final result: passed`.
- The compact homepage was committed as `89bf914`, pushed to `origin/codex/core-four-redesign`, and deployed only to Beta. The Beta image completed Prisma generation, Next.js production compilation, TypeScript checking, and container health checks. Live Beta at 1280×720 shows all four card bottoms at or above 649 px; the tests navigation/back path worked with zero console errors or warnings. Beta reports release `89bf914`; production remains healthy on `367b7e2`.
- The four June 2026 China-region CAIE 9709 candidate reports were reviewed page by page. Scores were 72/75 for 9709/15, 51/75 for 9709/35, 49/50 for 9709/45, and 49/50 for 9709/55. Pure Mathematics 3 is the clear intervention priority: question 11 lost 11 of 12 marks across three-dimensional vector proof, point-to-line distance, and exact area; secondary gaps are convergence domains, completing a normal equation, graphical uniqueness, fixed-point iteration precision, exact trigonometric integration, and finishing requested answer forms.
- Eight additional original Pure Mathematics 3 papers now expand the bank from 88 to 176 questions. Each new paper has 11 structured questions, 75 marks, all nine P3 topics, exactly 12 foundation marks and 37 high-difficulty marks. A code-level targeted-ID register identifies exactly 44 of the 88 additions as candidate-error practice covering binomial validity domains, converting transformed parameters to the requested answer, complete normal equations, graph/iteration discipline, exact trigonometric integration, and the four highest-priority vector questions. Focused structural, uniqueness, answer-completeness, balance, 44/88 ratio, and eight iterative-answer audits pass; TypeScript checking also passes.
- The expanded CAIE 9709 bank now covers every difficulty level in every one of its nine topics. The repository-wide question audit reports 2,766 questions and 130 papers with CAIE 9709 at 176 questions, 16 written mocks, 9/9 topics, zero critical findings, and zero warnings. The strengthened CAIE-specific suite has seven passing audits, including exact 44/88 candidate-error coverage and fixed skill-slot checks.
- Local acceptance is complete: all 49 Vitest files and 262 tests pass, TypeScript checking passes, `git diff --check` passes, and an isolated Next.js 16 production build completes compilation, type validation, page-data collection, and all 27 static pages. Full source lint completes with zero errors; its three warnings are pre-existing unused declarations outside this milestone, while every changed TypeScript file is clean. The isolated build output is ignored and its temporary `tsconfig.json` additions were removed, preserving the user's pre-existing line-ending-only state.

## Current Milestone

Double the CAIE 9709 Pure Mathematics 3 bank from 88 to 176 original questions. Exactly 44 of the 88 new questions must target the June 2026 candidate's demonstrated error types, while the other 44 preserve broad P3 syllabus coverage; retain complete 75-mark fixed-paper structure and auditability.

## Remaining Tasks

1. Commit and push the verified question-bank expansion without logs, caches, temporary/build output, secrets, or the pre-existing `tsconfig.json` state.
2. Deploy only to Beta and verify both Beta and the unchanged production release.

## Confirmed Decisions - Do Not Reopen

- The product is centered on four core capabilities, not a broad application-management platform.
- The redesigned product is stored and deployed separately from the original production experience.
- CAIE 9709 is part of entrance/A-Level preparation and remains visible for engineering and aerospace intent.
- AI interview uses DeepSeek when enabled; the real key stays only in the server environment.
- Student testing is controlled by email-bound, one-time invitation codes and a cohort cap.
- Question expansion prioritizes quality, originality, difficulty calibration, and auditability over raw volume.

## Current Blockers

- No code or deployment blocker is known.
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
- Homepage compact-layout delivery: commit `89bf914` pushed and deployed to Beta on 2026-08-22; live card bottoms were 440 px and 649 px at 1280×720, with no console errors or warnings and a working tests navigation/back path.
- Post-deployment continuity: Beta health reports release `89bf914` with database and storage `ok`; production health remains release `367b7e2` with database and storage `ok`.
- Server checkout: `/opt/qiaoshen-core-beta` reached `df4a61e` by fast-forward on 2026-08-22; Beta Compose configuration validated, Beta app/database containers were healthy before rebuild, 33 GB disk space remained, and the separately named production containers stayed running.
- Beta build/deploy: image `qiaoshen-core-beta:local` built successfully at release `5034ab5`; production environment preflight passed, Beta app/backup containers restarted, and the Beta PostgreSQL container remained healthy on 2026-08-22.
- Same-host routing correction: Caddy config validation and graceful reload passed on 2026-08-22. Local TLS host checks returned production release `367b7e2` and Beta release `5034ab5`; production app, database, and Caddy containers retained their 6–8 day uptimes.
- Final public acceptance: DNS for production, `www`, and Beta resolves to `124.156.182.110`; direct HTTPS returned production release `367b7e2` and Beta release `5034ab5`, while `www` redirected to the production origin and retained release `367b7e2`. Beta home, tests, background, interview, and statements routes all returned HTTP 200. Database and storage health checks were `ok` for both deployments.
- Interview practice-bank cleanup: `pnpm typecheck` and focused `git diff --check` passed on 2026-08-22. The workspace still does not expose a runnable ESLint executable, so the focused ESLint command could not start.
- Interview practice-bank browser acceptance: at 1440×900 and 390×844, the five-step framework rendered exactly once, all six thinking-hint controls remained interactive, document width stayed within the viewport, and console errors remained at zero. The local page and 22 referenced resources returned HTTP 200. Visual comparison is recorded in `design-qa.md` with `final result: passed`.
- Interview practice-bank delivery: commit `795f8ee` was pushed and deployed to `beta.qiaoshenedu.com` on 2026-08-22. The live page rendered exactly one five-step framework, restored all six hint controls after an expand/collapse check, and had no horizontal overflow at the public desktop viewport.
- Post-deployment isolation: public HTTPS checks returned production and `www` release `367b7e2` and Beta release `795f8ee`; database and storage checks were `ok` for both. Production app and database containers were not restarted, and their 6–8 day uptimes were preserved.
- Four-core visual unification: `pnpm typecheck` and `git diff --check` passed on 2026-08-22. Desktop checks at 1280×720 exercised tests subject filters, background mode tabs, interview entry, and statements region switching; all four pages had zero console errors and no document overflow. Local HTTP checks found no failed resources, and responsive 390×844 captures plus source/implementation comparisons are documented in `design-qa.md` with `final result: passed`.
- Four-core deployment: commit `b5ec778` was pushed and deployed only to `beta.qiaoshenedu.com` on 2026-08-22. Public health checks returned Beta release `b5ec778` and production/`www` release `367b7e2`; database and storage checks were `ok` for both. The Beta app and backup containers were recreated, the existing healthy Beta PostgreSQL container was retained, and all production containers kept their prior uptimes. Live Beta interaction checks passed for tests subject filtering, background mode switching, interview mathematics entry, and statements UK/Hong Kong switching.
- Footer feedback contact: `pnpm typecheck` and `git diff --check` passed on 2026-08-22. The local Chinese footer rendered exactly one `mailto:mao8teen@gmail.com` link with the encoded Beta-feedback subject.
- Footer feedback deployment: commit `6df5df5` was pushed and deployed only to Beta on 2026-08-22. Public Beta health returned release `6df5df5`; the live footer exposed the expected email link and subject. Production health remained release `367b7e2`, with database and storage checks `ok` for both deployments.
- Homepage first-screen verification: `pnpm typecheck`, `git diff --check`, direct browser interaction, console inspection, and local HTTP resource checking passed on 2026-08-22. At 1280×720, all four cards were fully visible and the document had no horizontal overflow. Source/implementation evidence is recorded in `design-qa.md` with `final result: passed`.
- June 2026 candidate diagnostic: all relevant pages of components 15, 35, 45, and 55 were rendered and inspected on 2026-08-27. The 9709/35 score table and script identify 11(b) and 11(c) as zero/unattempted, 11(a) as 1/4, and smaller losses in 1(b), 3, 4(b), 5(b), 8(a), 8(d), and 9(b); the other three components lost only five marks in total.
