# Phase 06: Prevent the site from being indexed - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-03T09:38:25+08:00
**Phase:** 06-prevent-the-site-from-being-indexed
**Areas discussed:** Indexing switch model, Robots strictness, Metadata coverage, Sitemap behavior

---

## Indexing Switch Model

| Option                      | Description                                                                             | Selected |
| --------------------------- | --------------------------------------------------------------------------------------- | -------- |
| Env-controlled noindex mode | Use an environment flag and shared helper so launch can intentionally restore indexing. | ✓        |
| Hard-coded noindex          | Hard-code temporary noindex behavior until someone removes it.                          |          |
| Let the agent decide        | Leave the switch model to the planner.                                                  |          |

**User's choice:** Accepted the recommendation for all four areas.
**Notes:** The selected approach keeps this task temporary and reversible.

---

## Robots Strictness

| Option                     | Description                                                                                                  | Selected |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ | -------- |
| Metadata-first robots file | Keep crawlers able to see page-level noindex while still disallowing `/api/` and avoiding sitemap promotion. | ✓        |
| Blanket `Disallow: /`      | Block all crawling at robots.txt level. Simpler, but can prevent crawlers from seeing noindex.               |          |
| Crawler-specific rules     | Add tailored bot directives. More complex and unnecessary unless a specific crawler needs handling.          |          |

**User's choice:** Accepted the recommendation for all four areas.
**Notes:** The recommendation is based on Google Search Central guidance: noindex must be visible to crawlers.

---

## Metadata Coverage

| Option                          | Description                                                                                      | Selected |
| ------------------------------- | ------------------------------------------------------------------------------------------------ | -------- |
| Shared/global noindex directive | Layer temporary noindex/nofollow/noarchive-style directives across all public storefront routes. | ✓        |
| Route-by-route only             | Patch each route independently. Works but increases drift risk.                                  |          |
| Minimal high-risk routes only   | Cover homepage/products/collections but leave lower-risk routes unchanged.                       |          |

**User's choice:** Accepted the recommendation for all four areas.
**Notes:** Existing route SEO metadata should be preserved and augmented, not deleted.

---

## Sitemap Behavior

| Option                                          | Description                                                                          | Selected |
| ----------------------------------------------- | ------------------------------------------------------------------------------------ | -------- |
| Suppress indexable URLs while noindex is active | Return an empty sitemap or no public storefront URLs during noindex mode.            | ✓        |
| Keep full sitemap                               | Preserve the current sitemap and rely only on metadata.                              |          |
| Homepage-only sitemap                           | Keep only the root URL. Still invites at least one URL while noindex mode is active. |          |

**User's choice:** Accepted the recommendation for all four areas.
**Notes:** When the flag is disabled, restore the Phase 5 sitemap behavior.

---

## the agent's Discretion

- Exact helper location and environment variable name are left to the planner, within project conventions.

## Deferred Ideas

None.
