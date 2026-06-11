# Project Retrospective

Living document — one section per milestone, appended at each close.

## Milestone: v1.0 — Headless Storefront Launch

**Shipped:** 2026-06-11
**Phases:** 9 | **Plans:** 35

### What Was Built

Bulk-savings purchasing end-to-end (PDP tiers → quantity add → Shopify discount allocations in cart); owned Searchanise search with Next-rendered filters/sort/pagination; footer parity; production-readiness remediation + pre-launch noindex; optimized collection quick-add; cart→checkout test suites; and a full 22-plan visual redesign that replaced the entire design system across every surface, refined through two owner UAT rounds.

### What Worked

- Wave-based phase execution with fresh-context executor agents — 22 redesign plans landed with atomic commits and consistent SUMMARY trails.
- The dual-token migration strategy (new system alongside old, deleted in one final sweep) kept the storefront compiling throughout the redesign.
- Contract tests (button system, section rules, reduced-motion) caught regressions repeatedly during the UAT fix loop.
- Preview-first concept workflow: rendering options (Storybook stories, inline mockup cards) and letting the owner pick beat re-implementing rejected directions — used for the search overlay, 404, testimonials, and collection hero.
- The owner working directly in the codebase alongside the agent — owner commits were respected and folded into the release without conflicts.

### What Was Inefficient

- UAT arrived as many small reactive rounds after phase "completion" — three full fix cycles (8 gap plans + ~25 ad-hoc fixes). Earlier visual checkpoints per surface would have compressed this.
- Verbatim-copy expectations surfaced late: several sections were restyled with paraphrased copy and had to be redone with original-site text.
- Two systemic CSS bugs cost multiple rounds: Tailwind 4's `translate` vs `transform` transition property (hover animations silently snapping) and `backdrop-filter` creating a containing block for fixed elements (mega-menu 38px gap).
- Early phases (1, 2, 4, 6, 8) shipped without VERIFICATION.md, forcing the milestone audit to re-verify their wiring from scratch.
- Stale generated `.next/dev` types broke production builds twice because tsconfig includes `**/*.ts`.

### Patterns Established

- Section primitives (`Section.Root` tone/spacing + `Section.Container`) as the only page-band vocabulary.
- Design-token-only styling enforced by a canonical-class checker in pre-commit.
- Motif-band layout (illustration left, centered copy, brush ring right) reused across For Business / Catalogues / Newsletter.
- Gap-closure phases (`gap_closure: true` plans + `--gaps-only` execution) as the UAT remediation loop.
- Checkpoint plans (`autonomous: false`) for owner-approval-gated design work.

### Key Lessons

- In Tailwind 4, never list `transform` in arbitrary `transition-[...]` values when animating `translate-*`/`scale-*` utilities — they compile to the individual CSS properties.
- Any ancestor with `backdrop-filter` becomes the containing block for `position: fixed` descendants — anchor overlays with `absolute` against a `relative` parent instead of viewport offsets.
- Outside-click handlers must scope to the full interactive surface (triggers AND panels), not just the trigger nav.
- Never-resolving "pending" mock actions must be the LAST story in a file — their stuck transitions starve later stories on the shared Storybook root.
- The original site's copy is sacred: treat text as data to port verbatim, not content to improve.

### Cost Observations

- Model mix: orchestrator on the main-session model, executors/verifiers/reviewers on sonnet.
- Sessions: multi-week, heavily interactive during the UAT loop.
- Notable: subagent-per-plan kept orchestrator context lean across 22 plans; the milestone audit's integration checker re-verified five unverified phases in a single pass.

## Cross-Milestone Trends

| Metric | v1.0 |
| --- | --- |
| Phases / plans | 9 / 35 |
| Duration | ~6.5 weeks |
| Commits | 476 |
| UAT fix rounds | 3 |
| Known gaps at close | 2 requirement-level (CQA-05, CARD-01-superseded) + tech-debt list |
