# Incremental Production Rollout Plan

**Status:** Draft  
**Prepared:** 2026-07-23  
**Scope:** Migration of `www.teavision.com.au` from the existing Shopify storefront to the Next.js 16 headless storefront on Vercel.

## Recommendation

Use a rollback-first production cutover preceded by two controlled preview cohorts. The repository already supports health checks, release identification, Sentry/Vercel monitoring, reversible environment gates, production smoke tests, and Vercel rollback. It does **not** currently contain a traffic-splitting proxy or middleware.

Therefore:

1. Use the current noindex Vercel deployment for internal and owner/SEO validation.
2. Rehearse the exact production deployment and rollback before changing the public domain.
3. Cut the public domain over once all mandatory gates pass, with engineering and the store owner in a four-hour launch watch.
4. Enable optional integrations in later stages.
5. Use the original `1% -> 10% -> 50% -> 100%` ramp only if a session-sticky traffic split between the old and new storefronts is implemented and rehearsed first.

Do not simulate a percentage rollout with ad hoc DNS changes. DNS does not provide reliable per-session stickiness, and an untested split can fragment carts, analytics, caching, and SEO behavior.

## Current Baseline

As of 2026-07-23:

- Automated production-readiness checks are green, but the recorded launch decision remains gated by owner-controlled Shopify/admin evidence.
- The protected canonical URL inventory is complete and verified. The owner-approved staging sitemap can also expose production-canonical URLs while staging remains noindex and the sitemap stays unadvertised in `robots.txt`.
- Native mobile disclosure keyboard and focus validation is still pending.
- Collection and product pages expose meaningful server-rendered HTML. Collection loading and LCP request-discovery remediation is implemented and verified locally.
- The working tree contains uncommitted SEO/indexing, collection loading and image-priority changes, tests, and launch documentation. No launch candidate should be frozen until those changes are reviewed and committed intentionally.
- The latest SEO validation still identifies an authoritative old-to-new redirect export, inaccurate FAQ copy/schema, remaining template performance validation, production host/canonical proof, and Search Console work as open launch concerns.
- Final legal copy, hosted Shopify checkout evidence, live Customer Account OAuth, protected customer data, B2B pricing, production analytics IDs, and Search Console access remain owner-gated.

## Mandatory Release Gates

The public cutover cannot start until every item below is either passed or has a dated, explicit owner decision describing the accepted limitation and customer impact.

| Gate                   | Required outcome                                                                                                                                                     | Evidence owner          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Release candidate      | Working tree is intentionally clean; candidate commit and Vercel deployment IDs are recorded                                                                         | Engineering             |
| Storefront completion  | Keyboard UAT passes; collection and product server-rendering implementation, tests, and verification pass                                                            | Engineering/UAT         |
| Regression suite       | Lint, typecheck, unit, integration, contracts, stories, production E2E, build, and final readiness audit pass on the candidate commit                                | Engineering             |
| Checkout revenue path  | Owner-approved hosted checkout test proves cart handoff, shipping, tax, payment, order creation, and success redirect in an approved store boundary                  | Store owner/Engineering |
| Migration redirects    | Authoritative old-to-new URL export is reconciled; every confirmed redirect is one hop to a 200 canonical target; unresolved rows have written owner/SEO disposition | SEO/Engineering         |
| Content integrity      | FAQ placeholders and mismatched `FAQPage` data are replaced with approved copy, or FAQ structured data is removed until the copy is approved                         | Content owner/SEO       |
| Legal and consent      | Policy copy and consent wording are approved, or the owner explicitly accepts the documented pending-copy state                                                      | Owner/Legal             |
| Production environment | Shopify, Sanity, email, rate limiting, health, Sentry, webhook, site URL, and release settings are verified without exposing secrets                                 | Engineering             |
| Indexing posture       | Preview remains `DISABLE_INDEXING=true`; public launch deployment is intentionally `DISABLE_INDEXING=false`; canonical host is `https://www.teavision.com.au`        | Engineering/SEO         |
| Rollback rehearsal     | Last-known-good Shopify path and Vercel rollback procedure are timed and verified; DNS ownership and TTL are known                                                   | Engineering/Store owner |
| Operational coverage   | Named launch commander, store owner, SEO verifier, and rollback authority are available for the launch window                                                        | Project owner           |

