# Phase 16: Legal, Consent, Analytics, and SEO Launch Coverage - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-22
**Phase:** 16-Legal, Consent, Analytics, and SEO Launch Coverage
**Areas discussed:** Policy routes and legacy links, Consent defaults and preference UI, Analytics destinations and events, Launch SEO flip and evidence

---

## Policy Routes and Legacy Links

| Question | Options Presented | User's Choice |
|---|---|---|
| How should Phase 16 source legal and policy page content for launch-route coverage? | Shopify + placeholders; Static code pages; Redirect legacy only | Static code pages |
| Which URL strategy should the static legal pages use? | Canonical headless URLs plus redirects; Preserve Shopify-style policy URLs; Keep current mixed URLs | Canonical headless URLs plus redirects |
| How should the static legal pages handle pending review status? | Visible review banner on draft pages; Internal docs only; Block unapproved pages from indexing | Visible review banner on draft pages |
| How much should Phase 16 verify for legal/policy routes? | Route matrix tests; Browser smoke only; Documentation only | Route matrix tests |
| Should Phase 16 source any policy text from Shopify at all, or fully own it in code? | Fully code-owned pages; Code-owned shell with Shopify content import; Shopify reference audit only | Fully code-owned pages |
| Which policy pages are launch-blocking for Phase 16? | Full launch set; Core legal set only; Broken URLs only | Full launch set |
| How should cookie/privacy preferences fit into the legal page set? | Dedicated preference page plus banner link; Section inside privacy policy; Banner only | Dedicated preference page plus banner link |
| How should legal route review status be represented in launch evidence? | Per-page approval matrix; Single launch note; Runtime banner only | Per-page approval matrix |

**Notes:** User asked for the agent's recommendation before leaving the area. Recommendation was to move on because content ownership, canonical URLs, legacy redirects, draft status, required page set, cookie-preference page, verification depth, and approval evidence were sufficiently decided.

---

## Consent Defaults and Preference UI

| Question | Options Presented | User's Choice |
|---|---|---|
| What should the default visitor state be before they make a consent choice? | Deny non-essential by default; Analytics allowed, ads denied; Region-based defaults | Deny non-essential by default |
| What kind of consent UI should Phase 16 implement? | Banner plus preference modal/page; Minimal banner only; Preference page only | Banner plus preference modal/page |
| Which consent categories should the UI and adapter track? | Essential, analytics, marketing; Essential, analytics, advertising, personalization; Essential plus all-or-nothing optional | Essential, analytics, marketing |
| How should Shopify Customer Privacy API fit in? | Wire or explicitly no-op behind adapter; Wire it only if Shopify pixels are enabled; Defer Shopify privacy API | Wire or explicitly no-op behind adapter |

**Notes:** User requested that recommendations always be stated. Recommendation was to move on because consent default, UI shape, category model, persistence surface, and Shopify privacy integration policy were decided.

---

## Analytics Destinations and Events

| Question | Options Presented | User's Choice |
|---|---|---|
| Which analytics destinations should Phase 16 prioritize? | GA4 first, others configurable-disabled; GTM container first; Multi-destination from launch | GA4 first, others configurable-disabled |
| Which events are launch-blocking? | Core ecommerce + lead events; Ecommerce only; Minimal launch pulse | Core ecommerce + lead events |
| How should analytics be verified without sending production events from CI? | Typed adapter with fake/test sink; Browser spies only; Manual destination verification only | Typed adapter with fake/test sink |
| How should Phase 16 handle purchase/conversion events? | Checkout-start only, purchase owner-gated; Attempt thank-you/success route tracking; No purchase path in Phase 16 | Checkout-start only, purchase owner-gated |

**Notes:** Recommendation was to move on because GA4-first priority, event scope, fake/test evidence, and purchase owner-gating were locked.

---

## Launch SEO Flip and Evidence

| Question | Options Presented | User's Choice |
|---|---|---|
| How should Phase 16 handle the indexing flip? | Explicit launch gate env flip; Code-level launch flag file; Manual deployment note only | Explicit launch gate env flip |
| What SEO evidence should Phase 16 produce? | Automated SEO route matrix; Sitemap and robots only; Manual crawl checklist | Automated SEO route matrix |
| Which static URLs should be included in sitemap launch coverage? | Legal + key static landing pages; Legal pages only; No new static sitemap entries | Legal + key static landing pages |
| How should Search Console readiness be handled? | Search Console/runbook evidence only; Require live Search Console proof in Phase 16; Defer all Search Console work to Phase 17 | Search Console/runbook evidence only |

**Notes:** Recommendation was to finish context because all four selected gray areas had implementation-level decisions.

---

## the agent's Discretion

No area was delegated to the agent.

## Deferred Ideas

None.
