# Exam syllabus remediation — 2026-10-06

This record describes a local code release, not a deployed site or a subject-expert certification of every solution.

## Scope and source boundary

All 13 supported exam IDs were inventoried. Current official requirements, historical requirements and unverified preparation scope are kept distinct. Sources are registered in `lib/tests/syllabus-policy.ts`.

- ESAT / TMUA: the UAT PDFs currently cover October 2026 and January 2027. ESAT Mathematics 1 has no calculus. Mathematics 2/TMUA calculus is limited to rational powers and their sums/differences; complex numbers, matrices, general differential equations and advanced probability distributions are not imported from A-Level or STEP. TMUA official specimens have variable option counts, including A–H.
- STEP: the OCR 2026 specification separates Mathematics 1/2 from Mathematics 3. Complex numbers and 2×2 matrices can be STEP 2; De Moivre, general complex roots, planes/vector products and Maclaurin work are STEP 3. Unprovided eigenvalue techniques were removed. Novel defined concepts are not automatically out of scope if adequate guidance is supplied.
- CAIE 9709: Pure 3 R3 has 176 written questions and 16 fixed 11-question / 75-mark / 110-minute papers. Original/R2 IDs remain history-only. Vector planes are not returned to new P3 practice.
- UCAT / LNAT / TARA / IELTS: language, given-text reasoning and prescribed numerical skills are not treated as requiring professional medical/legal/science knowledge. UCAT has four modules, not Abstract Reasoning; standalone writing/language sets are not advertised as complete multisession examinations.
- BMO1 uses six written proof questions, not short MCQ or BMO2 sets as its complete-paper catalogue.
- MAT / PAT are historical preparation, not current admissions tests.
- BPhO / CSAT: a sufficient current official finite content/format specification was not obtained. Unverified university-level prerequisites are excluded; retained materials are explicitly bounded preparation, not a promise of a current full official paper. BPhO Round 2 is not offered as Round 1.

## Released inventory

| Exam | New practice questions | Fixed training papers |
| --- | ---: | ---: |
| MAT | 207 | 7 |
| STEP | 209 | 4 |
| ESAT | 135 | 6 |
| TMUA | 222 | 11 |
| PAT | 244 | 8 |
| LNAT | 34 | 8 |
| TARA | 204 | 9 |
| BPHO | 248 | 2 |
| BMO | 329 | 3 |
| UCAT | 32 | 5 |
| IELTS | 10 | 4 |
| CSAT | 16 | 2 |
| CAIE9709 | 176 | 16 |
| Total | 2066 | 85 |

ESAT's six combinations reuse five module banks and the same questions in practice. They are not six unseen papers. Each combination begins with Mathematics 1 and two distinct course-dependent modules, with 27 questions and 40 minutes per module. Topic inventory coverage is not the same as complete official specification coverage.

## Delivery gates

- New practice, adaptive selection, database-published questions and fixed-paper starts share the scope/release gates.
- ESAT practice requires a single selected module; STEP practice distinguishes STEP 2/3.
- A complete nonempty frozen manifest exists for every exam. Content changes invalidate approval; build/publish does not auto-approve new hashes.
- Database dual review cannot silently replace a reviewed static question. New/modified authored questions must receive a separately verified syllabus release.
- Old paper links show an isolation notice, not an active runner. Raw question/paper IDs remain available for historical reports and answers.
- Misleading topics, old study plans and contaminated teaching examples are not exposed as current scope.

The text classifier is conservative triage, not a proof that every method or answer is mathematically correct. The frozen manifest detects content drift; it is not a cryptographic signature or a substitute for independent subject review.

## Verification and limitations

Full regression after the final MAT spot review: 65 files / 423 tests passed, including eight actual adaptive-route cases. Focused tests check nonempty inventories for all exams, question ownership, all ESAT triples, module selection, STEP levels, P3 preservation, content mutations and history compatibility. Numerical spot checks and every ESAT formula's KaTeX rendering pass.

The released-bank audit reports zero critical structural/semantic findings and 14 explicit coverage/difficulty warnings. ESAT retains a reuse warning and six hard-item calibration warnings; TMUA retains three difficulty/logic-template warnings. No difficulty labels were inflated to erase these warnings.

Authenticated real-student saving and handwriting grading were not exercised. This task has not changed either public deployment.

Final isolated optimized build and TypeScript checks pass with 28 generated static pages. At the loopback-only final preview (127.0.0.1:3113), all 13 catalogue URLs and 13 JS/CSS resources return HTTP 200; the total paper link count is 85. A real anonymous browser confirms the quarantined MAT paper has an isolation notice, no exam-start button, no horizontal overflow and no KaTeX errors. Earlier browser acceptance also verifies ESAT's five module choices, 27-question module selection, three 27-question / 40-minute paper sections and obsolete lesson isolation at desktop and mobile sizes. The original formatting-only tsconfig changes are preserved; no Git commit, push or deployment occurred.

## Primary references

- [UAT official preparation and specifications](https://esat-tmua.ac.uk/prepare/)
- [TMUA official past/specimen papers](https://esat-tmua.ac.uk/tmua-preparation-materials/)
- [STEP 2026 specification](https://www.ocr.org.uk/Images/696329-step-specification-2026.pdf)
- [Cambridge 9709 2026–2027 syllabus](https://www.cambridgeinternational.org/Images/697427-2026-2027-syllabus.pdf)
- [MAT final historical syllabus](https://www.maths.ox.ac.uk/system/files/attachments/syllabus_1.pdf)
- [Oxford historical PAT papers](https://www.physics.ox.ac.uk/study/undergraduates/how-apply/engineering-and-science-admissions-test-esat/pat-past-papers)
- [UCAT format](https://www.ucat.ac.uk/about-ucat/test-format-and-scoring/)
- [LNAT format](https://lnat.ac.uk/what-is-lnat/)
- [TARA content specification](https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/08142350/TARA_Content_Specification.pdf)
- [IELTS Academic samples](https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test)
- [BMO1](https://ukmt.org.uk/senior-challenges/british-maths-olympiad-round-1)
- [Cambridge computer science / college assessment context](https://www.undergraduate.study.cam.ac.uk/courses/computer-science-ba-hons-meng)
