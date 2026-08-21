# Execution Plan

Updated: 2026-08-21
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

## Current Milestone

Remove the interview training-method selector while preserving direct interview workflows, then continue four-core personalization and content expansion in dependency order.

## Remaining Tasks

1. Remove the interview training-method selection section while preserving direct interview workflows.
2. Add intended-university and intended-major fields to account creation and persist them server-side.
3. Implement intent-to-exam/subject mapping and filtering; explicitly test that engineering and aerospace retain CAIE 9709.
4. Add 44 original CAIE 9709 questions as four fixed 11-question papers; run duplicate, structure, answer, difficulty, and paper-balance audits.
5. Expand interview mathematics from 2 to 6 prompts and physics from 2 to 6 prompts; run content and difficulty audits.
6. Run full typecheck, lint, focused tests, production build, desktop and mobile acceptance, then deploy and verify the Beta without modifying production.

## Confirmed Decisions - Do Not Reopen

- The product is centered on four core capabilities, not a broad application-management platform.
- The redesigned product is stored and deployed separately from the original production experience.
- CAIE 9709 is part of entrance/A-Level preparation and remains visible for engineering and aerospace intent.
- AI interview uses DeepSeek when enabled; the real key stays only in the server environment.
- Student testing is controlled by email-bound, one-time invitation codes and a cohort cap.
- Question expansion prioritizes quality, originality, difficulty calibration, and auditability over raw volume.

## Current Blockers

- No code blocker is known.
- Targeted ESLint cannot currently run because the local workspace does not expose the `eslint` executable; repair or reinstall the local dependency link before the final lint gate.
- Real API keys, server environment values, DNS, and deployment access are external operational dependencies and must never be committed.

## Latest Verification Snapshot

- `git diff --check`: passed; only LF/CRLF conversion warnings were reported.
- `pnpm typecheck`: passed (`tsc --noEmit --incremental false`).
- Targeted ESLint: not run because the local `eslint` executable is unavailable.
