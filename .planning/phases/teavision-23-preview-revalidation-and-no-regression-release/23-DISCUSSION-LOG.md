# Phase 23: Preview, Revalidation, and No-Regression Release - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-07-03T09:15:13.5606826+08:00
**Phase:** 23-Preview, Revalidation, and No-Regression Release
**Areas discussed:** Preview Entry And Exit, Draft Data Isolation, Homepage Webhook Proof, No-Regression Release Gate

---

## Preview Entry And Exit

### How should editors enter Draft Mode for the homepage?

| Option | Description | Selected |
| --- | --- | --- |
| Secret URL only | Add `/api/draft?secret=...&slug=/` and `/api/draft/disable`; lowest-risk Phase 23 scope and matches the existing plan. | yes |
| Secret URL + Studio link | Same secure route, plus a Sanity Studio preview action/link for editors; nicer workflow but touches `../teavision-cms` config/CORS. | |
| You decide | Default to the minimal secure route and document how to wire Studio later. | |
| Other | Describe your preferred entry flow. | |

**User's choice:** Secret URL only
**Notes:** Phase 23 should not add Sanity Studio preview wiring.

### Before enabling Draft Mode, how strict should the route be?

| Option | Description | Selected |
| --- | --- | --- |
| Validate secret, slug, and document exists | Require the preview secret, allow only site-relative `/`, confirm the `homePage` draft/published document can be read, then enable Draft Mode. | yes |
| Validate secret and slug only | Simpler, but editors could enter preview and hit a route failure if the draft content is missing or invalid. | |
| You decide | Use the stricter document-exists check. | |
| Other | Describe the rule. | |

**User's choice:** Validate secret, slug, and document exists
**Notes:** The preview route must fail before enabling Draft Mode if setup is invalid.

### How should editors leave preview mode?

| Option | Description | Selected |
| --- | --- | --- |
| Disable route only | Add `/api/draft/disable` that calls `draftMode().disable()` and redirects to `/`; no in-page UI or client banner in Phase 23. | yes |
| Preview banner with exit link | Add a visible preview-only banner on `/` with an exit link; helpful, but adds UI and draft-state rendering concerns. | |
| You decide | Use the disable route only and document the URL. | |
| Other | Describe your preferred exit behavior. | |

**User's choice:** Disable route only
**Notes:** No in-page preview banner or client UI in Phase 23.

### What should happen when the preview URL is invalid?

| Option | Description | Selected |
| --- | --- | --- |
| Reject with plain 401/400 response | Invalid secret, unsafe slug, or missing document returns a simple error response; no redirect that could hide setup problems. | yes |
| Redirect to `/` with no Draft Mode | Friendlier, but easy to miss that preview failed. | |
| You decide | Use explicit error responses for invalid preview attempts. | |
| Other | Describe the failure behavior. | |

**User's choice:** Reject with plain 401/400 response
**Notes:** Invalid preview attempts should be obvious.

---

## Draft Data Isolation

### What should preview mode be allowed to render?

| Option | Description | Selected |
| --- | --- | --- |
| Draft homepage body only; metadata stays published/clean | Editors can review draft page content at `/`, while title/meta/OG/JSON-LD stay published-safe and `stega: false`. | yes |
| Draft body plus draft metadata | More complete editorial preview, but higher risk of draft/stega/source-map text entering SEO surfaces unless planner adds strict split fetches. | |
| You decide | Prefer body-only draft rendering for Phase 23. | |
| Other | Describe the preview data boundary. | |

**User's choice:** Draft homepage body only; metadata stays published/clean
**Notes:** Published SEO surfaces remain clean even during preview.

### How should draft reads be isolated from the published cache?

| Option | Description | Selected |
| --- | --- | --- |
| Separate draft helper | Keep `getHomepage()` published-only/tagged, and add a token-backed draft read path that is not saved under published homepage tags. | yes |
| One helper with preview option | Fewer files, but easier to accidentally mix draft perspective into the published cache boundary. | |
| You decide | Use the separate draft helper. | |
| Other | Describe the isolation model. | |

**User's choice:** Separate draft helper
**Notes:** `getHomepage()` remains the published-only cache boundary.

### Should preview enable Sanity stega/source-map markers in the rendered body?

| Option | Description | Selected |
| --- | --- | --- |
| No stega in Phase 23 | Draft Mode previews content only; no Visual Editing markers, no source-map text, simpler published-leak guarantees. | yes |
| Stega in preview body only | Useful for future click-to-edit debugging, but this starts Visual Editing-adjacent behavior and needs extra leak guards. | |
| You decide | Keep stega disabled for now. | |
| Other | Describe how markers should behave. | |

**User's choice:** No stega in Phase 23
**Notes:** No source-map markers in preview body rendering.

### If draft content is missing or invalid after Draft Mode is enabled, what should `/` do?

| Option | Description | Selected |
| --- | --- | --- |
| Fail loudly | Match Phase 22: missing/invalid render-critical homepage content throws instead of falling back to published content. | yes |
| Show published homepage | Friendlier, but it can hide preview/content setup failures. | |
| You decide | Fail loudly. | |
| Other | Describe the failure behavior. | |

**User's choice:** Fail loudly
**Notes:** No fallback to published content in preview mode.

---

## Homepage Webhook Proof

### When Sanity sends a signed payload for `homePage`, which tags should Phase 23 invalidate?

