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

# Design QA — Four-Core Second-Level Hierarchy

- Source visual truth: the browser-rendered homepage four-core section at `http://127.0.0.1:3115/zh-CN#core-centers`, using the established warm-neutral, numbered, ruled-grid system. The user's before-state is `C:/Users/ss/AppData/Local/Temp/codex-clipboard-092fb0e8-721d-4fc6-a5c5-145444b304e6.png`.
- Browser-rendered implementation: `http://127.0.0.1:3115/zh-CN/tests`; the in-app browser emitted the desktop and mobile captures during this QA turn but does not expose filesystem paths.
- Comparison input: source and implementation browser captures were reviewed together in the same design-QA turn. A same-origin iframe comparison page was also attempted, but the application's intentional anti-framing headers correctly blocked both frames; no security header was relaxed for QA.
- Viewport/state: 1440×900 desktop and 390×844 mobile, Chinese signed-out state; default `全部` and filtered `数学` states.
- Pixel density: browser DPR 1; the user-supplied before-state is 2880×1462 pixels and is used only to establish the flat prior hierarchy, not for pixel-perfect geometry.

## Full-View Comparison Evidence

The revised second-level page keeps the homepage's warm-neutral canvas, high-contrast display heading, small tracked order label, thin black-opacity rules and restrained monochrome palette. The previous generic blue underline tabs and light list rows are replaced by a clearly selected dark filter, numbered sections and complete-row directional affordances. At 1440 px the title resolves at 86.4 px, all 11 exam links remain present and document width stays within the viewport. At 390 px the hierarchy collapses to a readable single-column flow with no document overflow.

## Focused-Region Comparison Evidence

Focused checks covered the category control and the first exam row. The active category exposes `aria-pressed=true`; selecting Mathematics reduces the rendered exam links from 11 to 5. The first row retains its title, bilingual metadata, summary and destination while adding a two-digit order marker, a 44 px circular arrow and whole-row hover/focus styling. ESAT navigation reaches `/zh-CN/tests/esat` and browser back restores the list.

## Required Fidelity Surfaces

- Fonts and typography: the application family is retained; the hierarchy now matches the homepage through a responsive display clamp, tighter heading tracking, compact body line lengths and small tracked metadata.
- Spacing and layout rhythm: shared outer padding, ruled header/tab/list boundaries, 12-unit section rhythm and four-column desktop rows extend the homepage's editorial grid; mobile rows collapse without hidden controls.
- Colors and visual tokens: `#f4f4f0`, `#101817` and black-opacity rules/secondary text are reused from the homepage. The legacy blue active underline is removed from these shared controls.
- Image quality and asset fidelity: these second-level pages contain no required raster imagery. Existing Lucide icons remain vector-sharp; no substitute SVG, emoji or placeholder asset was introduced.
- Copy and content: all 11 exam destinations, section notes, bilingual labels, warnings and filters remain. The use note is restructured, not shortened or rewritten into a new claim.

## Findings

- No actionable P0, P1 or P2 discrepancy remains for the requested hierarchy continuity.
- P3: mobile category tabs intentionally remain horizontally scrollable because five bilingual labels cannot fit a 390 px viewport without damaging readability.
- P3 diagnostic: Next.js dev mode emits its existing smooth-scroll advisory during one client transition; no browser error occurs and production behavior is unaffected.

## Interaction And Runtime Checks

- Primary interactions: category filtering, active-state semantics, whole-row ESAT navigation and browser return all pass.
- Responsive checks: 1440×900 and 390×844 both have zero horizontal overflow.
- Shared-surface checks: background, interview and statements retain their content while using the same numbered header and ruled navigation language.
- Console check: 0 errors; one existing Next.js development-only smooth-scroll advisory.
- Static verification: TypeScript, changed-file ESLint and `git diff --check` pass.
- Regression verification: all 59 Vitest files / 342 tests pass.
- Production verification: isolated Next.js 16 build passes compilation, TypeScript validation, page-data collection and all 28 static pages; temporary output and generated `tsconfig.json` includes were removed.

