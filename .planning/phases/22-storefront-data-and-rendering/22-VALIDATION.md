---
phase: 22
slug: storefront-data-and-rendering
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-02
---

# Phase 22 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
| --- | --- |
| **Framework** | Vitest, Storybook Vitest, TypeScript, ESLint, Next build |
| **Config file** | `vitest.config.mts`, `vitest.storybook.config.mts`, `eslint.config.mjs`, `next.config.ts` |
| **Quick run command** | `pnpm test:unit -- src/lib/sanity/home-page.test.ts` |
| **Full suite command** | `pnpm lint && pnpm typecheck && pnpm test:stories && pnpm build` |
| **Estimated runtime** | ~180 seconds |

---

## Sampling Rate

- **After every task commit:** Run the task-specific quick command listed in the
  verification map.
- **After every plan wave:** Run `pnpm lint && pnpm typecheck && pnpm test:stories && pnpm build`.
- **Before `$gsd-verify-work`:** Full suite must be green unless the summary
  documents an explicit owner-approved external blocker.
- **Max feedback latency:** 180 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 22-01-01 | 01 | 1 | DATA-01, DATA-02, RENDER-02, QUALITY-01 | T-22-01 / T-22-02 / T-22-03 | Missing/invalid Sanity `homePage` and required SEO/image fields fail loudly without runtime fallback. | unit | `pnpm test:unit -- src/lib/sanity/home-page.test.ts` | Missing until plan execution | pending |
| 22-01-02 | 01 | 1 | RENDER-01, RENDER-02 | T-22-04 / T-22-05 | Existing sections render explicit CMS fixture props while client leaves and code-owned motifs stay isolated. | stories | `pnpm test:stories` | Existing stories, updates pending | pending |
| 22-01-03 | 01 | 1 | DATA-01, RENDER-01, QUALITY-01 | T-22-01 / T-22-06 | `/` and `generateMetadata()` use the typed homepage boundary, preserve JSON-LD/forms, and do not keep static SEO fallbacks. | unit/type/build | `pnpm typecheck && pnpm build` | Existing route, updates pending | pending |
| 22-01-04 | 01 | 1 | DATA-02, RENDER-01 | T-22-07 | Tea Journal settings come from CMS while article data remains owned by existing blog operations. | unit | `pnpm test:unit -- src/lib/blog/operations.test.ts src/lib/sanity/home-page.test.ts` | Existing blog tests, homepage tests pending | pending |
| 22-01-05 | 01 | 1 | DATA-01, DATA-02, RENDER-01, RENDER-02, QUALITY-01 | T-22-08 | Final route compiles under Next 16 Cache Components and obeys lint, type, story, and build contracts. | full suite | `pnpm lint && pnpm typecheck && pnpm test:stories && pnpm build` | Existing infra | pending |

---

## Wave 0 Requirements

- [ ] `src/lib/sanity/home-page.test.ts` - fail-loud validation, image normalization, SEO mapping, and count coverage for DATA-01, DATA-02, RENDER-02, QUALITY-01.
- [ ] Updated homepage stories - explicit fixture props for prop-enabled sections.
- [ ] No new test framework installation; existing Vitest and Storybook coverage are sufficient.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
| --- | --- | --- | --- |
| Visual homepage parity against seeded content | RENDER-01, RENDER-02 | Automated tests can prove structure and props, but final visual parity needs a browser review of the composed route. | Run `pnpm dev`, open `/`, compare section order, hero LCP image, cards, forms, testimonials, Tea Journal, contact, CTA, and FAQ against the v1.5 homepage baseline. |
| Formal SEO/PageSpeed no-regression evidence | QUALITY-01 | Phase 22 preserves behavior, but milestone release proof is explicitly Phase 23 scope. | Record that Phase 22 build succeeds and defer formal PageSpeed/no-regression gate to Phase 23. |

---

## Threat Model

| Threat | Risk | Mitigation |
| --- | --- | --- |
| T-22-01 Hidden static fallback masks CMS failure | Editors think Sanity controls `/` while stale hardcoded content renders. | Route and operation must throw on missing/invalid singleton; `content.ts` may only feed fixtures/stories. |
| T-22-02 Invalid SEO weakens launch controls | CMS noIndex or canonical behavior bypasses global launch noindex. | Generate metadata from required CMS fields and always pass through `withNoindexRobots()`. |
| T-22-03 Missing image dimensions cause layout shift | Sanity image renders without reserved geometry. | Require asset URL or ID plus dimensions before returning UI image data. |
| T-22-04 Client-boundary creep | Parent homepage sections become client components. | Keep sections server-rendered and isolate interactivity in existing client leaves. |
| T-22-05 Decorative assets become editor-owned accidentally | Motif animation and layout assets drift from approved design. | Keep newsletter, supply-chain, and catalogue motifs code-owned. |
| T-22-06 Shopify commerce authority is diluted | CMS fields start controlling product, price, cart, checkout, or discount truth. | Limit CMS to homepage authored content and Tea Journal display settings. |
| T-22-07 Blog ownership regression | Homepage CMS replaces live blog article data. | CMS controls Tea Journal intro/config only; `getHomepageArticles()` remains the article source. |
| T-22-08 Cache and metadata mismatch | Page and metadata fetch different content or break Cache Components rules. | Use the same cached homepage operation from page and `generateMetadata()`. |

---

## Validation Sign-Off

- [ ] All planned tasks have automated verification or explicit manual-only rationale.
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify.
- [ ] Wave 0 covers all missing test references.
- [ ] No watch-mode flags.
- [ ] Feedback latency < 180 seconds.
- [ ] `nyquist_compliant: true` set in frontmatter after the final plan is created and validated.

**Approval:** pending
