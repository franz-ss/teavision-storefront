# Phase 5: Codebase Review Remediation - Context

**Gathered:** 2026-06-02
**Status:** Ready for planning
**Source:** CODEBASE_REVIEW.md and specialist review outputs

<domain>

## Phase Boundary

This phase addresses the codebase review findings captured in `CODEBASE_REVIEW.md`.
The work is limited to production-readiness remediation: conversion path correctness,
accessibility, safe structured data, testing gates, reliability/security hardening,
collection performance, component boundaries, TypeScript/runtime guardrails, sitemap
hygiene, and final verification evidence.

This phase does not redesign the storefront, change Shopify merchandising strategy,
migrate to a new CMS, rebuild checkout, or implement deferred B2B pricing/admin
features such as `BULK-09` or `BULK-10`.

</domain>

<decisions>

## Implementation Decisions

### Scope

- D-01: Treat `CODEBASE_REVIEW.md` as the source of truth for the remediation backlog.
- D-02: Fix user-visible conversion and accessibility blockers before larger refactors.
- D-03: Keep all application code under `src/` and continue following `docs/conventions.md`.
- D-04: Read the relevant local Next 16 docs before changing App Router file conventions, error boundaries, metadata, image behavior, or caching.

### User Experience

- D-05: Homepage contact/newsletter forms must provide accessible pending, success, and error feedback.
- D-06: PDP add-to-cart must refresh visible cart state and announce success.
- D-07: Accessibility fixes should use existing primitives and tokenized Tailwind classes.
- D-08: Autoplay motion must either be removed or receive a persistent visible pause/play control.

### Data, Security, and SEO

- D-09: JSON-LD and inline script data must use one script-safe serializer that escapes `<`.
- D-10: Shopify, Searchanise, Resend, Trustoo, and webhook boundaries must keep using typed narrowing, fail-safe errors, and no secret logging.
- D-11: Production rate limiting must not rely only on module-local memory.
- D-12: Sitemap entries must represent real canonical routes and durable `lastModified` values.

### Architecture

- D-13: PLP performance work must reduce initial fetch/render/hydration cost, not merely hide it behind Suspense.
- D-14: Domain components should not live in `src/components/ui`; `ui` should stay primitive.
- D-15: Shared add-to-cart behavior, Shopify reshapers, image URL handling, and runtime JSON guards should be centralized when multiple callers already duplicate them.
- D-16: Verification must be expanded before the phase is considered production-ready.

</decisions>

<canonical_refs>

## Canonical References

Downstream agents must read these before planning or implementing.

### Review Source

- `CODEBASE_REVIEW.md` - consolidated review findings, priorities, and roadmap.

### Project Rules

- `docs/conventions.md` - folder map, component rules, and scaffolding conventions.
- `.planning/PROJECT.md` - project context and decisions.
- `.planning/REQUIREMENTS.md` - `AUDIT-*` requirements for this phase.
- `.planning/ROADMAP.md` - phase ordering and success criteria.
- `.planning/codebase/ARCHITECTURE.md` - existing route/data/component architecture.
- `.planning/codebase/CONVENTIONS.md` - local style and file conventions.
- `.planning/codebase/CONCERNS.md` - known production concerns.
- `.planning/codebase/TESTING.md` - current verification surface.
- `.planning/codebase/INTEGRATIONS.md` - Shopify, Searchanise, Trustoo, Resend, and webhook context.

### Next 16 Docs

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md` - current error boundary recovery prop.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md` - layout and landmarks context.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/metadata` - metadata and sitemap conventions.
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` - image preload and sizing behavior.

</canonical_refs>

<specifics>

## Issue-To-Plan Map

| Review issue | Covered by |
| --- | --- |
| Broken homepage `/contact` CTA | 05-01 |
| Homepage form result swallowing | 05-01 |
| PDP add-to-cart stale cart / no success status | 05-01 |
| Root error boundary uses `reset` | 05-01 |
| Nested `/collections` `main` | 05-01 |
| Missing skip link | 05-01 |
| Unsafe/raw JSON-LD serialization | 05-01 |
| Autoplay carousel without persistent pause | 05-01, 05-05 |
| Missing typecheck/test scripts and stale contract test | 05-02 |
| Missing interaction coverage for cart/product/forms | 05-02 |
| In-memory rate limiting and public suggestion abuse risk | 05-02 |
| Shopify page cache invalidation missing | 05-02 |
| Quick-view API uncaught Shopify failures | 05-02 |
| Codegen env validation opaque | 05-02 |
| Third-party enrichment failures cached as empty | 05-02 |
| PLP overfetch, local category filtering, list hydration | 05-03 |
| Header mega-nav, quick-view, gallery, image handling performance | 05-03 |
| PDP/route monoliths and domain component drift | 05-04 |
| Accordion/form primitive/add-to-cart duplication | 05-04 |
| Shared Shopify mappers, runtime guards, Portable Text casts | 05-04 |
| Storybook/API coverage gaps and scaffold drift | 05-04 |
| StarRating, loading status, rich-text tables, touch targets | 05-05 |
| Decorative icons, breadcrumb overflow, brand copy | 05-05 |
| Sitemap `/pages/about`, `lastModified`, canonical hygiene | 05-05 |
| Final production-readiness verification | 05-05 |

</specifics>

<deferred>

## Deferred Ideas

- Authenticated wholesale/B2B price lists remain covered by deferred requirement `BULK-10`.
- HulkApps-to-Shopify tier sync remains covered by deferred requirement `BULK-09`.
- A full design redesign is out of scope; this phase fixes quality and reliability issues within the current warm/botanical system.
- Replacing third-party services is out of scope; this phase hardens boundaries and failure behavior.

</deferred>

---

*Phase: 05-codebase-review-remediation*
*Context gathered: 2026-06-02 via codebase review remediation planning*
