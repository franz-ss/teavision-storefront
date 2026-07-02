# Phase 22: Storefront Data and Rendering - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-07-02T12:49:10.4036486+08:00
**Phase:** 22-Storefront Data and Rendering
**Areas discussed:** Fallback and cutover behavior, SEO field ownership, Section mapping depth, Sanity image rollout and hero LCP

---

## Fallback and Cutover Behavior

### Missing or Invalid Singleton

| Option | Description | Selected |
|---|---|---|
| Temporary static fallback | Render the current code-owned homepage until seeded content is valid, as a migration-only fallback. | |
| Fail loudly | Surface an error when Sanity content is missing or invalid. | Yes |
| Section fallbacks | Use CMS data where available and static defaults for missing sections. | |

**User's choice:** No runtime fallback. If the Sanity `homePage` singleton is missing or invalid, the route should fail loudly.
**Notes:** The user explicitly corrected the initial recommendation: "I explicitly said, no fallback, I dont want bulk code." This became the governing fallback decision.

### Failure Timing

| Option | Description | Selected |
|---|---|---|
| Request-time route failure | `/` throws during render if the CMS document is missing or invalid. | Yes |
| Build/check failure too | Add validation/test guard plus route failure. | |
| You decide | Planner chooses the smallest strict validation path. | |

**User's choice:** Request-time route failure.
**Notes:** Keep the runtime behavior lean and honest.

### Runtime Validation Depth

| Option | Description | Selected |
|---|---|---|
| Document present + critical fields only | Require document plus render-critical fields; trust Sanity schema for detailed rules. | Yes |
| Full runtime validation | Validate all counts, lengths, links, images, and nested fields. | |
| Presence only | Fail only when the whole document is missing. | |

**User's choice:** Document present plus critical fields only.
**Notes:** The assistant should state recommendations and why for future questions.

### Static Homepage Content After Migration

| Option | Description | Selected |
|---|---|---|
| Remove runtime static content | Delete or shrink old homepage constants from the live route path. | |
| Keep static content as test fixtures | Preserve useful Storybook/test fixture data, not runtime fallback data. | Yes |
| Leave it temporarily | Keep existing constants in place for now. | |

**User's choice:** Keep the current static content as test/story fixtures, not runtime fallback code.
**Notes:** This preserves coverage while avoiding a second live homepage implementation.

---

## SEO Field Ownership

### CMS SEO Fields

| Option | Description | Selected |
|---|---|---|
| CMS metadata, code JSON-LD | Use Sanity title, description, canonical, and noIndex; keep Organization/WebSite JSON-LD in code. | Yes |
| Keep all SEO code-owned | Leave current route metadata and JSON-LD hardcoded until Phase 23. | |
| CMS owns all SEO | Move metadata and JSON-LD inputs to Sanity. | |

**User's choice:** CMS owns homepage metadata; JSON-LD stays code-owned.
**Notes:** Matches the Phase 21 schema without expanding JSON-LD modeling.

### noIndex Interaction

| Option | Description | Selected |
|---|---|---|
| Preserve global noindex gate | CMS noIndex is page intent, but existing launch controls still win. | Yes |
| CMS noIndex controls homepage directly | Let Sanity decide homepage indexability directly. | |
| Ignore CMS noIndex for now | Use CMS title/description/canonical only. | |

**User's choice:** Preserve global noindex controls.
**Notes:** Phase 22 must not weaken launch noindex behavior.

### Missing SEO Fields

| Option | Description | Selected |
|---|---|---|
| Fail route on required SEO gaps | Require title, description, canonical path, and noIndex shape from Sanity. | Yes |
| Use v1.5 hardcoded SEO fallback | Fall back to current hardcoded SEO constants. | |
| Allow blank metadata | Render with whatever exists. | |

**User's choice:** Fail the route on required SEO gaps.
**Notes:** Avoids hidden SEO fallback code.

### Canonical Flexibility

| Option | Description | Selected |
|---|---|---|
| Require `/` only | Sanity canonical must be `/`. | Yes |
| Allow local paths | Accept any local canonical path. | |
| Allow absolute Teavision URL too | Accept `/` or configured site URL plus `/`. | |

