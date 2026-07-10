---
phase: 25-heading-structure-fixes
verified: 2026-07-10
status: human_needed
score: 6/6 automated must-haves
requirements: [SEO-03, SEO-04]
---

# Phase 25: Heading Structure Fixes Verification

## Goal

Correct product and collection heading levels without weakening native disclosure semantics or changing product-description sanitization.

## Automated Evidence

| Requirement | Result | Evidence |
| --- | --- | --- |
| SEO-03 | PASS | Product route static render proves one page H1; all three specification disclosures are native `details > summary > h2`; the first remains open; no `role="button"` or `aria-expanded` is rendered. |
| SEO-04 | PASS | Collection route static render proves source H3/H4 becomes H2/H3 with the required source-specific classes after `#product-grid`; rich-hero input invokes the collection sanitizer zero times. |
| Trusted HTML boundary | PASS | `collectionStory` reuses the established sanitizer policy and branded return path; no new HTML sink or application-level `SanitizedHtml` cast was added. |
| Compact regression | PASS | `sanitizeShopifyCompactHtml()` and the product description call remain unchanged; source H1/H2 still render as compact H3 output. |
| Storybook | PASS | `pnpm test:stories` passed (106 files, 362 tests), including mobile H2/H3 hierarchy, default-open state, and overflow checks. |
| Full quality gate | PASS | `pnpm lint`, `pnpm typecheck`, `pnpm test:unit` (70 files, 314 tests), and `pnpm build` all passed. |

## Human Verification Required

### 1. Native mobile disclosure keyboard behavior

Open `Collection/StoryDisclosure → Long Unbroken Title Mobile` in Storybook. With keyboard only, focus the native summary and toggle it closed and open. Confirm the visible focus treatment, chevron rotation, and absence of horizontal overflow while the opened content remains H2 followed by H3.

Expected: The browser-native `details`/`summary` behavior works without custom ARIA or client state, and the long title remains within the mobile viewport.

Reason: Automated browser tests and visual inspection cover hierarchy, open state, and overflow, but the in-app browser could not dispatch a keypress to Storybook's nested iframe control.

## Conclusion

All automated must-haves are verified. Phase completion awaits the single native keyboard/focus confirmation above.