## Comparison History

1. Initial P1 mismatch: the second-level tests screen dropped the homepage's warm surface, numerical order, bold scale and directional motion, so it read as an unrelated generic list.
2. Fix: moved the core pages onto a shared editorial shell/header/tab/list language and rebuilt the tests rows with numbering, full-row states and circular arrow motion.
3. Post-fix evidence: desktop/mobile captures, filter interaction, route navigation and the three other shared core headers show the hierarchy persists beyond the homepage with no overflow or browser errors.

final result: passed

---

# Design QA — Four-Core Supporting Copy Rhythm

- Source visual truth: `C:/Users/ss/AppData/Local/Temp/codex-clipboard-5b394952-a0de-44a3-ae0d-e20978a8ae99.png` (2802×1254 source pixels), with the unwanted gap between the two small-copy lines annotated in red.
- Browser-rendered implementation: in-app Browser capture from `http://127.0.0.1:3114/zh-CN`; this browser surface emitted the capture during review but does not expose a filesystem path.
- Comparison input: the annotated source and the browser-rendered implementation were opened and inspected in the same design-QA turn.
- Viewport/state: 1400×720 desktop, Chinese signed-out homepage, scrolled to `#core-centers`.

## Full-View Comparison Evidence

The four-card grid, thin rules, numbering, icons and directional controls remain unchanged. The two supporting lines in every card now read as one compact copy block rather than two visually disconnected paragraphs. Browser measurement on the first card reports a 4.75 px rendered gap from title to subtitle and another 4.75 px gap from subtitle to description; all four cards share the same component classes.

## Focused-Region Evidence

The source annotation isolates the first card's subtitle/description spacing, and the implementation capture keeps that area readable at the tested viewport. The prior 12 px description margin is replaced by the same 4 px spacing token used below the title; both supporting lines share the compact `leading-5` token.

## Required Fidelity Surfaces

- Fonts and typography: existing family, weights, sizes, tracking and color hierarchy are retained; only the two small-copy line heights are normalized to `leading-5`.
- Spacing and layout rhythm: the description margin changes from `mt-3` to `mt-1`, removing the annotated excess gap and creating an even title/subtitle/description rhythm.
- Colors and visual tokens: no color, border, surface or opacity token changes.
- Image quality and asset fidelity: no image assets are involved; the existing icon-library glyphs remain unchanged.
- Copy and content: all four titles, subtitles and descriptions are preserved verbatim.

## Interaction And Runtime Checks

- All four localized destination links remain present.
- Browser console warnings/errors: 0.
- `pnpm typecheck` passes.
- Full regression passes: 59 Vitest files / 342 tests.

## Comparison History

1. Initial P2 mismatch: `mt-3` separated the description from its subtitle enough to make the two small lines read as unrelated blocks.
2. Fix: normalized both small lines to `leading-5` and reduced the description margin to `mt-1`.
3. Post-fix evidence: the browser capture and measured 4.75 px rendered gap show a compact, consistent copy block across all four cards, with no console warning or error.

final result: passed

---

# Design QA — Compact Upper-Left Waterlight Wordmark

- Source visual truth: `C:/Users/ss/AppData/Local/Temp/codex-clipboard-81168b05-ec5c-472c-b78d-e99e4b82c9b8.png` (2806×1454 source pixels), with the requested upper-left placement annotated in red.
- Browser-rendered implementation: in-app Browser capture from `http://localhost:3114/zh-CN`; the current browser surface emitted the desktop and mobile captures in the same review but does not expose a filesystem path.
- Comparison input: the annotated source and the browser-rendered desktop capture were inspected together in this design-QA turn.
- Viewport/state: 1280×720 desktop and 390×844 mobile, Chinese signed-out homepage, Waterlight Hero, sound-on interaction state also tested.

## Full-View Comparison Evidence