Search Console submission is a launch-day/post-cutover action rather than a pre-cutover blocker. Live Customer Account and B2B pricing may be deferred only if their public entry points can be safely disabled or the owner explicitly accepts the limitation before launch.

## Candidate Verification Commands

Run these on the frozen candidate commit with the approved launch-like environment:

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:integration
pnpm test:contracts
pnpm test:stories
pnpm test:e2e:production
pnpm build
pnpm audit:readiness
```

Also run the disabled and enabled SEO lifecycles, redirect evidence, production security probe, and three representative performance runs for `/`, a collection, and a product. Save the command output or report links with the candidate deployment ID.

The automated E2E suite uses fake providers. It does not replace owner-approved hosted checkout, live OAuth, protected-data, B2B, payment, tax, order, or Search Console evidence.

## Rollout Stages

### Stage 0 - Freeze and Baseline

**Audience:** Engineering only  
**Duration:** One business day after storefront readiness work is complete  
**Public traffic:** 0%

Actions:

- Freeze one candidate commit and Vercel deployment.
- Record the current Shopify baseline for sessions, revenue per session, add-to-cart rate, checkout-start rate, conversion, lead submissions, 404 rate, and representative route performance.
- Capture the redirect input and expected production route inventory.
- Confirm the old Shopify theme remains publishable for 30 days.
- Confirm the public-domain, DNS, Vercel, Shopify, Sanity, Sentry, analytics, and Search Console owners.
- Run the complete candidate verification matrix.

Promotion gate:

- All mandatory code/content gates pass.
- No unresolved critical or high-severity regression exists.
- Baseline dashboard and rollback owner are available.

Rollback:

- No customer rollback is required; reject the candidate and prepare a new deployment.

### Stage 1 - Internal Preview Cohort

**Audience:** Engineering, store owner, content owner  
**Duration:** At least four focused hours  
**Public traffic:** 0%; noindex preview only

Actions:

- Test the deployed candidate using production-like Shopify and Sanity data.
- Verify home, collections, PDP, search, cart, account bridge, legal pages, contact/wholesale/NPD forms, consent, and `/api/health`.
- Verify Sanity publish/revalidation and Draft Mode without leaving test content behind.
- Verify cart behavior across refresh, multiple tabs, quantity changes, unavailable products, and session expiry.
- Run real hosted checkout only after the store owner approves the store, products, payment method, and side-effect controls.
- Confirm logs and analytics contain no customer PII, tokens, checkout URLs, or submitted message bodies.

Promotion gate:

- No critical route, cart, checkout-handoff, content, security, consent, or provider defect.
- Hosted checkout evidence is complete or the owner has made an explicit no-launch/defer decision.
- Sentry and Vercel show no unexplained release-correlated errors.

Rollback:

- Keep the public site on Shopify, remove preview access if needed, and fix forward on a new candidate.

### Stage 2 - Owner and SEO Preview Cohort

**Audience:** Store owner, SEO partner, legal/content reviewer, nominated UAT users  
**Duration:** One business day  
**Public traffic:** 0%; noindex preview only

Actions:

- Review representative product, collection, blog, FAQ, policy, lead, cart, and account routes.
- Deliver the protected URL inventory during an approved secret-rotation window, then disable the export and rotate/remove its secret.
- Reconcile the redirect map and confirm `/blog` canonical behavior.
- Validate title, description, canonical, robots, sitemap, structured data, headings, and initial server HTML.
- Approve legal/consent copy and production analytics destinations.
- Rehearse the cutover checklist and Vercel rollback with named operators.

Promotion gate:

- Owner, engineering, SEO, and legal/content reviewers record go decisions.
- Every migration URL row is implemented, explicitly retained, or accepted as a known risk.
- No preview-only hostname, noindex directive, test analytics ID, or test content can leak into the launch deployment.

Rollback:

- Keep Shopify public and return the candidate to Stage 0.

### Stage 3 - Conditional Percentage Canary

**Use only if session-sticky traffic splitting is implemented and rehearsed.** Otherwise skip this stage and use Stage 4's controlled cutover.

| Step | New storefront traffic | Minimum observation | Promotion condition                                                     |
| ---- | ---------------------: | ------------------- | ----------------------------------------------------------------------- |
| 3A   |                     1% | 4 hours             | No critical errors; cart/checkout and SEO probes pass                   |
| 3B   |                    10% | 24-48 hours         | Business and technical metrics remain within thresholds                 |
| 3C   |                    50% | 24 hours            | No cohort-specific conversion, SEO, provider, or performance regression |
| 3D   |                   100% | 7-day watch         | Full cutover checks pass and rollback remains available                 |

Canary prerequisites:

- Stable session assignment across all routes and assets.
- Cart and consent cookies behave consistently across old and new cohorts.
- Analytics records the served release/cohort without collecting PII.
- Search crawlers receive one intentional canonical experience; the canary must not create cloaking or conflicting indexable variants.
- A tested kill switch sends all traffic to the last known good storefront.

### Stage 4 - Controlled Public Cutover

**Audience:** All users  
**Duration:** Four-hour launch watch, then seven-day hypercare  
**Public traffic:** 100%

Use this as the recommended path while no traffic splitter exists.

Before the domain change:

- Freeze content changes and non-launch deploys.
- Confirm the candidate release SHA and environment matrix.
- Confirm `SITE_URL=https://www.teavision.com.au` and `DISABLE_INDEXING=false` on the exact launch deployment.
- Confirm the authoritative redirects are deployed.
- Confirm Shopify primary-domain/alternate-domain behavior and the DNS rollback procedure.
- Open the monitoring dashboard and incident channel.

