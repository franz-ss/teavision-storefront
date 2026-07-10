# Phase 25: Heading structure fixes - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-10
**Phase:** 25-heading-structure-fixes
**Areas discussed:** Product disclosure headings, Collection-story hierarchy, Unexpected source headings

---

## Product disclosure headings

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve existing treatment | Make the accordion title a real H2 while retaining native `details`/`summary` behavior and current presentation. | ✓ |
| Restyle titles | Change the disclosure surface as part of the semantic fix. | |

**User's choice:** Delegated to the stated requirements.
**Notes:** No visual redesign or interaction change was requested.

---

## Collection-story hierarchy

| Option | Description | Selected |
|--------|-------------|----------|
| Isolated mapping | Promote source H3→H2 and H4→H3 through a collection-only sanitizer variant. | ✓ |
| Broad rewrite | Change heading behavior across shared rich-text rendering. | |

**User's choice:** Delegated to the stated requirements.
**Notes:** The shared compact product-description contract remains outside this phase.

---

## Unexpected source headings

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve other levels | Limit the explicit promotion policy to source H3/H4 and preserve existing safe behavior otherwise. | ✓ |
| Normalize more levels | Introduce broader heading normalization. | |

**User's choice:** Delegated to the stated requirements.
**Notes:** No broader content-migration policy was requested.

---

## the agent's Discretion

- Choose the safest standards-compliant markup and focused regression tests that satisfy SEO-03 and SEO-04.

## Deferred Ideas

None.
