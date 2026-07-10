---
phase: 25
slug: heading-structure-fixes
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-10
---

# Phase 25 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest, Storybook browser tests, ESLint, TypeScript, Next.js build |
| **Config file** | `vitest.config.mts`, `vitest.storybook.config.mts`, `eslint.config.mjs`, `next.config.ts` |
| **Quick run command** | `pnpm exec vitest run src/lib/shopify/html-content.test.ts "src/app/(storefront)/products/[handle]/page.test.tsx" "src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx"` |
| **Full suite command** | `pnpm lint && pnpm typecheck && pnpm test:unit && pnpm build` |
| **Estimated runtime** | ~120 seconds for static checks; Storybook browser tests run separately |

---

## Sampling Rate

- **After every task commit:** Run the focused Vitest command above.
- **After every plan wave:** Run `pnpm test:stories` and the full suite command.
- **Before `$gsd-verify-work`:** Full suite and the phase-specific Storybook browser coverage must be green.
- **Max feedback latency:** 120 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 25-01-01 | 01 | 1 | SEO-04 | T-25-01 | The collection-only sanitizer preserves the shared allowlist, protocol filtering, branded HTML boundary, and compact output. | unit | `pnpm exec vitest run src/lib/shopify/html-content.test.ts` | ✅ | ⬜ pending |
| 25-01-02 | 01 | 1 | SEO-04 | — | Collection story source H3/H4 renders as H2/H3 after the grid without changing other collection paths. | route render | `pnpm exec vitest run "src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx"` | ✅ | ⬜ pending |
| 25-01-03 | 01 | 1 | SEO-03 | — | Product disclosures retain native details/summary behavior, first-panel open state, one page H1, and H2 titles. | route render | `pnpm exec vitest run "src/app/(storefront)/products/[handle]/page.test.tsx"` | ✅ | ⬜ pending |
| 25-01-04 | 01 | 1 | SEO-03, SEO-04 | — | Story fixtures represent the sanitized collection output and native disclosure interaction still works at mobile width. | browser story | `pnpm test:stories` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test-framework, fixture, or stub work is required before implementation.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Long collection-story title wraps without colliding with the decorative chevron at a mobile viewport. | SEO-04 | Visual wrapping is best confirmed in the existing Storybook mobile scenario. | Open the collection `StoryDisclosure` long-title/mobile story; expand and collapse it by keyboard, check its visible focus treatment, and confirm the H2/H3 hierarchy in the rendered DOM. |
| PDP disclosure semantics remain visually unchanged while title text becomes a heading. | SEO-03 | Screen-reader and visual inspection complement static markup tests. | Load a representative product, confirm one visible H1, inspect each summary for its H2 title, and operate the native disclosure by keyboard without added button or ARIA state. |

---

## Validation Sign-Off

- [x] All planned tasks have an automated verification command.
- [x] Sampling continuity: no three consecutive tasks lack automated verification.
- [x] Wave 0 covers all missing references; no Wave 0 work is required.
- [x] No watch-mode flags are used.
- [x] Feedback latency is under 120 seconds for targeted checks.
- [x] `nyquist_compliant: true` is set in frontmatter.

**Approval:** ready for execution planning 2026-07-10