**User's choice:** Homepage canonical must stay `/`.
**Notes:** Phase 21 also locks the homepage slug to `/`.

---

## Section Mapping Depth

### Schema Coverage

| Option | Description | Selected |
|---|---|---|
| All modeled content fields | Every field already in `homePage` maps into existing components. | Yes |
| Editorial copy/images only | CMS controls visible copy/images but not operational fields. | |
| Minimal first pass | CMS controls hero and major section intros only. | |

**User's choice:** All modeled Phase 21 content fields should drive rendering.
**Notes:** Forms/actions and decorative motif assets remain code-owned.

### Component Adaptation

| Option | Description | Selected |
|---|---|---|
| Prop-enable existing components | Existing sections receive typed content props and keep the same design. | Yes |
| Create CMS wrapper components | Route wrappers translate CMS data into current components. | |
| Create parallel CMS sections | New CMS-specific section files. | |

**User's choice:** Prop-enable the existing homepage components in place.
**Notes:** Avoid parallel CMS-only component copies and UI duplication.

### Section Order

| Option | Description | Selected |
|---|---|---|
| Fixed code order | Render sections in the existing order from the route. | Yes |
| Schema-derived object order | Use Sanity document field order as source. | |
| Prepare for future reordering | Add abstractions for v2 reordering now. | |

**User's choice:** Section order stays fixed in code.
**Notes:** Reordering/page-builder behavior remains v2/out of scope.

### Tea Journal Data

| Option | Description | Selected |
|---|---|---|
| CMS config + live posts | CMS controls intro, blog handle, link label, and max posts; posts come from the blog query. | Yes |
| CMS controls intro only | Keep blog handle/link/max posts code-owned. | |
| Homepage singleton owns selected posts | Editors select posts directly in the homepage doc. | |

**User's choice:** Tea Journal uses CMS config plus live posts.
**Notes:** Avoids stale duplicated article data in the homepage singleton.

---

## Sanity Image Rollout and Hero LCP

### Hero LCP Image

| Option | Description | Selected |
|---|---|---|
| Yes, with exact LCP discipline | Render the Sanity hero image through `next/image` with stable dimensions, `preload`, `fetchPriority="high"`, `sizes="100vw"`, and crop/hotspot support. | Yes |
| Keep hero local for now | Move other images to Sanity but keep the hero static until Phase 23 proof. | |
| You decide | Planner chooses the smallest compliant path. | |

**User's choice:** Hero image moves to Sanity in Phase 22 with exact current LCP discipline preserved.
**Notes:** Avoids a partial hidden migration.

### Missing Image Data

| Option | Description | Selected |
|---|---|---|
| Fail route | Required Sanity images missing URL/dimensions invalidate the homepage. | Yes |
| Render with guessed dimensions | Use defaults to keep the page up. | |
| Skip that image/section | Avoid crashing by omitting invalid content. | |

**User's choice:** Required Sanity images must have usable URL and dimensions, or `/` fails.
**Notes:** Prevents CLS risk and hidden CMS drift.

### Crop/Hotspot Layout

| Option | Description | Selected |
|---|---|---|
| Respect crop/hotspot inside existing layout | Use Sanity image positioning while keeping current geometry. | Yes |
| Let CMS dimensions drive layout | Use each asset's natural dimensions/aspect ratio. | |
| Ignore crop/hotspot | Use only generated image URLs. | |

**User's choice:** Respect Sanity crop/hotspot inside existing layout constraints.
**Notes:** Design geometry stays code-owned.

### Decorative Motifs

| Option | Description | Selected |
|---|---|---|
| Keep decorative motifs code-owned | CMS controls authored visible images; motif/ornament assets stay in components. | Yes |
| Move decorative motifs to Sanity too | Expand schema so editors control every image. | |
| Remove decorative motifs | Simplify image handling by changing the design. | |

**User's choice:** Decorative motif assets stay code-owned.
**Notes:** Phase 21 intentionally did not model decorative/motif-only images.

---

## Agent Discretion

None. The user made explicit choices for every decision.

## Deferred Ideas

None. Discussion stayed within Phase 22 scope.
