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

## Current diagnosis

The practice inventory is substantial, but the five fixed Section A papers are short drills rather than full mocks:

- each paper contains only 11-12 questions rather than 42;
- each paper contains three passages rather than 12;
- each paper lasts 40 minutes rather than 95 minutes;
- all current fixed-paper questions are labelled medium difficulty;
- answer positions are heavily concentrated and are not calibrated as a full paper.

The three fixed Section B papers already have the correct 40-minute, three-prompt and 750-word structure. They should be preserved while the objective papers are rebuilt.

## Engineering order

1. Rebuild Mock 1 and Mock 2 as complete 42-question, 12-passage papers.
2. Calibrate difficulty, distractors and answer positions before expanding the remaining papers.
3. Rebuild Mock 3-5 only after the first two pass `pnpm audit:lnat`.
4. Run desktop and mobile whole-paper acceptance for timing, passage persistence, review navigation, submission, explanations and history.
5. Seal LNAT only at `0 critical / 0 warnings`; after that, make difficulty changes only from real student response data.

## Audit command

`pnpm audit:lnat` checks paper inventory, official timing and question count, passage grouping, option schema, duplicate IDs/prompts/passages, structural repetition, difficulty gradient, answer positions, and Section B format.

## Progress

- Mock 1 rebuilt as a complete 42-question, 12-passage, 95-minute paper.
- Mock 1 passage split: six passages with three questions and six with four questions.
- Mock 1 difficulty split: 8 easy / 24 medium / 10 hard.
- Mock 1 answer distribution: 11 / 11 / 10 / 10 across A-D.
- Current audit result: 16 critical issues and 0 warnings, all remaining critical issues belonging to the four short Mock 2-5 papers.
