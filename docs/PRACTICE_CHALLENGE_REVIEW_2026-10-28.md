# October 28 practice-only additions: review evidence

Scope: seven original questions, never a fixed-mock change. The owner authorized one read-only independent assistant in this chat. This record identifies the author and that one assistant; it is not a claim of two external experts, human certification, official difficulty calibration or empirical student validation.

## Author calculation checks

The primary author recomputed energy/momentum, resonance orders, node charges, thermal endpoints, photoelectric energies, integer factor pairs and quantifier witnesses. Eleven tests in `lib/tests/questions/weekly-challenge-20261028.test.ts` now include the added all-order parity argument, general thermal parameters and oblique transmission. These are computational/supporting checks, not a substitute for the independent review. The approved data fingerprints below bind the calculations and review to the actual JSON; passing a hard-coded numerical example alone would not bind a changed prompt.

## Independent review

Reviewer: `/root/review_practice_seven`, one separately running assistant, read-only. It checked both subject content and teaching clarity, recomputed all answers, examined nearby existing practice and read the primary TMUA specification. It did not access student records, credentials or paid APIs, modify files, commit or deploy.

The first snapshot SHA-256 was `a5a7d9c3a801c002f85029a80b4e890eb753e354816e322baf4b3d53ac858d99`. It accepted mechanics, capacitor redistribution and both TMUA items but found the original waves, thermal and modern-physics questions too routine for level 3. Those drafts were not activated.

The revision added genuine inference rather than changing labels: all-harmonic exact-resonance impossibility, a thermal parameter range and endpoint/path distinction, and an oblique electric-barrier argument. The reviewer caught an incorrect side claim that absolute resonance-frequency gaps could become arbitrarily small, and an ambiguity between positive conductance and permanently positive heat flow. Both were corrected.

The reviewer re-read the actual final file and unconditionally accepted all seven for practice-only inclusion. Final file SHA-256: `0e7e3c727c490eb57cee1912b87a7a5a2783e53d12144f59ddbbaa807dd49aff` (`data/question-bank/candidates-20261028.json`). This staging snapshot remains labelled draft as an archive of the authoring process; only exact approved question copies enter the published local data records. Deployment remains separate and paused.

| Question suffix | Marks | Independent result and reasoning |
| --- | ---: | --- |
| mechanics-01 | 10 | Accept. Momentum gives `V/u=-sqrt(3)/8`; total kinetic energy `13mu²/32`, ramp energy fraction `9/52`. Relative/lab velocities are distinguished. |
| waves-01 | 14 | Accept after revision. `lambda=.680m`, `delta=.015m`, effective-coordinate nodes `.170/.510m`, cooled fundamental physical length `.145m`. Common resonance would require `71(2j-1)=68k`, impossible by parity. Exact lengths, zero bandwidth and frequency-independent correction are stated; no arbitrary-small absolute-gap claim. |
| em-01 | 10 | Accept. Isolated node charges `(-2,1,1)CV`; solve `3VB-2VD=V`, `-2VB+5VD=V`. Final energy `6CV²/11`, dissipation `27CV²/11`; choosing a zero reference is not grounding. |
| thermal-01 | 15 | Accept after revision. `Tf=5T/3`, final volumes `2V/3,4V/3`, pressure `5nRT/(2V)`. In the general case initial expansion and final compression hold exactly for `1<r<alpha`. Endpoint data do not determine net heat or maximum displacement. Release-time initial conditions, impermeability, finite mass/conductance and no static sticking are explicit. |
| modern-01 | 13 | Accept after revision. Work function `E/3`, threshold `3lambda`, axial filter interval `[E/(6e),2E/(3e))`. In the separate planar barrier only normal kinetic energy can overcome the barrier: `theta<45°`; equality has zero forward exit speed and 60° reflects. No ambiguous oblique magnetic-radius claim. |
| number-01 | 1 | Accept. Independently enumerated coprime factor pairs of 180; only `(4,45)` has sum divisible by 7. Thus `(a,b)=(48,540)`, difference 492, option C. Distractors reflect identifiable errors. |
| logic-01 | 1 | Accept. Completing the square gives S exactly for `abs(k)>=1`. T forces `y=0` by `x=0`, contradicted by `x=1`. Option C; equalities retained. |

The reviewer accepts platform-reference level 3 for the enhanced questions, with no official-equivalence guarantee. It found no clear change-numbers-only duplicates; the extra parity problem makes the acoustic item materially different from the earlier end-correction exercise.

## Scope and limits

- [TMUA primary 2026/27 specification](https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/03165619/TMUA_Content_Specification.pdf): HCF/LCM and prime factors (M2.3), completing the square (MM1.3), quantifiers/counterexamples (Arg3 and proof sections).
- [BPhO Round 1 primary page](https://www.bpho.org.uk/bpho/round-1/) returned 403 during this review. Do not claim its current complete specification was verified or that BPhO approved these questions. These are bounded secondary-school physics extension problems with the needed models supplied, under the platform's practice scope.
- The review did not establish full formal-exam coverage, official mark schemes, psychometric difficulty, student success rates or a complete copyright search. The problems were authored for this task, not copied from the login-only question website.
- Author calculation review and this one independent content/teaching review are separate recorded actors. `subjectReview` and `teachingReview` point to these actual sections, not invented certificates.
- New IDs, full prompt/solution/answer/mark fingerprints and all 85 fixed-paper hashes must pass final automated checks. No existing ID is overwritten. Publication in the local data file does not mean production has been deployed.