| Option | Description | Selected |
| --- | --- | --- |
| Existing homepage tags only | Revalidate `homePage` and `sanity-homepage`, matching current `getHomepage()` cache tags exactly. | yes |
| Existing plus legacy planned aliases | Revalidate `homePage`, `sanity-homepage`, `home`, `home-root`, and `sanity-home`; extra safety but tag sprawl. | |
| You decide | Use only the current real tags unless implementation intentionally renames them. | |
| Other | Describe the tag policy. | |

**User's choice:** Existing homepage tags only
**Notes:** Do not add tag aliases unless implementation renames the cache tags.

### What should happen to existing blog webhook behavior?

| Option | Description | Selected |
| --- | --- | --- |
| Preserve exactly and test it | Add homepage handling without changing current `blog`, `blog-{slug}`, and `article-{blogSlug}-{articleSlug}` invalidation behavior. | yes |
| Refactor shared parser/tag builder | Cleaner long-term, but higher chance of regressing blog behavior during a release-critical phase. | |
| You decide | Preserve behavior with focused tests. | |
| Other | Describe how much refactor is acceptable. | |

**User's choice:** Preserve exactly and test it
**Notes:** Blog webhook behavior must not regress.

### What proof should count before Phase 23 is considered done?

| Option | Description | Selected |
| --- | --- | --- |
| Route-handler tests plus optional manual smoke | Add route tests for valid signed `homePage`, invalid signature, existing blog payloads, and no raw body/secret logging assumptions; manual real Sanity publish is documented but not required locally. | yes |
| Require real Sanity publish proof | Stronger release evidence, but depends on external Studio/webhook configuration and may block local completion. | |
| You decide | Use automated route tests as the required proof and document real publish as deployment checklist. | |
| Other | Describe the required proof. | |

**User's choice:** Route-handler tests plus optional manual smoke
**Notes:** Real Sanity publish proof is deployment checklist evidence, not a local completion blocker.

### How should the webhook route log homepage events?

| Option | Description | Selected |
| --- | --- | --- |
| Metadata-only logging | Log document type, accepted/rejected status, and booleans like hasBlogSlug/hasArticleSlug; never log body content, signatures, secrets, or unpublished fields. | yes |
| No logging for homepage events | Minimizes leak risk but reduces operability compared with existing route style. | |
| You decide | Use metadata-only logs matching current route style. | |
| Other | Describe the logging boundary. | |

**User's choice:** Metadata-only logging
**Notes:** Never log raw payload content, signatures, secrets, or unpublished fields.

---

## No-Regression Release Gate

### What is the score-of-record for homepage PageSpeed regression?

| Option | Description | Selected |
| --- | --- | --- |
| Real PSI on deployed preview | Local Lighthouse is supporting evidence; rollout needs real PSI for `/` on a public noindexed preview compared against the v1.5 baseline. | yes |
| Local Lighthouse only | Fully automatable, but prior phases showed local lab numbers can mislead. | |
| You decide | Use real PSI as score-of-record and local Lighthouse as diagnostics. | |
| Other | Describe the score source. | |

**User's choice:** Real PSI on deployed preview
**Notes:** Local Lighthouse is diagnostic only.

### How strict is the PageSpeed blocker?

| Option | Description | Selected |
| --- | --- | --- |
| Any category score drop blocks rollout | Performance, Accessibility, Best Practices, or SEO below the v1.5 `/` baseline means fix or roll back before release. | yes |
| Only Performance and SEO block | Focuses on the sensitive areas, but could let a Best Practices/Accessibility regression slip. | |
| Allow tiny variance | Avoids overreacting to noisy PSI, but needs a threshold rule and can blur the "no regression" promise. | |
| Other | Describe the blocker threshold. | |

**User's choice:** Any category score drop blocks rollout
**Notes:** Applies to Performance, Accessibility, Best Practices, and SEO.

### What local SEO evidence must pass before asking for real PSI / release approval?

| Option | Description | Selected |
| --- | --- | --- |
| Homepage-focused SEO checks plus existing launch probes | Keep one visible H1, metadata/canonical/noindex/JSON-LD cleanliness, no stega/draft text in published HTML, and run existing SEO probes where applicable. | yes |
| Existing launch SEO probes only | Less new work, but may miss Sanity-specific published/draft leak regressions. | |
| You decide | Add homepage-specific checks and keep existing probes. | |
| Other | Describe the SEO gate. | |

**User's choice:** Homepage-focused SEO checks plus existing launch probes
**Notes:** Sanity-specific published/draft leak checks are required.

### What rollback/blocking evidence should Phase 23 produce?

| Option | Description | Selected |
| --- | --- | --- |
| Release gate doc with fix-or-rollback rule | Record baseline, current preview PSI/SEO results, pass/fail decision, and explicit rollback trigger if any measured score drops. | yes |
| Update existing performance evidence only | Keeps docs smaller but buries the Sanity release decision in broader local Lighthouse evidence. | |
| You decide | Create a focused Phase 23 release gate/evidence doc. | |
| Other | Describe the evidence artifact. | |

**User's choice:** Release gate doc with fix-or-rollback rule
**Notes:** Phase 23 needs a focused release gate/evidence document.

---

## Agent Discretion

None. The user selected explicit decisions for every area.

## Deferred Ideas

- Sanity Studio preview action/link for `/`.
- In-page preview banner/exit UI.
- Sanity Presentation Tool, Visual Editing, stega markers, source maps, or `defineLive`/live content.
