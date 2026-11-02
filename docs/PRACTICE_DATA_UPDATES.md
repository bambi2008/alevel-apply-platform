# Adding practice questions without code changes

## Files

- `data/question-bank/practice-base.json`: losslessly extracted existing source data. Release gates still exclude quarantined items and apply existing reviewed corrections. Do not edit this baseline as a weekly release.
- `data/question-bank/practice-baseline.json`: original per-exam source/released counts and content fingerprints, plus all 85 active fixed-paper fingerprints. This is acceptance evidence, not an invented release.
- `data/question-bank/corrections-20261026.json` and `content-manifest-20261026.json`: separately reviewed corrections with original snapshots, new IDs and frozen revised practice/paper fingerprints. The original baseline is still asserted unchanged, including all historical paper versions. These files are not the weekly addition mechanism.
- `data/question-bank/practice-updates.json`: append weekly `addition` records here. Each release contains its own questions, bilingual title/summary, date, two independent review references, and question fingerprints. New questions enter topic practice only.

## Weekly flow

1. Append a release with a unique id, `kind: addition`, `status: draft`, one exam's existing topic IDs, and never-before-used question IDs (up to 100 characters). Follow the exam/module naming rules already enforced by `assessSyllabusCandidate`; do not rename an out-of-scope question to bypass review. Fill all solutions and marks. The subject specialist must check mathematics, syllabus, originality/rights and difficulty; a separate teaching reviewer checks clarity, distractors and explanations.
2. Record the actual independent review references in `subjectReview` and `teachingReview`; identical references are rejected for new content. These strings are audit evidence, not an automated certificate of correctness.
3. Record `questionFingerprints[id] = practiceContentFingerprint(question)` after review. The helper canonicalises JSON object key order. JSON formatting changes do not invalidate approval; content changes do. Use the existing TSX tool to invoke the helper; do not modify the application loader or mock files.
4. Set `status: published` only for an approved release and a truthful publication date. All records in this file must validate, including drafts. Do not insert a future-dated “published” release or fabricate history. The site shows up to three latest published records per exam; zero-question baseline entries clearly state that no questions were added.
5. Run `pnpm typecheck`, `pnpm test` and `pnpm audit:questions`. Resolve validation errors; do not weaken frozen approvals. The fixed-paper fingerprint test must remain unchanged. A deployment remains separately authorised; a data-only edit does not publish itself.

Existing mock files and old raw TS banks remain as immutable paper/history dependencies. They are not the weekly practice-addition mechanism and are not deleted. Answer keys and saved attempts retain their old identities. Rewriting historical baseline content or adopting the separate October 25 corrections requires its own reviewed, versioned migration rather than a weekly addition.

Metadata-only `correction` records have an empty `questions` array and describe the independently versioned correction; they cannot inject questions or change a paper. Their review references identify actual evidence, not a claim that an independent expert has certified the content. Weekly `addition` records cannot supersede existing IDs or papers.

## Operational retention

- `pnpm exec tsx scripts/run-study-retention.ts` is a dry-run by default. It reports counts only.
- `--apply` explicitly deletes eligible study data. Do not run against production without an authorised release/preflight.
- The production launcher starts a daily worker at 03:00 Asia/Shanghai after migrations, unless `DATA_RETENTION_ENABLED=false`. Builds and normal local dev do not run a purge. The worker uses a PostgreSQL advisory lock to avoid concurrent purges.
- Feedback, exam sessions/answers, answer photographs (bytes before metadata), AI evaluation records, interview/assessment learning payloads, saved answer-progress snapshots and exam-related learning-event metadata use the same inclusive creation-age cutoff of 365 days. Accounts, consent records, statement drafts, application documents and backup-retention settings are not silently deleted or changed.
- Failed photo deletion keeps metadata for retry; the job returns a nonzero failure indication. Logs contain aggregate counts or a generic failure code, never a student ID, answer, object key or secret.
- Production deployment and live deletion remain paused. Verify an isolated 366/364-day fixture first. Account retention, backup expiry and actual provider/location disclosures remain separate unresolved October 25 policy items.