Immediately after cutover:

1. Confirm HTTPS and apex-to-www behavior on the homepage and deep routes.
2. Confirm `/api/health` returns 200 and identifies the intended release.
3. Smoke home, collection, PDP, search, cart, account, legal, lead, and blog routes on desktop and mobile.
4. Complete one owner-approved cart-to-checkout path; do not create an order unless the approved test plan calls for it.
5. Run enabled SEO, redirects, security headers, sitemap, robots, canonical, structured-data, and 404 checks against `www`.
6. Verify Sanity revalidation and one reversible content publish.
7. Verify consent-denied blocks optional destinations and consent-granted enables only approved analytics.
8. Submit the production sitemap and inspect representative URLs in Search Console when owner access is available.
9. Record all evidence with timestamps, release/deployment IDs, and verifier names.

Promotion gate:

- Four hours without a rollback condition.
- Store owner and launch commander approve the transition to hypercare.

### Stage 5 - Feature Enablement and Hypercare

**Duration:** Days 1-7

Keep launch scope narrow, then enable optional features independently:

| Window        | Capability                                                                                  | Default posture                                                                  |
| ------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Cutover       | Core catalog, collection, PDP, search, cart, checkout handoff, content, lead forms, consent | Enabled and monitored                                                            |
| Cutover       | GA4                                                                                         | Enable only with owner-approved public ID and consent verification               |
| Day 1-2       | Customer Account OAuth and protected account data                                           | Enable/retain only after live owner-approved proof                               |
| Day 2-3       | GTM, Meta, Klaviyo, Shopify pixels                                                          | Off until owner approval, consent-copy approval, CSP proof, and event validation |
| Day 2-3       | B2B/customer-specific pricing claims                                                        | Do not promote until company-location pricing parity is proven                   |
| After handoff | Protected SEO URL export                                                                    | Disabled; secret rotated or removed                                              |

Daily for seven days:

- Review Sentry, Vercel runtime/deploy logs, `/api/health`, checkout handoff, buyer-identity sync, provider failures, lead delivery, and webhook rejection events.
- Compare revenue per session, add-to-cart, checkout-start, conversion, and lead-submit rates with the matched Shopify baseline.
- Review 404s, redirect misses, canonical/robots/sitemap drift, crawler errors, and Search Console coverage.
- Review field performance when available; use lab runs as diagnostics, not a substitute for real-user data.
- Record decisions and incidents in the launch evidence logs.

### Stage 6 - Stabilize and Retire Rollback

**Duration:** Days 8-30

- Close launch incidents and assign remaining SEO/performance improvements to a post-launch milestone.
- Review redirect and 404 evidence with the SEO partner.
- Confirm Search Console discovery and indexing trends.
- Confirm final analytics, legal, account, B2B, and checkout evidence.
- Keep the old Shopify theme and rollback instructions intact for 30 days.
- Retire the old path only after the owner approves the 30-day review and all critical evidence is retained.

