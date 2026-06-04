---
phase: 7
reviewers: [gemini]
reviewers_attempted: [gemini, codex, cursor]
reviewers_unavailable:
  codex: 'usage limit hit (resets 2026-06-08)'
  cursor: 'installed binary is the IDE launcher, not headless cursor-agent; cursor-agent not installed'
  claude: 'skipped — this orchestrator runs inside Claude Code (independence)'
reviewed_at: 2026-06-03T13:30:00+08:00
plans_reviewed: [07-01-PLAN.md]
---

# Cross-AI Plan Review — Phase 7: Collection Hero Production Parity

> Independent reviewer: **Gemini**. Codex and Cursor were attempted but unavailable (see frontmatter). One external model reviewed the plan; treat the "Consensus" section as orchestrator synthesis, not multi-model agreement.

## Gemini Review

This review evaluates the implementation plan for **Phase 7: Collection Hero Production Parity**.

### Summary

The plan is exceptionally thorough and demonstrates a high degree of codebase awareness. It correctly identifies the technical analogs (homepage hero) and the convention-compliant path (rebuilding natively with tokens rather than raw HTML). The regression-safety strategy via per-handle gating is sound and matches existing patterns. The promotion to a shared component with Storybook coverage is a high-signal engineering improvement that aligns with the project's long-term standards.

### Strengths

- **Architectural Alignment:** Promotes route-local UI to a shared domain component (`src/components/collection/`) with Storybook coverage, as mandated by the project's conventions.
- **Pattern Reuse:** Leverages the existing homepage hero implementation as a "proven" technical pattern for the full-bleed banner, ensuring consistency in implementation details like the scrim and text overlay.
- **Regression Safety:** Employs the established `per-handle config` pattern in `page-helpers.ts` to ensure zero impact on the other collections in the store.
- **Data Decoupling:** Uses primitive props for the promoted component, ensuring it remains a "dumb" presentational unit that isn't tethered to route-local logic or types.
- **Exhaustive Verification:** Includes specific grep-based guards to prevent the introduction of raw hex codes or inline styles, directly addressing the "non-negotiable" project constraints.

### Concerns

- **Visual Parity vs. Codebase Style (LOW):** The plan opts to overlay text on the banner image (like the homepage hero) for a more "on-brand" look, despite noting that production places the heading _below_ the image. This is a deliberate design choice, but it slightly deviates from the "1:1 parity" goal in favor of the "Next storefront vibe."
- **LCP Performance (MEDIUM):** Moving from a small inset image to a full-bleed 1920px banner (`organic_tea...png`) will significantly impact the Largest Contentful Paint (LCP). While `loading="eager"` and `fetchPriority="high"` are specified, the asset weight of that specific PNG should be monitored.
- **Text Contrast (MEDIUM):** Overlaying white `text-on-brand` on an image relies heavily on the `bg-inverse/50` scrim. If the banner image has particularly light or busy areas, readability could suffer.
- **Wholesale Conversion (LOW):** Removing the two prominent wholesale CTAs in the consumer variant may result in a slight dip in B2B lead generation for this specific collection. The inclusion of the "Wholesale enquiries" link is a necessary but "demoted" mitigation.

### Suggestions

- **Mobile Aspect Ratio:** Ensure the `object-cover` behavior on the full-bleed banner doesn't "crop out" the essential tea leaves/branding elements of the `organic_tea` asset on narrow mobile viewports. A `min-h-[400px]` or similar might be needed to preserve the banner's visual impact.
- **Image Optimization:** Verify that the production PNG isn't an unoptimized massive file. If it is, consider recommending a conversion to WebP/AVIF via the Shopify CDN parameters in the future.
- **Typography Refinement:** Double-check that `type-eyebrow` (which defaults to uppercase) doesn't conflict with the `subheading` text if that text already contains specific casing requirements.

### Risk Assessment

**LOW.** The plan's "gated" nature makes it extremely safe. By using a handle-specific config, the developer ensures that the new logic only executes for a single page, effectively turning the new feature into a controlled rollout without the risk of breaking the core wholesale experience for other collections. The technical path is well-documented and mirrors existing, stable code.

---

## Consensus Summary

Single external reviewer (Gemini) plus orchestrator synthesis. No HIGH-severity concerns were raised — the plan does **not** require a replan. The two MEDIUM concerns are worth folding into the plan/execution before or during implementation.

### Agreed Strengths

- Convention-compliant native rebuild (tokens, no raw HTML) reusing the proven homepage-hero full-bleed pattern.
- Per-handle gating delivers strong regression safety (controlled, single-page rollout).
- Promotion to `src/components/collection/collection-hero/` with primitive props + Storybook coverage matches project standards.
- Grep-based acceptance criteria concretely enforce the hard conventions.

### Concerns to Action (priority order)

1. **[MEDIUM] LCP / image weight** — the full-bleed `organic_tea…png` becomes the LCP element. `eager` + `fetchPriority="high"` are set, but: confirm the Shopify CDN size request is sensible (the plan uses `getSizedShopifyImageUrl(..., 1920)`), and consider `quality`/format params. _Action:_ add a verification note to eyeball the transferred image size and LCP in the human-verify checkpoint.
2. **[MEDIUM] Text contrast over image** — white `text-on-brand` legibility depends on the `bg-inverse/50` scrim against a potentially light/busy banner. _Action:_ verify WCAG AA contrast on the actual asset during the checkpoint; if marginal, deepen the scrim (e.g. `bg-inverse/60`) or add a gradient — still token-based.
3. **[LOW] Mobile `object-cover` cropping** — ensure the banner keeps its key subject on narrow viewports; consider a min-height. (Note: `min-h-[400px]` is an arbitrary value — prefer an existing spacing scale or a responsive aspect ratio to stay clean, since the project favors tokens over arbitrary values.)
4. **[LOW] `type-eyebrow` uppercase** — the subheading "Premium Organic Loose Leaf Tea Australia" will render all-caps. This is already intended (matches production's uppercase gold subheading), but confirm it reads well; the plan already forbids stacking a second `uppercase` utility.
5. **[LOW] Wholesale conversion** — the demoted "Wholesale enquiries" link mitigates lost B2B CTAs. Already flagged in the plan as `[CONFIRM with owner]`.

### Divergent Views

- None — single reviewer. The one place the reviewer flagged a deliberate-deviation tension (overlay text vs production's image-then-heading layout) is an intentional design decision recorded in CONTEXT.md; the human-verify checkpoint is the right place to confirm it against the live page.

### Verdict

**Proceed to execution.** No HIGH concerns; no replan needed. Optionally fold the two MEDIUM items (LCP check, contrast check) into the human-verify checkpoint of `07-01-PLAN.md` before executing.
