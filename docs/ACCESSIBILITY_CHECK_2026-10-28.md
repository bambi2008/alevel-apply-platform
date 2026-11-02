# Partial rendered accessibility check — October 28

Scope: local English catalogue `/en/background`, plus shared controls used by interview pages. This is not a full-site WCAG conformance statement, screen-reader certification, mobile-device test or Lighthouse report.

The installed `a11y-audit` skill was read. Its referenced WCAG/ARIA/motion documents and `measure_render.mjs` / `verify_states.mjs` are absent from that skill installation. The fallback was actual in-app-browser DOM/computed-style measurement and real keyboard input; the missing prescribed gates are not represented as completed.

## Findings and repairs

| WCAG criterion | Severity | Actual finding | Repair / verification |
| --- | --- | --- | --- |
| 1.4.3 Contrast (Minimum) | P1 | Initial warning text `rgb(203,123,41)` on `rgb(244,244,240)` measured 2.97:1. After accounting for alpha compositing, shared faint copy measured 2.66:1; header metadata at black/35 measured 2.42:1. | Darkened the warning/faint tokens and shared metadata opacity. Final sample: 88 rendered text elements, zero below their 4.5:1 normal / 3:1 large-text threshold; minimum actual ratio 4.65:1. |
| 2.5.8 Target Size (Minimum) | P2 | Twelve catalogue actions measured 20px tall. Their spacing exception was not established; the owner's 44px target was also unmet. | Catalogue actions/links and form controls now have at least 44px targets; default `.btn` and `.input` also use 44px minimum height. Final checked catalogue targets: none below 44×44 CSS px. |
| 2.4.7 Focus Visible; 1.4.11 Non-text Contrast | P1 prevention | `.input:focus` removed the inherited outline and used a pale shadow. No universal prior focus-pass claim. | Added explicit 2px keyboard outline. A real Tab-focused catalogue action measured `rgb(16,24,23) solid 2px`, 2px offset and 16.35:1 against the actual surface. |
| 2.4.11 Focus Not Obscured (Minimum) | Sample pass | A first immediate native-focus observation occurred before scrolling settled. It is not counted as a pass. | Subsequent continuous Tab navigation scrolled the target into view; final measured target was fully inside the 720px viewport and its centre was not covered by another element. One sample only, not every page. |
| 3.3.2 Labels or Instructions; 4.1.2 Name, Role, Value | Repair / partial pass | Existing date control relied only on a title. Timed interview textareas lacked explicit names before this unit. | Added bilingual accessible date name; preparation/answer controls have explicit names. Actual HK/IELTS browser states exposed English textarea names; date field is source-checked, not tested with a real saved student project. |

## Measurement boundaries

- Contrast used rendered foreground colours composited over ancestor backgrounds, with sRGB luminance. The measured catalogue sample had no skipped gradient/opacity cases. Black OKLab-with-alpha metadata was handled as black plus its alpha. An earlier RGB-only provisional check missed transparent text and is superseded by this corrected measurement.
- Default state only is fully sampled. Hover-state exhaustive measurement, every disabled/error state, focus over all gradients, navigation/header/footer, hero water-image contrast and screen-reader announcements remain unverified.
- Final catalogue page has zero horizontal overflow and a fresh browser tab records zero console errors. English quantitative main/follow-up states also have no checked Han text or horizontal overflow; old HMR syntax-error entries in an earlier tab are not misrepresented as fresh runtime errors.
- Base-style unit tests enforce 4.5:1 for current flat-surface token pairs, 44px default controls and visible keyboard outline; they supplement rather than replace rendered checks.
- Physical phone/iPad camera/audio, mobile viewport, reduced-motion preference emulation, complete keyboard order/authentication and full WCAG 2.2 coverage are still separate gates.