The source asks for the oversized centered `桥申` wordmark to move into the annotated upper-left box. The implementation places the mark at approximately 38×38 px in the 1280×720 browser and measures 94.2×51.2 px, matching the annotated target's compact proportion while restoring the water surface as the dominant visual. At 390×844 it remains upper-left at approximately 28.5×28.5 px and measures 78.7×42.8 px without horizontal overflow.

## Focused-Region Evidence

The wordmark region is the only changed visual area, so a separate crop is unnecessary: the full-view browser capture clearly resolves the mark, its water contrast and its distance from both edges. The sound pill remains at bottom-left and the down-arrow remains centered at the bottom.

## Required Fidelity Surfaces

- Fonts and typography: the existing product typeface, semibold weight and tight bridge wordmark tracking are retained; only the responsive size changes from `clamp(4.5rem,15vw,13rem)` to `clamp(2.25rem,4vw,4rem)`.
- Spacing and layout rhythm: the mark uses the target's upper-left composition with responsive 24/32 px offsets; rendered browser offsets include the page's existing outer alignment and remain visually within the annotation.
- Colors and visual tokens: white at 95% opacity and the existing dark-water palette are retained; the reduced shadow is scaled to the smaller mark.
- Image quality and asset fidelity: the original Three.js Waterlight surface and supplied riverbed texture are unchanged and remain sharp at both tested viewports.
- Copy and content: `桥申`, the sound control and the four-core down-arrow are unchanged; no new copy is introduced.

## Interaction And Runtime Checks

- The sound control still changes state and plays `/waterlight/waterlight-loop.ogg`; the audio reports `readyState=4` and `paused=false`.
- The down-arrow still scrolls to `#core-centers`.
- Desktop and mobile report no horizontal overflow.
- Browser console warnings/errors: 0.
- `pnpm typecheck` and `git diff --check` pass.

## Comparison History

1. Initial P1 mismatch: the centered 15vw wordmark dominated the water and did not occupy the user's annotated upper-left target.
2. Fix: changed the overlay to absolute upper-left positioning, reduced the responsive clamp and proportionally reduced its shadow.
3. Post-fix evidence: the desktop and mobile browser captures place the compact mark in the upper-left, preserve all Hero controls and show no overflow or console errors.

final result: passed

---

# Design QA — Minimal Waterlight Hero + Four-Core Scroll

- Source visual truth: the original Purrl Waterlight study at `C:/Users/ss/Documents/hk minijungle/waterlight-study`, captured in the in-app browser from `http://127.0.0.1:4180/`.
- Implementation visual: the isolated production build of the bridge homepage, captured in the in-app browser from `http://localhost:3112/zh-CN`.
- Screenshot paths: the current Codex in-app browser exposes both captures as browser-rendered evidence but does not expose filesystem paths; the source and implementation were emitted together in one two-image comparison input.
- Viewport/density: both desktop captures use a 1265×720 CSS viewport at device-pixel ratio 1. A separate responsive measurement used 390×844 (375 px document client width) at DPR 1.
- State: signed-out Chinese homepage, midnight water state, sound initially off; focused checks include sound-on and the scrolled four-core section.

## Full-view comparison evidence

The implementation reuses the source Three.js water surface, riverbed texture, light path, shaders, pointer ripples, spray and reactive audio graph. The previous bridge overlay added a product heading and four cards to the same first screen; the revised implementation removes those competing layers. Above the fold now contains only the water field, a centered `桥申` wordmark, the compact sound control and one down-arrow affordance. This preserves the source's immersive, quiet composition while making the bridge identity the single focal point.

The implementation desktop metrics report a 720 px Hero within a 720 px viewport, a hidden global top navigation and document width equal to viewport width. The 390×844 responsive check also reports no horizontal overflow. The four destination links appear only after the first viewport and retain the existing `/tests`, `/background`, `/interview` and `/statements` routes.

## Focused-region comparison evidence