## Promotion and Rollback Thresholds

Lock numeric thresholds against the current Shopify baseline before Stage 1. Until then, use these draft defaults.

### Immediate rollback

- `/api/health` or launch-critical routes fail for more than five minutes after one retry.
- Cart mutation or checkout handoff is broadly unavailable, corrupts line data, or sends users to an invalid checkout.
- Production emits `noindex`, an empty sitemap, a wrong canonical host, or broken high-value redirects after cutover.
- A security, privacy, consent, credential, or customer-data exposure is detected.
- Server 5xx responses exceed 1% for ten minutes and are release-correlated.
- Revenue per session is more than 5% below the matched baseline and does not recover within four hours.
- The launch deployment causes a sustained critical Shopify, Sanity, email, account, or webhook failure with no safe feature-level mitigation.

### Hold at the current stage

- Add-to-cart, checkout-start, conversion, or lead-submit rate is more than 10% below the matched baseline but the hard rollback threshold has not been met.
- 404 or redirect-miss rate materially increases.
- Representative LCP degrades more than 20% from the frozen candidate baseline, or new CLS exceeds 0.1.
- Error rate, provider latency, account failures, or customer support contacts trend upward without a confirmed cause.
- Required owner/SEO/legal evidence is incomplete.

### Rollback sequence

1. Stop promotion and announce the incident owner.
2. Disable newly enabled optional analytics/providers through their reversible gates where that contains the issue.
3. Use Vercel instant rollback for a release regression, or restore the last known good Shopify domain/DNS path for a platform cutover failure.
4. Confirm `/api/health`, home, collection, PDP, search, cart, account, policy, and checkout handoff on the restored path.
5. Restore the correct canonical/indexing posture for whichever storefront is public. Do not leave the public site accidentally noindexed.
6. Record the deployment IDs, timestamps, reason, customer impact, evidence, and next owner.
7. Re-enter at Stage 0 with a new candidate.

Because the two storefronts may not share browser cart/session state, explicitly test and document the customer effect of rollback before launch. A rollback may preserve Shopify catalog availability while still abandoning in-progress headless carts.

## Roles

| Role                   | Responsibility                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------ |
| Launch commander       | Final go/hold/rollback decision and incident coordination                            |
| Engineering operator   | Candidate verification, deploy, health, logs, rollback, environment gates            |
| Store owner            | Hosted checkout/order approval, revenue review, Shopify/admin decisions              |
| SEO verifier           | Redirect map, canonicals, robots, sitemap, Search Console, post-cutover crawl review |
| Legal/content approver | Policy, consent, FAQ, and launch-content approval                                    |
| Support observer       | Customer-reported cart, checkout, account, search, and lead-flow issues              |

Names, phone/backup contact, and launch-window availability must be filled in before Stage 1.

## Required Evidence Record

For each promotion decision, record:

- candidate commit, Vercel deployment ID, and release value;
- start/end time, traffic/cohort, environment, and operators;
- automated command results and report links;
- business, error, performance, provider, and SEO metrics;
- checkout/account/analytics/Search Console owner evidence or explicit deferral;
- go, hold, or rollback decision with approver;
- rollback deployment/domain and validation result when used.

Use the existing evidence locations:

- `docs/launch/final-production-readiness-report.md`
- `docs/launch/operations-runbook.md`
- `docs/launch/analytics-and-indexing-runbook.md`
- `docs/launch/seo-route-evidence.md`
- `docs/launch/seo-url-parity-register.md`
- `docs/testing/cart-checkout-uat.md`
- `docs/testing/customer-accounts-setup.md`

## First Decision Needed

Before scheduling the launch window, choose one rollout topology:

- **Recommended now:** preview cohorts followed by a controlled 100% cutover with tested instant rollback.
- **Optional:** build and rehearse session-sticky traffic splitting, then use the 1% -> 10% -> 50% -> 100% ramp.

The percentage ramp should not be placed on the launch calendar until its routing, cookie, cart, analytics, crawler, and kill-switch behavior has its own verified implementation plan.
