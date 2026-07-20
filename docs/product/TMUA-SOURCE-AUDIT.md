# TMUA Source Audit

Last reviewed: 2026-07-20

## Source inventory

The private reference archive contains 39 PDFs and one preparation guide:

- Official Paper 1 and Paper 2 question papers for 2016-2023.
- Worked answers for both papers in each year.
- One early specimen Paper 1 and Paper 2, with worked answers.
- `Notes on Logic and Proof`, June 2025.
- `Notes on Mathematics for TMUA and ESAT Mathematics 2`, June 2025.
- One duplicate copy of the 2018 Paper 1 worked answers.
- One third-party 2026 preparation guide.

That gives 16 dated papers (320 official question slots) plus 40 specimen question slots. The archive is a private calibration source only. Original question text, diagrams, and worked answers must not be copied into the product repository.

## Confirmed format baseline

- Two papers, each with 20 multiple-choice questions.
- 75 minutes per paper.
- No calculator or formula booklet.
- Paper 1 emphasizes mathematical application.
- Paper 2 emphasizes mathematical reasoning and the language of proof.
- Questions do not use a fixed five-option format. Sampled papers use between five and eight options, with A-H especially common for statement-combination questions.

## Current product inventory

At the time of this audit:

- The general TMUA bank contains 241 questions.
- All 241 questions use exactly five options.
- The platform has 11 fixed mocks, totaling 440 question slots.
- The original 10 mocks contain 400 five-option question slots.
- `tmua-calibration-1` adds 40 original questions using five to eight options.
- Across all fixed mocks there are 77 difficulty-1, 267 difficulty-2, and 96 difficulty-3 questions.
- The original mocks were concentrated in algebra, calculus, logic, and discrete mathematics. The calibration paper and the upgraded endings for mocks 6, 9, and 10 add geometry, number, statistics, multi-step applications, and contextual proof reasoning. The remaining older papers still require gradual replacement.

## Material gaps

### 1. Option architecture

The data model previously allowed only A-E. It must support A-H, and each question must use continuous keys beginning at A.

### 2. Paper 2 reasoning fidelity

The current Paper 2 pool overuses isolated definitions, direct contrapositives, and elementary truth-value checks. Official papers more often require students to:

- compare several necessary-and-sufficient conditions;
- interpret proof steps and identify what has actually been established;
- distinguish implication, converse, equivalence, and counterexample in a mathematical setting;
- evaluate several linked statements, often through six or eight answer combinations;
- reason about functions, graphs, sequences, divisibility, or integrals rather than answer decontextualized logic vocabulary questions.

### 3. Paper 1 difficulty and distractors

Current mocks contain too many one-step textbook exercises. Official-style questions more often combine familiar syllabus material with one of the following:

- a non-obvious representation change;
- boundary or domain analysis;
- parameter dependence;
- reverse reasoning from answer choices;
- distractors corresponding to plausible partial arguments rather than arithmetic slips alone.

### 4. Mock-paper calibration

Several current mocks have no difficulty-3 Paper 1 questions, and the aggregate difficulty-3 share is low. A fixed mock should also preserve the distinction between Paper 1 and Paper 2 instead of treating them as two interchangeable topic batches.

## Recommended implementation order

1. Completed: extend MCQ option keys to A-H and add integrity checks.
2. Completed: build one 40-question original calibration mock with 20 Paper 1 and 20 Paper 2 questions.
3. Completed: add a 70-question advanced practice layer, with ten medium-to-hard questions in each of the seven specification modules.
4. Use that mock as the acceptance benchmark for timing, option layout, explanations, and mobile rendering.
5. Completed: mocks 2, 3, 5, 6, 7, 8, 9, and 10 now have calibrated medium-to-hard endings. The remaining backlog is mocks 1 and 4.
6. Recalibrate the general practice bank after the fixed-paper standard is stable.

## Originality rule

Reference papers may inform syllabus coverage, reasoning pattern, option count, distractor logic, pacing, and relative difficulty. Every product question must use a new mathematical construction and independently written solution. Changing only constants, labels, or surface wording is not sufficient.
