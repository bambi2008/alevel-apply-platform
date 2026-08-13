# LNAT fixed-paper audit

Audit date: 2026-07-21

## Official structure

The current LNAT format requires:

- Section A: 42 four-option questions in 95 minutes;
- 12 argumentative passages, with three or four questions attached to each passage;
- Section B: one essay selected from three prompts in 40 minutes;
- a recommended maximum of 750 words for Section B.

Primary sources:

- https://lnat.ac.uk/what-is-lnat/test-format/
- https://lnat.ac.uk/how-to-prepare/practice-test/

The official practice page warns that its older sample test still has five options per question, while the current live test has four. The current-format audit therefore requires sequential A-D options.

## Supplied source archive

- Archive: `D:/alevel/LNAT.zip`
- SHA-256: `5979D6FB46E2D45BB17A3FD784CEE5D8DED2AF35FD4A870297620EDE45107CAA`
- Contents: two official 2010 practice papers, official commentary, mark scheme and preparation guide.
- Paper inventory: two 42-question papers, each arranged as 12 passages with three or four questions.
- Format warning: both 2010 papers use the former A-E five-option format and their Section B instructions predate the current three-prompt presentation.

These files are calibration sources, not unpublished past papers. Their passages and questions must not be copied into the public bank; they are used to study passage length, inference depth, distractor design and official explanation style.

## Sealed inventory

- Five fixed Section A papers, each with 42 questions, 12 passages and a 95-minute timer.
- Every paper uses six 3-question passages and six 4-question passages.
- Every paper has an 8 easy / 24 medium / 10 hard calibration and a 10-11-per-position A-D answer distribution.
- Three fixed Section B papers, each offering three prompts in a 40-minute, 750-word writing workflow.
- 31 additional Section A practice questions. Whole passages assigned to fixed mocks are excluded from random practice, so students cannot preview mock material there.

## Audit command

`pnpm audit:lnat` checks paper inventory, official timing and question count, passage grouping and length, option schema, duplicate IDs/prompts/passages, fixed/practice passage isolation, question-type coverage, structural repetition, difficulty gradient, answer positions, and Section B format.

## Seal status

- Automated LNAT audit: 0 critical / 0 warnings.
- The dedicated runner presents one question at a time, keeps the passage visible on desktop, stacks it cleanly on mobile, and includes a 95-minute countdown, flagging, 42-question navigation and a pre-submit review.
- Difficulty labels are now frozen. Future recalibration should use real student response data rather than adding more synthetic inventory.
