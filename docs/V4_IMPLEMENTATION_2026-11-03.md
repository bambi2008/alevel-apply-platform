# V4 implementation ledger

Source: owner's `__v4__Codex_2026-11-02.md`, read in full on November 3. Base source/records `38ff35d`, live production `a09c159`. Work branch `codex/v4-season-pass`. Preserve the owner's existing tsconfig formatting change and all historical questions/attempts. The v4 document overrides conflicting earlier content and sales decisions. **Owner review is required before deployment; purchases remain disabled and administrator-only until the owner completes and approves the live small-payment test.**

## Confirmed / pending decisions

- Confirmed: retain a keyed email deduplication identifier after account deletion until the new-user trial programme ends, solely to prevent repeated trials; disclose the purpose and period separately. It is not anonymous data. No raw email or new identity attribute is collected for this purpose.
- Confirmed: replace the earlier deferred delivery architecture with authenticated, membership-checked server question delivery; return answers/solutions after submission and preserve historical records. A browser-side gate is not sufficient.
- Confirmed: apply the wording restriction semantically. Preserve the exact supplied about-page narrative and accurate university-subject/syllabus uses; necessary exceptions are listed in `V4_WORDING_EXCEPTIONS.md`. Never change mathematical meaning or release fingerprints merely to pass a lexical scan.
- Review queue: exact purchase/about price wording, parent-payment hint (default off), mandatory refund exceptions, financial-record retention, administrator allowlist and provider-account setup. Existing confirmed account/backup/log policy is not reopened.
- No real payment, API key transfer, real reminder email, live AI billing or production mutation is performed in this implementation phase.

## Ordered units

| Unit | Work / acceptance | State |
| --- | --- | --- |
| V4-01 | Practice-tool language, high-school audience, official-past-paper terminology and visible AI reference notice | Source audit with owner-approved semantic exceptions. Owner review of exact About and purchase wording remains |
| V4-02 | Contact config, obsolete-contact removal and administrator env allowlist | Scoped source and built browser contact scans clean. Admin gates verified with fixture accounts |
| Prior required fixes | Reuse November 2 reviewed content and passing 707-test baseline; verify compatibility rather than redo | Existing |
| V4-03 | Trial/season-pass schema; Beijing natural-month arithmetic; strict expiry and renewal | Exam delivery and renewal passed fixture checks. Interview scope remains for owner review |
| V4-04 | Transactional 7×24h registration trial, keyed claim uniqueness and post-deletion deduplication | Database tests and expired account browser checks at login and practice passed |
| V4-05 | Purchase page/notices, unchecked consent, server price and versioned agreement | Disabled mobile page and checkout server agreement tests pass. Copy review and enabled real checkout pending |
| V4-06 | Provider port, official Mianbaoduo adapter, signed requests, mandatory query verification, transactional fulfilment and complaint handling | Adapter and payment fulfilment pass mocked and PostgreSQL checks. Complaint mail is queued for daily maintenance. Live merchant test pending |
| V4-07 | Once-only 7/1-day reminders, email preference, explicit renewal with no automatic debit | Database and fake-mail verification passed. Real mail pending owner test |
| V4-08 | Env-allowlisted administrator orders/members/audit/identity-limited CSV and revenue | Manual adjustment and audit pass database test. Student export blocked, admin CSV and mobile settings verified |
| V4-09 | 20/10/3 Beijing-day reservations, failed-call refund, private content cache, editable settings and usage reports | Threshold, timezone, cache and concurrent failure checks pass in PostgreSQL. Settings and defaults checked in browser |
| V4-10 | Owner-supplied bilingual about-page narrative; no invented personal facts | Both review drafts return 200 with noindex and fit a 390px browser. Price wording awaits owner review |
| V4-11 | Completed-session feedback once, optional question and enumerated reason, preserved editorial metrics, `/updates` | Route/DB checks and mobile end-to-end feedback pass |
| V4-13 | 365-day feedback/answer/photo/AI-cache cleanup; financial records excluded pending retention decision | Code and retention tests pass. Financial retention remains an owner decision |
| V4-12 | Bilingual pages, errors, notices, email and build/browser verification | New review and learner flows checked in browser and mail checked with a fixture. No exhaustive visual sweep of older admin screens |
| V4-14 | Disabled/admin-only live channel; actual order/receipt/email evidence and owner release approval | External gate |

