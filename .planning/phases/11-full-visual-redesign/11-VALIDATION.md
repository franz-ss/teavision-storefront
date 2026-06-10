---
phase: 11
slug: full-visual-redesign
created: 2026-06-10
source: Materialized from 11-RESEARCH.md §Validation Architecture (plan-checker Dimension 8 gate)
---

# Phase 11 Validation Strategy

## Test Framework

| Property           | Value                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| Frameworks         | vitest 4.1.8 (unit/integration/stories), node:test (contract tests), Playwright 1.60 (e2e), Storybook 10.4    |
| Config files       | `vitest.storybook.config.mts`, `playwright.config.ts`, `.storybook/main.ts` (all exist)                       |
| Quick run command  | `pnpm lint:tailwind` (~seconds; validates every className against the new theme)                              |
| Full suite command | `pnpm lint && pnpm typecheck && pnpm test:contracts && pnpm test:unit && pnpm test:integration && pnpm build` |

## Phase Requirements → Test Map

| Req ID    | Behavior                                      | Test Type        | Automated Command                                                                                                           | File Exists?                                                                                            |
| --------- | --------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| RD-01     | New `@theme` tokens compile & classes resolve | static           | `pnpm lint:tailwind`                                                                                                        | ✅                                                                                                      |
| RD-01     | Fonts load via next/font                      | build            | `pnpm build` (fails on bad font config)                                                                                     | ✅                                                                                                      |
| RD-02     | No old tokens anywhere                        | grep gate        | `rg -n "tv-\|steep-\|stone-" src .storybook scripts/component-contracts` → empty (token matches)                            | ✅ (command)                                                                                            |
| RD-02     | No orphaned utility defs                      | grep gate        | `rg -n "action-(primary\|secondary\|tertiary\|destructive)\|surface-sunken\|on-brand\|bg-canvas\|text-default" src` → empty | ✅ (command)                                                                                            |
| RD-03..07 | Surfaces match mockup                         | manual-only      | dev-server browser pass per surface at desktop + mobile widths vs `design/extracted-design.html`                            | justification: no visual-regression tooling configured (Chromatic addon installed but no project token) |
| RD-05/06  | Behavior contracts preserved                  | unit+integration | `pnpm test:unit && pnpm test:integration` (cart-view, product-form, cart actions, quick-view route)                         | ✅                                                                                                      |
| RD-05/06  | Quick-add/cart e2e                            | e2e              | `pnpm test:e2e` (fake-Shopify cart handoff)                                                                                 | ✅                                                                                                      |
| RD-08     | Stories render                                | build+test       | `pnpm build-storybook && pnpm test:stories`                                                                                 | ✅                                                                                                      |
| RD-08     | No raw hex/oklch/rgb in classNames            | grep gate        | `rg -n "-\[(#\|rgb\|oklch\|hsl)" src` → empty                                                                               | ✅ (command)                                                                                            |
| all       | Guard rules + class-string contracts          | contract         | `pnpm test:contracts`                                                                                                       | ✅ (assertions updated in lockstep with renames)                                                        |

## Sampling Rate

- **Per task commit:** `pnpm lint:tailwind` + targeted vitest file if the task touches a tested component
- **Per plan/wave:** `pnpm lint && pnpm typecheck && pnpm test:contracts && pnpm test:unit`
- **Phase gate:** full suite + `pnpm build` + `pnpm build-storybook` + `pnpm test:integration` + `pnpm test:e2e` + all RD-02/RD-08 greps + manual visual pass before `/gsd-verify-work`

## Wave 0 Gaps

- [x] `scripts/extract-redesign-assets.mjs` — one-off motif PNG extraction (RD-04 prerequisite; format verified in research) — **implemented as plan 11-01 Task 1**
- Otherwise: **None** — existing test infrastructure covers all phase requirements; class-string assertions are updated in lockstep rather than pre-created.
