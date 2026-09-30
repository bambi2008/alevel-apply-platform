# Core Route Experience Audit

Date: 2026-09-30

## Scope

This audit checks whether the homepage Waterlight Hero and its four-core editorial grid remain perceptible after a student enters the four main product paths. The review is intentionally limited to representative core routes and does not treat admin, policy, authentication, or legacy utility pages as product destinations.

## Current-run browser steps

1. Opened `/zh-CN/tests/caie9709` at desktop width and confirmed the second-level exam detail loads.
2. Opened `/zh-CN/tests/caie9709/mock` and confirmed the third-level fixed-paper catalogue loads.
3. Opened `/zh-CN/interview/maths` and confirmed the second-level interview workspace loads.
4. Opened `/zh-CN/background/projects` and confirmed the second-level project catalogue loads.
5. Compared each page with the existing homepage Waterlight Hero and four-core grid already accepted in this branch.

All valid routes rendered. The initial `/interview/mathematics` probe correctly returned 404 because the authored subject id is `maths`; it was replaced with the valid route and is not an application defect.

## What already works

- The four primary destinations and their workflows are intact.
- Content hierarchy inside individual task pages is generally understandable.
- Dense exam and project information is readable and does not need decorative animation inside the work area.
- The dark footer already provides an appropriate visual endpoint and feedback contact.

## Experience breaks

1. **Identity drops after entry.** Nested pages revert to white backgrounds, blue active states, rounded cards, emoji or product-specific icon blocks, and generic back links. Nothing identifies the current route as `01 / 04`, `02 / 04`, `03 / 04`, or `04 / 04`.
2. **Navigation changes visual language.** The white-and-blue top navigation and custom bridge symbol compete with the minimal `桥申` wordmark and warm monochrome four-core system.
3. **Depth is not communicated.** Second- and third-level pages do not show where the student sits inside a core path, so moving from exam detail to mock catalogue feels like entering another product.
4. **Motion is inconsistent.** The homepage responds as a full surface; deeper pages mostly limit feedback to blue text or isolated buttons. Whole-row hover/focus and subtle surface response disappear.
5. **Card density replaces editorial rhythm.** Test facts, project cards, tabs, and notices use several unrelated box treatments instead of the homepage's numbered sequence, thin rules, generous type hierarchy, and restrained surfaces.

## Recommended system

- Keep the full Waterlight simulation only on the homepage Hero; repeating it would slow task pages and dilute the entry moment.
- Add one shared core-route frame to every nested route under `/tests`, `/background`, `/interview`, and `/statements`.
- The frame should show the core number, core name, current depth label, and four compact path links before the page-specific content.
- Scope warm-neutral background, ink-first active states, thin rules, subtle whole-surface hover/focus, and reduced shadow/radius tokens to those core routes.
- Simplify global navigation and footer branding to the same text wordmark and monochrome hierarchy.
- Preserve semantic warning, success, error, exam timer, upload, editor, and grading behavior. The system should change orientation and presentation, not task logic.

## Accessibility requirements

- Core path links must remain real links with visible keyboard focus.
- Current core must be exposed with `aria-current`.
- Motion must remain subtle and honor `prefers-reduced-motion`.
- Warm-neutral surfaces must retain readable contrast and must not encode status through color alone.
- Mobile layouts must stack without horizontal scrolling; task controls must keep their existing touch targets.

## Acceptance target

A student should be able to enter any representative second- or third-level core page and still recognize the same product within one glance, while task content remains denser and calmer than the homepage. The Waterlight Hero remains unique to the front door; its hierarchy, numbering, rules, typography, and surface response become the reusable language below it.
