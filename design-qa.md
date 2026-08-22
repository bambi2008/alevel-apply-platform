# Design QA — Four-Core Entry-Page Unification

- Source visual truth: `C:/Users/ss/AppData/Local/Temp/codex-clipboard-4ffc65a9-3b33-4a11-af22-d065b593aae9.png` (the supplied interview entry page)
- Desktop implementations:
  - `C:/Users/ss/.codex/visualizations/2026/08/21/01a02572-dfd7-7b02-9c01-68a4797b18a9/four-core-tests-viewport.jpg`
  - `C:/Users/ss/.codex/visualizations/2026/08/21/01a02572-dfd7-7b02-9c01-68a4797b18a9/four-core-background-viewport.jpg`
  - `C:/Users/ss/.codex/visualizations/2026/08/21/01a02572-dfd7-7b02-9c01-68a4797b18a9/four-core-interview-viewport.jpg`
  - `C:/Users/ss/.codex/visualizations/2026/08/21/01a02572-dfd7-7b02-9c01-68a4797b18a9/four-core-statements-viewport.jpg`
- Side-by-side comparisons: the four matching `four-core-*-comparison.jpg` files in the same directory.
- Mobile evidence: the four matching `four-core-*-mobile.jpg` files in the same directory.
- State: default entry state; tests and background use the initial recommended filters; statements uses UK UCAS.

## Capture Normalization

- Source pixels: 2376 × 1605. Its top 2376 × 1337 region was normalized to 1265 × 712 for each desktop comparison.
- Desktop browser viewport: 1280 × 720 CSS px; captured content pixels: 1265 × 712; screenshot density normalized to CSS pixels.
- Mobile content frame: 390 × 844 CSS px inside the in-app browser; desktop browser chrome and gray QA canvas are excluded from fidelity judgment.
- The source and implementation use different original browser aspect ratios, so the comparison intentionally judges the shared above-the-fold content region rather than the source's lower rows.

## Full-view Comparison Evidence

All four implementations now use the interview page's visual hierarchy: the same 6xl content width, core-step eyebrow, 3xl/4xl title, restrained description and meta line, thin divider, compact text tabs, section labels, and border-separated rows. Tests no longer has a hero image or a three-column card wall. Background no longer uses oversized tabs, two-column cards, emoji-leading tiles, or full-width blue actions. Statements now shares the same shell and replaces the icon-heavy process strip and boxed region picker with compact linear navigation.

## Focused-region Evidence

The side-by-side desktop comparisons keep the source header, first section, row spacing, secondary labels, and right-edge actions readable at once. Separate mobile captures verify the shared title block, collapsed global navigation, text wrapping, scrollable secondary tabs, and single-column stacking at 390 px. The statements mobile QA harness remains on its client loading state because server actions do not hydrate inside the isolated frame; its live desktop route fully loads and its mobile layout uses the same verified shared shell and base-first responsive classes.

## Required Fidelity Surfaces

- Fonts and typography: all pages use the existing product typefaces and the interview page's title, body, meta, and section weights. Long test/background descriptions keep the existing readable 1.5 line height and clamp only where needed.
- Spacing and layout rhythm: the four pages now share identical outer padding, header spacing, section gaps, divider rhythm, and row padding. Intentional dense forms remain only inside the statement-writing workflow.
- Colors and visual tokens: all shared UI uses the existing ink, muted ink, indigo, border, warning, and surface tokens. Filled blue controls remain only for true primary actions such as saving.
- Image quality and asset fidelity: the selected interview target contains no page imagery. The tests hero image was intentionally removed to match that target; no generated or placeholder assets were introduced.
- Copy and content: each workflow's original data, descriptions, legal notices, filters, planning controls, question-bank links, coaching actions, and editor content are preserved. Only the tests title was shortened from “考试训练中心” to the navigation-consistent “考试训练”.

## Findings

- No actionable P0, P1, or P2 visual difference remains.
- P3 test limitation: the isolated 390 px frame cannot complete the statements server-action hydration, so the fully loaded statement editor was interaction-tested at the live desktop viewport and its responsive shell was inspected from the same production component code.

## Interaction And Runtime Checks

- Tests: subject filter switched to Mathematics and back to All.
- Background: switched to Professional Practice, verified both project entries, and returned to Competition.
- Interview: mathematics entry and all category sections remained available.
- Statements: switched to Hong Kong single-essay mode and back to UK UCAS.
- All four direct local routes had no horizontal overflow at the desktop viewport and no direct-page browser console errors.
- `pnpm typecheck` and `git diff --check` passed.

## Comparison History

1. Initial evidence: tests used a hero and card wall; background used large icon tabs, cards, and full-width actions; statements used a narrow shell, icon process tiles, and multiple boxed notices; interview used the desired quiet row-based hierarchy.
2. Fix: introduced shared four-core layout primitives and converted every entry page to the interview shell, tabs, section headings, and divided rows while retaining workflow behavior.
3. Post-fix evidence: the four side-by-side desktop comparisons show matching hierarchy and density; mobile captures show the shared shell and stacking behavior with no material layout mismatch.

final result: passed
