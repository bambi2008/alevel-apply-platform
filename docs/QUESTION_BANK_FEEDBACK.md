# Question-bank improvement loop

Owner request: 2026-10-26. Local implementation; deployment remains paused.

## Measurement contract

- Source: authenticated STUDENT exam answers and question feedback, not page views, anonymous browser storage or staff test accounts.
- Window: rolling UTC `[generatedAt - 28 × 24 hours, generatedAt)`. Export records both exact bounds. No weekly email or automatic external publishing is configured; the administrator can export the current window each week.
- Population: one distinct student per exam/topic for participation. Only actual submitted answer content counts, not unanswered slots. For the error rate use the first answer to each content question per student in the window, avoiding repeat-practice inflation. Objective correctness is recomputed from the question; valid written marks remain provisional platform/AI feedback, not official marking. Unscored work is not a wrong answer.
- Actual written work means nonblank answer text or a nonempty, valid stored-photo ID list. Empty photo maps, malformed JSON and reserved UI metadata (including an essay-prompt selection alone) do not count as attempts. This predicate is shared by priority aggregation, diagnostics and performance reports.
- Feedback: ERROR, TOO_HARD and MORE_LIKE_THIS each count at most once per user/content question during the retention period. Identical practice/mock copies and option shuffles share a content identity. An edited prompt is a new question. Retrying a click never changes its original creation time. After the one-year record is deleted, a fresh click can create a new event; no permanent per-user tombstone is retained. The owner confirmed this retention-period deduplication boundary on 2026-10-26; do not add a permanent identity-bearing record.
- Fewer than five students: no score and no student/answer/feedback statistics in the table or export; show “样本不足 / Insufficient sample”. Public question counts are not personal data. If there are five students but no usable grades, show “评分不足 / Awaiting scores”, without fabricating an error rate.
- Comparison: only other scoreable topics in the same examination. Min–max normalise students, error rate and feedback; reverse the normalised current practice-question count for scarcity. An equal-valued component is neutral at 0.5. Weighted score: `100 × (0.40 participation + 0.25 error + 0.20 feedback + 0.15 scarcity)`, rounded to one decimal. A single eligible topic therefore scores 50, not 100. No cross-exam ranking or causal claim is made.
- Guardrails: “too hard” is not evidence of a wrong question. A high score is an editorial queue, not automatic content publication, automatic difficulty changes or a reason to lower standards. Current practice inventory supplies scarcity, never archived or mock-only questions.
- Privacy: administrator-only aggregates. Export contains no names, email addresses, account/student IDs, individual answers, photographs, IPs or free-text feedback. CSV formula injection is escaped. No synthetic observations are mixed into real dashboards.

## Retention and release boundaries

Feedback, answer records, uploaded answer photographs and AI feedback are subject to a 365-day automatic deletion job. Account and backup retention remain separate unresolved policies; neither is silently altered. The job must support dry-run and fixture-only boundary tests before any deployment. No live purge is authorized in this phase.

Weekly practice additions belong in data files and must not mutate the immutable mock registry, saved historical answer keys or historical attempts. The public update history records actual practice additions/baselines and metadata-only corrective versions, plus the latest three records per examination; it must not invent past releases. Corrective mock versions are a separately reviewed workflow, not a weekly addition.

## Pacing diagnosis

Fixed-paper pacing references use the historical paper's actual module duration: MCQ weights `0.75 + 0.25 × platform difficulty`, written weights by marks. Largest-remainder integer allocation preserves each compulsory module's total seconds. This is a platform reference, not an official time limit per question. Standalone practice without a known module retains its existing fallback reference.

For STEP/CSAT six-answer papers, offered-question pacing references are scaled to six counted answers; equal 20-mark questions in a three-hour paper receive 1,800 seconds each, whether 12 or 8 are offered. Offered-reference totals can therefore exceed the clock; this does not extend the exam or require all offered questions. Written questions of unequal marks use proportional references. Completion and time pressure use six required answers, while unselected questions do not become errors, conceptual gaps or topic weaknesses. Actual marks, timers, saved work and best-six score selection are unchanged.

## Deferred deployment checklist

- Do not deploy, migrate or purge production in this phase. The new feedback table requires the sixteenth migration as part of a separately authorised, backed-up release.
- Verify `APP_ORIGIN` is the exact public HTTPS origin (or that the reverse proxy supplies the same origin in NextRequest). Never relax the feedback origin check to make a misconfigured deployment work.
- Run the retention command without `--apply` first; review aggregate counts. Daily cleanup only starts with the authorised production launcher/worker. Normal development, builds and this isolated E2E run do not start the worker.
- The real browser fixture uses an explicit loopback-only database, uniquely named build directory, private tmp storage, a local-only authentication secret and the existing explicit local-production-storage opt-in. This opt-in applies only to that disposable fixture; application defaults and live configuration remain unchanged.