- Sound control: the implementation retains the source's low-contrast pill treatment and animated four-bar state. A real click changes the label from `开启水声` to `关闭水声`; the audio element reports the local OGG source, `readyState=4` and `paused=false`. WAV is present as the Safari/iPad fallback.
- Four-core section: the scrolled capture shows a restrained editorial grid with thin rules, numerical ordering, consistent line length and one directional affordance per destination. The exam route was opened successfully and the site brand link returned to a homepage containing all four entries.

## Required fidelity surfaces

- Fonts and typography: the wordmark uses the existing application sans family at a responsive display scale with one weight and no secondary Hero copy. The second screen uses the existing hierarchy and avoids oversized supporting text.
- Spacing and layout rhythm: the Hero is exactly one viewport; the second screen begins cleanly below it. Desktop uses a 2×2 ruled grid; mobile collapses to one column without overflow.
- Colors and tokens: the water remains source-accurate midnight blue/black; the second screen uses a low-contrast warm neutral and existing black opacity tokens rather than introducing a competing palette.
- Image quality and asset fidelity: no substitute illustration, CSS water approximation or generated image is used. The original water shader, texture and audio assets are preserved.
- Copy and content: Hero copy is reduced to `桥申`; all four destination names, purposes and routes remain clear below the fold.

## Findings and comparison history

- P0/P1: none.
- P2 fixed: the earlier implementation placed the heading and all four cards over the water, weakening the requested single-focus Hero. They now begin in the next viewport.
- P2 fixed: the earlier embedded route contained an audio element without media sources and hid its toggle. The final implementation packages OGG/WAV sources and exposes a keyboard-focusable, user-gesture sound control.
- P3 diagnostic: the Codex automation browser reports one nested-iframe `MutationObserver` observer error on the homepage. The direct Waterlight route and an existing application route both have clean console logs, the page renders fully, and all tested interactions succeed, so this is classified as a browser-automation observer artifact rather than an application regression.
- LATQ note: no LATQ-specific interaction is claimed here because an unambiguous official reference URL has not yet been supplied.

## Implementation checklist

- [x] Water-only first viewport with one bridge wordmark.
- [x] User-controlled water sound with local cross-browser sources.
- [x] Four existing functional destinations below the fold.
- [x] Desktop and responsive layout checks with no horizontal overflow.
- [x] Isolated production build and 59-file / 342-test regression.

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

---

# Design QA — Purrl Waterlight Homepage Hero

- Source visual truth: the original local Purrl Waterlight study at `C:/Users/ss/Documents/hk minijungle/waterlight-study`, viewed at `http://127.0.0.1:4180/`.
- Browser-rendered implementation: the bridge homepage at `http://127.0.0.1:3100/zh-CN`.
- Viewport/state: 1280×720-class in-app browser, signed-out homepage, default midnight water state followed by an actual pointer drag across the open water area.

## Comparison Evidence

The source and implementation use the same Three.js water simulation, riverbed texture, camera, shaders, ripple field, spray and pointer sampling rather than an approximate image or CSS effect. The bridge version intentionally removes the Purrl editorial controls and overlays the existing product heading plus four functional entry panels. The riverbed, reflective light path, water depth and dark midnight palette remain visibly consistent between the two captures.

At the implementation viewport all four entry panels are fully visible in one row, their text remains readable over the moving surface, and open water remains available above and below the panels for pointer interaction. A pointer drag was delivered to the embedded surface, after which the water iframe became the focused interactive document. The exam-training panel still navigates to `/zh-CN/tests`, and browser back restores the Hero.

## Findings

- P0/P1: none.
- P2 fixed during review: the global `frame-ancestors 'none'` and `X-Frame-Options: DENY` headers initially blocked the same-origin water document. The final implementation overrides only `/zh-CN/waterlight` and `/en/waterlight` to same-origin framing while leaving all other routes denied.
- P3: the small black Next.js development indicator appears only in local development and is absent from production builds.

final result: passed
