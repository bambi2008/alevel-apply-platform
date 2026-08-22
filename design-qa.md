# Design QA — Interview Practice Bank Cleanup

- Source visual truth: `C:/Users/ss/AppData/Local/Temp/codex-clipboard-91a8a221-beaa-4ca3-a095-d046f1a3e467.png`
- Desktop implementation: `C:/Users/ss/.codex/visualizations/2026/08/21/01a02572-dfd7-7b02-9c01-68a4797b18a9/interview-bank-clean-desktop-viewport.png`
- Mobile implementation: `C:/Users/ss/.codex/visualizations/2026/08/21/01a02572-dfd7-7b02-9c01-68a4797b18a9/interview-bank-clean-mobile-viewport.png`
- Side-by-side comparison: `C:/Users/ss/.codex/visualizations/2026/08/21/01a02572-dfd7-7b02-9c01-68a4797b18a9/interview-bank-comparison.png`
- State: mathematics interview, practice-bank tab, all thinking hints collapsed

## Capture Normalization

- Source pixels: 1131 × 1485 at 72 dpi.
- Desktop CSS viewport: 1440 × 900; captured pixels: 1425 × 891; device density: 1×.
- Mobile CSS viewport: 390 × 844; captured pixels: 375 × 812; device density: 1×.
- The side-by-side comparison scales both desktop regions to 1000 px width without changing aspect ratio. Browser chrome is excluded.

## Full-view Comparison Evidence

The source shows the five-step framework repeated inside every question card. The implementation keeps the same typography, pale-blue framework panel, question cards, number markers, badges, and hint links, but moves the framework into one introduction above the list. The visible question cards now begin directly with their prompts and use materially less vertical space.

## Focused-region Evidence

A separate focused crop was not required: the normalized side-by-side comparison keeps the framework heading, all five steps, and the first three question cards readable at once. The mobile capture separately verifies stacking and copy wrapping at 390 px.

## Required Fidelity Surfaces

- Fonts and typography: existing product font families, weights, sizes, and line heights are unchanged; the new introduction uses existing text tokens.
- Spacing and layout rhythm: the repeated large panels are removed; one framework panel is followed by consistently spaced question cards. Desktop and mobile have no horizontal overflow.
- Colors and visual tokens: existing `--ink`, `--ink-soft`, `--indigo`, `--info-bg`, and border tokens are retained.
- Image quality and asset fidelity: this screen has no new image assets; the existing interface iconography is unchanged.
- Copy and content: all questions, metadata, five framework steps, and thinking hints are preserved. Only one short explanation was added to clarify that the framework applies to every exercise.

## Findings

- No actionable P0, P1, or P2 differences remain.
- No P3 follow-up is required for the requested cleanup.

## Interaction And Runtime Checks

- Six exercise hint buttons render at desktop and mobile widths.
- The first hint opens to “思路（不是标准答案）” and closes again.
- The five-step framework renders exactly once.
- Desktop and mobile console error counts are zero.
- Desktop and mobile document widths stay within their viewports.

## Comparison History

1. Initial finding: the five-step framework was repeated inside every quantitative interview question card, creating excessive visual height and delaying access to the exercises.
2. Fix: moved the shared framework above the question list, added one concise explanation, and removed the per-card checklist instance.
3. Post-fix evidence: the side-by-side comparison shows one framework followed immediately by compact question cards; desktop and mobile browser checks pass with working hint interactions and no console errors.

final result: passed
