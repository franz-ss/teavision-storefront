# Phase 25: Heading structure fixes - Context

**Gathered:** 2026-07-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Correct the semantic heading hierarchy in the existing product disclosure accordions and collection story/read-more content. Preserve native product disclosure behavior and leave product-description rendering, including the shared `compact` sanitizer contract, unchanged.

</domain>

<decisions>
## Implementation Decisions

### Product disclosure headings

- **D-01:** Make the existing product disclosure titles accessible H2 headings while retaining the current native `details` and `summary` interaction model. Do not replace it with scripted disclosure controls or ARIA button/expanded overrides.
- **D-02:** This is a semantic/SEO correction, not a product-page visual redesign. Retain the current disclosure labels, chevron affordance, first-panel default-open state, and overall presentation.

### Collection-story heading promotion

- **D-03:** Create and use an isolated `collectionStory` sanitization variant for the collection story/read-more path only. Its required mapping is source H3 → H2 and H4 → H3.
- **D-04:** Do not broaden the migration into a general rich-text normalization exercise. For source levels other than H3/H4, retain the existing safe behavior unless required to support the isolated variant; no additional heading-level policy is being introduced in this phase.

### Regression boundary

- **D-05:** The shared `compact` sanitizer remains unchanged. Product descriptions must keep their current sanitizer entry point and rendering contract; collection-only behavior must be demonstrably isolated.

### the agent's Discretion

The user has no preference beyond compliance with the locked requirements. Research and planning may choose the safest implementation and focused regression coverage, provided D-01 through D-05 and SEO-03/SEO-04 are met.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase requirements and scope

- `.planning/ROADMAP.md` §Phase 25 — goal, fixed boundary, and success criteria for the heading repair.
- `.planning/REQUIREMENTS.md` §Heading Structure — SEO-03 and SEO-04, including the native disclosure and isolated-sanitizer constraints.

### Existing implementation contracts

- `src/lib/shopify/html-content.ts` — current sanitizer variants, heading transforms, sanitized HTML type, and the shared `compact` contract that must not change.
- `src/app/(storefront)/products/[handle]/page.tsx` — existing server-rendered product disclosures and their native `details`/`summary` markup.
- `src/app/(storefront)/collections/[handle]/_components/page-content.tsx` — collection rich-description flow and the only intended `collectionStory` sanitizer call site.
- `src/components/collection/story-disclosure/story-disclosure.tsx` — collection read-more disclosure that renders the sanitized story content.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `src/lib/shopify/html-content.ts`: owns all trusted Shopify HTML sanitization and is the correct boundary for an isolated collection-story transform.
- `src/components/ui/rich-text/rich-text.tsx`: renders branded `SanitizedHtml` and already has a `disclosure` presentation variant for collection story content.
- `src/components/collection/story-disclosure/story-disclosure.tsx`: preserves a native `details`/`summary` read-more surface for collections.

### Established Patterns

- Shopify HTML is branded after sanitization, uses explicit allowed tags/classes, and applies per-variant heading transforms before `RichText` rendering.
- Route components use named exports except for Next.js special-page defaults; application components use Tailwind design tokens and `cn()` composition.
- Existing HTML and route tests are the natural regression surface; focused additions should prove the isolated variant and unchanged compact behavior.

### Integration Points

- Product disclosure title markup is local to `src/app/(storefront)/products/[handle]/page.tsx`.
- Collection story HTML is prepared in `src/app/(storefront)/collections/[handle]/_components/page-content.tsx` and passed through `StoryDisclosure` into `RichText`.
- `src/lib/shopify/html-content.test.ts`, `src/app/(storefront)/products/[handle]/page.test.tsx`, and `src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx` are the likely verification points.

</code_context>

<specifics>
## Specific Ideas

No specific visual or implementation preference was supplied: comply with the requirements without adding behavior or scope beyond them.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 25-heading-structure-fixes*
*Context gathered: 2026-07-10*