## Review and release conditions

- November 6 review rollout: the owner authorized deployment to Beta. Beta runs `d3674f8`, the exact revision that passed GitHub Production check `42158167822`. Production remains on `a09c159`. Payments, new trial enrollment, AI provider calls and reminder delivery are disabled on the Beta review deployment. The rollback image, Beta database and encrypted pre-switch backup were verified at cutover. The public rollout must address continued exam access for existing students before changing production.

- Confirm the purchase scope and the price sentence on the About page. Interview pages still carry the existing development status. The purchase notice excludes interviews from the current paid offering while the owner decides whether to finish interview answer isolation in this release. Signed-in members' existing development preview still receives reference material on its server-rendered page.
- Confirm retention for financial records and complaint contact details. These are separate from the 365-day study deletion job. The account relationship is removed on account deletion while order evidence is retained. Existing users receive no retroactive trial or paid grant.
- Supply the administrator account list in `ADMIN_EMAILS`. A listed account must also have the ADMIN role. Merchant credentials belong only in server configuration. WeChat H5 requires the merchant-side domain approval. In WeChat's embedded browser, the purchase page directs the user to open an external mobile browser. On desktop the QR encodes the site's purchase page.
- After approval, keep `PAYMENTS_ADMIN_ONLY=true` for the owner-only small transaction, with the approved test amount and reminder email configuration. Capture payment-provider callback arrival, status, amount, membership expiry, dashboard entry, settlement and reminder email evidence. The webhook's real signature placement and acknowledgement are still unverified. Public checkout requires the owner's confirmation after that test.
- Operational choices for review: reminders are keyed by account, plan, expiry and day window. A failed or ambiguous email attempt is counted in operations and is not resent automatically. The cache is private to the account and keys on language, model, canonical prompt, submitted text and photo contents. The two marking passes and any adjudication consume one user action. Developer and review fixtures use fake accounts with outbound providers disabled.

Server-delivery verification: desktop and 390px checks cover keyless practice and paper delivery, receipt replay, early paper submission rejection, written-photo upload, saved reports, and session feedback. The legacy score-save route is closed and the remaining bank route applies membership and a question-only projection. Grade requests use the owned attempt and canonical mark scheme. The source graph covers 67 route entries with zero private client imports. The built audit found none of the 24 sampled private solution canaries in 156 browser chunks. This audit does not cover reference props in the development interview preview.

Score compatibility finding: the pre-v4 generated ORM client truncates fractional values if its integer columns are changed directly to floating point. The candidate migration therefore adds nullable `earnedExact` / `totalEarnedExact` columns instead and leaves old integer columns intact. V4 readers prefer exact values, falling back for all historical rows. Legacy rollback views retain their whole-mark display limitation; exact values survive in the additional columns for forward recovery. The revised candidate passes all 12 real PostgreSQL tests, including the previous generated client, canonical history idempotency and pending written work; the fixture database was removed. No existing migration or production database was edited.

## Primary-source notes

- [Mianbaoduo docs index](https://doc.mbd.pub/llms.txt), [signing](https://doc.mbd.pub/api/qian-ming-suan-fa.md), [query](https://doc.mbd.pub/api/ding-dan-cha-xun.md), [webhook](https://doc.mbd.pub/api/webhook-yi-bu-tong-zhi.md), [WeChat H5](https://doc.mbd.pub/api/wei-xin-h5-zhi-fu.md), accessed November 3. API amounts are integer fen; query state 1 means paid and 2 settled, but refund fields must also be checked. The signing page's narrative/code require ASCII-key sorting even though one worked-example ordering contradicts it; implementation must follow the normative algorithm, not copy that ordering. Webhook docs do not specify a signature shape or successful response body; live confirmation remains required. Never use the provider query for frontend polling.
- [DeepSeek model table](https://api-docs.deepseek.com/quick_start/pricing/) and [thinking-mode guide](https://api-docs.deepseek.com/guides/thinking_mode/), accessed November 3: API name `deepseek-flash`, model version `DeepSeek-V4.1-Flash-1017`, vision supported. Chat Completions uses top-level `thinking: { type: "disabled" }` across the active AI routes. Mocked grading requests assert this setting for text and vision. No paid request has been made.
