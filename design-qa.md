# Design QA — Homepage Four-Core First Screen

- Source visual truth: `C:/Users/ss/AppData/Local/Temp/codex-clipboard-d38682ce-76f1-4d77-8b4f-ca3b8d0e2f55.png`
- Browser-rendered implementation: `C:/Users/ss/.codex/visualizations/2026/08/21/01a02572-dfd7-7b02-9c01-68a4797b18a9/homepage-four-core-compact.jpg`
- Combined comparison input: `C:/Users/ss/.codex/visualizations/2026/08/21/01a02572-dfd7-7b02-9c01-68a4797b18a9/homepage-four-core-comparison.jpg`
- Route: `http://127.0.0.1:3100/zh-CN`
- State: default homepage; source is signed in, local implementation is signed out. The account-control difference is outside the requested dashboard-density change.

## Capture Normalization

- Source pixels: 2880 × 1452, corresponding to an approximately 1440 × 726 CSS viewport at 2× density.
- Implementation browser viewport: 1280 × 720 CSS px; screenshot: 1265 × 712 pixels at 1× density.
- For the combined comparison, the source was center-cropped to the implementation aspect ratio and downsampled to 1265 × 712. The implementation was kept at native capture size.
- The comparison therefore judges hierarchy, vertical density, card completeness, typography, and retained content; it does not claim pixel-identical outer horizontal margins across the different viewport widths.

## Full-View Comparison Evidence

The source shows the top row completely but cuts the second row after its headings and opening copy. The implementation preserves the same 2×2 information architecture and the same four destinations while reducing the title block and moving each card's icon, heading, and subtitle into a compact lead row. All four cards, including descriptions, tags, and actions, are now fully visible in the browser viewport.

Measured browser evidence at 1280 × 720:

- First-row card bounds: top 246 px, bottom 440 px.
- Second-row card bounds: top 454 px, bottom 649 px.
- All four cards report `fullyVisible: true` against a 720 px viewport.
- Document content width is 1265 px within a 1280 px viewport; no horizontal overflow occurs.

## Focused-Region Evidence

A separate crop is unnecessary because the combined 2530 × 712 comparison keeps both complete dashboard grids readable. The card lead rows, descriptions, tags, and blue actions are visible at comparison scale.

## Required Fidelity Surfaces

- Fonts and typography: the existing product typeface, weights, and ink hierarchy are unchanged. The page title moves from 4xl to 3xl on desktop to support the requested first-screen density without truncation.
- Spacing and layout rhythm: outer vertical padding, header gap, grid gap, card padding, and minimum card height are reduced consistently. The original two-column rhythm and rounded bordered cards remain.
- Colors and visual tokens: existing indigo, ink, border, surface, and per-card semantic tones are retained without introducing new colors or gradients.
- Image quality and asset fidelity: the screen contains no raster image assets. Existing library icons remain sharp and use their original semantic colors.
- Copy and content: all titles, subtitles, descriptions, tags, and action labels are preserved. No destination or explanatory content was removed.

## Findings

- No actionable P0, P1, or P2 discrepancy remains for the requested desktop first-screen outcome.
- P3 test limitation: the selected in-app browser does not expose a viewport override in this session, so a separate mobile screenshot was not captured. The component remains base-first and single-column below `sm`; only the `sm` breakpoint introduces the two-column grid and horizontal card footer.

## Interaction And Runtime Checks

- All four card links expose the expected localized destinations: tests, background, interview, and statements.
- The exam-training card was clicked, reached `/zh-CN/tests`, and browser back returned to the homepage.
- Browser console errors: 0; warnings: 0.
- Local HTTP check returned 200 and validated 21 referenced resources with zero failures.
- `pnpm typecheck` and `git diff --check` passed.

## Comparison History

1. Initial source finding: 250 px cards plus generous header/card spacing pushed the second row below the 1440-class first screen.
2. Fix: reduced page/header gaps, changed cards to a compact 190 px structure, grouped icon/title/subtitle, and placed tags and action in one footer row.
3. Post-fix evidence: the combined comparison and DOM bounds show all four complete cards above the 720 px viewport bottom, with preserved content and working navigation.

final result: passed

---

# Design QA — Device-Specific Handwritten Answer Entry

- Source visual truth: `C:/Users/ss/AppData/Local/Temp/codex-clipboard-6cd47b1d-a1ed-44a6-ad3c-6f6f97a8405e.png`
- Browser-rendered implementation: `C:/Users/ss/.codex/visualizations/2026/08/21/01a02572-dfd7-7b02-9c01-68a4797b18a9/desktop-answer-upload-picker-only.jpg`
- Route: `http://127.0.0.1:3100/zh-CN/tests/caie9709/paper/caie9709-p3-written-9-r2`
- State: desktop, first written question, two answer parts visible.

## Comparison Evidence

The supplied capture identifies the unwanted desktop state: every answer part exposes both the blue direct-camera button and the neutral image picker. The implementation preserves the card, note field, supported-format copy, spacing, and image-picker styling while removing only the direct-camera button and its capture input on desktop. The heading is device-neutral (`上传手写答案`), and desktop guidance now asks the student to select an existing answer image.

Measured browser evidence at 1265 × 720:

- `拍照` buttons: 0.
- file inputs carrying a `capture` attribute: 0.
- `选图片` buttons: 2, one for each visible answer part.
- ordinary image-picker inputs: 2.
- horizontal overflow: false.

The device classifier is independent of viewport width: iPhone, iPad, Android phone/tablet, and iPadOS desktop-mode signatures retain both controls; Windows and macOS desktop signatures, including touch-enabled Windows laptops, use the picker-only state.

## Findings

- No actionable P0, P1, or P2 discrepancy remains for the requested desktop control visibility.
- Physical phone/iPad camera invocation remains a real-device acceptance item; deterministic device-signature tests cover the render decision locally.

final result: passed
