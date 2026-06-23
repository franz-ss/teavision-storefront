# Phase 17: Operations, Performance, and Final Production-Readiness Audit - Context

**Gathered:** 2026-06-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 17 proves the integrated storefront is operationally ready to launch. It owns safe health/readiness checks, Vercel and Sentry launch monitoring, redacted structured logging at revenue and provider boundaries, performance/UX evidence for launch-critical pages, self-contained local production e2e coverage against fake providers, and the final production-readiness report.

This phase covers `OPS-01`, `OPS-02`, `OPS-03`, `OPS-04`, `PERF-01`, `UX-01`, `QA-01`, `QA-02`, and `QA-03`. It does not run real Shopify hosted checkout, payment, shipping, tax, order creation, success redirect, live Customer Account OAuth, protected customer data, B2B pricing, or Search Console submission checks without explicit owner approval and evidence.

</domain>

<decisions>
## Implementation Decisions

### Monitoring and Launch Ops
- **D-01:** Assume Vercel for production hosting and Sentry-style app error tracking for Phase 17 planning and runbook work.
- **D-02:** Launch readiness should use a lean launch watch: alerts or checks for deploy failure, health failure, checkout handoff errors, account/OAuth errors, provider failures, and elevated server errors, plus a week-one manual monitoring checklist.
- **D-03:** Rollback readiness should be Vercel instant rollback plus reversible env kill switches, including `DISABLE_INDEXING`, analytics mode, CSP/reporting controls, and provider env gates.
- **D-04:** Engineering owns automated evidence, Sentry/Vercel setup, runbook creation, and first response. Store-owner approvals remain explicit gates for Shopify hosted checkout, live OAuth, B2B/customer pricing, protected customer data, and Search Console evidence.

### Health and Safe Diagnostics
- **D-05:** Use a two-tier readiness model: a public safe health/readiness endpoint stays shallow, while deeper provider/config checks run through local scripts or operator evidence.
- **D-06:** The public endpoint should expose only minimal safe status such as status, service name, safe release/build identifier if available, and timestamp. It must not expose env names, provider names, secrets, customer data, raw errors, or diagnostic payloads.
- **D-07:** The deeper readiness probe should fail on launch-critical automated blockers: missing production-required env, Shopify Storefront misconfiguration, Customer Account config mismatch, SEO/indexing mismatch, missing security headers, fake analytics mode accidentally left for launch, and local production e2e failure.
- **D-08:** Owner-gated proof should be represented as approved, pending, or owner-blocked evidence, not as an automated code failure.
- **D-09:** Deeper probes should be config-first with no live writes. They may verify Shopify Storefront reads, Sanity reads, Searchanise suggestion/search reads, Customer Account discovery/config, security/SEO scripts, analytics env gates, and Sentry/Vercel config presence. They must not run mutations, checkout, payment, order creation, email sends, or production writes.

### Redacted Logging Scope
- **D-10:** Structured/redacted logging is mandatory at revenue and provider boundaries: checkout handoff, cart buyer-identity sync, account OAuth/session errors, Shopify/Sanity/Searchanise/Trustoo/HulkApps provider failures, contact/newsletter/NPD/wholesale submissions, webhooks, and route/action failures.
- **D-11:** Logs, Sentry events, and breadcrumbs must use a strict ecommerce privacy redaction set: tokens/secrets, auth cookies, customer names/emails/phones/addresses, order IDs unless owner-approved, cart IDs unless hashed, message bodies, provider raw payloads, analytics IDs tied to a person, and checkout URLs with sensitive params must be redacted or excluded.
- **D-12:** Add a small typed server logging/redaction helper and use it at selected call sites with domain-specific event names and call-site context.
- **D-13:** Expected optional-provider degradations should be warnings. Revenue-critical failures such as checkout, account, cart identity, and provider write failures should be errors. Health/readiness summaries must not include raw provider payloads.

### Performance and Final Audit Proof
- **D-14:** Mandatory launch-critical audit representatives are: home, one PDP with rich media and bulk tiers, `/collections/all`, one high-value collection, `/cart`, `/search`, account login/dashboard fake path, and key legal/static landing pages.
- **D-15:** Performance blocking should use a practical mobile Lighthouse/Web Vitals gate: no launch-blocking LCP regression on home/PDP, target mobile LCP under about 2.5s where local/staging data is reliable, CLS under 0.1, INP/TBT acceptable, and any misses documented with mitigation.
- **D-16:** Local production e2e must run from a controlled production-like Next server lifecycle with fake Shopify and fake Customer Account providers. It must not depend on an already-running dev server and must not touch real hosted checkout.
- **D-17:** The final 100/100 readiness report should use separated score sections: automated code readiness can reach 100/100 when all automated blockers pass, while owner-gated Shopify/OAuth/B2B/Search Console evidence appears in a separate launch-gate table marked approved, pending, or owner-blocked.

### the agent's Discretion
No selected area was delegated to the agent. The planner has implementation discretion only inside the decision boundaries above.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase and Milestone Scope
- `.planning/ROADMAP.md` - Defines Phase 17 goal, dependencies, success criteria, and owner-gated testing notes.
- `.planning/REQUIREMENTS.md` - Defines v1.4 `OPS-01` through `OPS-04`, `PERF-01`, `UX-01`, and `QA-01` through `QA-03`.
- `.planning/PROJECT.md` - Captures v1.4 milestone context, launch gates, Shopify authority boundaries, and out-of-scope limits.
- `.planning/STATE.md` - Captures current project state and known external/admin-dependent launch gates.
- `.planning/research/SUMMARY.md` - Summarizes the 2026-06-22 production-readiness research, including Phase 17 operations, performance, and final-audit risks.
- `.planning/phases/15-security-dependency-and-runtime-header-hardening/15-CONTEXT.md` - Defines inherited security header, CSP, OAuth-start, and abuse-control decisions that Phase 17 must include in final evidence.
- `.planning/phases/16-legal-consent-analytics-and-seo-launch-coverage/16-CONTEXT.md` - Defines inherited legal, consent, analytics, SEO, Search Console, and purchase-tracking gates that Phase 17 must include in final evidence.

### Existing Evidence and Runbooks
- `docs/testing/customer-accounts-setup.md` - Customer Account OAuth, protected data, checkout handoff, live OAuth, B2B pricing, and owner-approval launch gates.
- `docs/testing/cart-checkout-uat.md` - Hosted checkout UAT checklist and explicit prohibition on production checkout/payment/order testing before approval.
- `docs/launch/analytics-and-indexing-runbook.md` - Consent-aware analytics, indexing, Search Console, and owner-gated purchase/order tracking runbook.
- `scripts/security/probe-production-security.mjs` - Existing Phase 15 production header/security probe to reuse in final audit.
- `scripts/seo/probe-launch-seo.mjs` - Existing Phase 16 SEO, route, redirect, noindex, sitemap, and runbook probe to reuse in final audit.

### Current Test and Tooling Surface
- `package.json` - Defines `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, `pnpm test:integration`, `pnpm test:e2e`, `pnpm test:stories`, `pnpm test:contracts`, and `pnpm test:security`.
- `playwright.config.ts` - Current Playwright fake-Shopify e2e setup; Phase 17 must make final e2e production-like rather than dev-server-dependent.
- `tests/mocks/run-fake-shopify-server.ts` - Existing fake Shopify server used for browser e2e coverage.
- `tests/mocks/customer-account-api-server.ts` - Existing fake Customer Account API server used for automated account coverage.
- `tests/e2e/cart-checkout.spec.ts` - Existing fake-Shopify cart-to-checkout browser coverage.
- `tests/e2e/consent.spec.ts` - Existing consent browser coverage from Phase 16.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/security/probe-production-security.mjs` already probes representative routes for required production headers, report-only CSP, and absence of `x-powered-by`.
- `scripts/seo/probe-launch-seo.mjs` already probes robots, sitemap, policy redirects, canonicals, noindex behavior, structured data, and runbook evidence.
- `playwright.config.ts` already starts fake Shopify and a Next app for e2e, but currently uses `next dev`; Phase 17 should adapt this into a production-like server lifecycle for final audit.
- `tests/mocks/run-fake-shopify-server.ts`, `tests/mocks/customer-account-api-server.ts`, and `tests/mocks/third-party-network.ts` provide safe fake-provider and network boundaries for browser evidence.
- `docs/testing/customer-accounts-setup.md`, `docs/testing/cart-checkout-uat.md`, and `docs/launch/analytics-and-indexing-runbook.md` already document owner-gated launch proof that the final report should aggregate rather than duplicate.

### Established Patterns
- Storefront architecture is server-first Next.js 16 App Router. Keep health/readiness route handlers safe and avoid client-exposed secrets or provider diagnostics.
- Shopify remains authoritative for cart, checkout, customer, payment, shipping, tax, order, and B2B pricing behavior. Automated tests must use fake/local boundaries unless owner approval exists.
- Analytics and indexing are env-gated. `DISABLE_INDEXING` and analytics mode must remain reversible launch controls and be covered by the final report.
- Existing test commands are split across unit, integration, e2e, Storybook, contracts, security, lint, typecheck, and build. The final audit should orchestrate these rather than inventing unrelated verification surfaces.
- Sentry is not yet present in `package.json`; Phase 17 planning should account for adding/configuring it or documenting the exact Sentry-equivalent integration if implementation constraints change.

### Integration Points
- Health/readiness likely connects to a safe app route under `src/app/api/**`, env helpers under `src/lib/env/**`, and a new script under `scripts/**` for deeper readiness evidence.
- Observability connects to Sentry setup, Vercel release/deploy metadata, route handlers, Server Actions, checkout/account boundaries, provider clients, and launch runbook docs.
- Redacted logging connects to checkout handoff, cart buyer identity sync, Customer Account OAuth/session code, Shopify/Sanity/Searchanise/Trustoo/HulkApps providers, contact/newsletter/NPD/wholesale submissions, and webhook routes.
- Performance evidence connects to Lighthouse tooling, launch-critical representative URLs, home/PDP LCP remediation, UX/accessibility polish, and final report generation.
- Final audit report connects Phase 15 security probes, Phase 16 SEO/analytics evidence, Phase 17 readiness/performance/e2e evidence, and owner-gated launch-proof tables.

</code_context>

<specifics>
## Specific Ideas

- Public health must be deliberately uninteresting: minimal status, optional safe release/build identifier, and timestamp only.
- Deep readiness should prefer config/read probes and explicit evidence tables over public diagnostics or production writes.
- The final report should make a clean distinction between automated code readiness and owner/admin-controlled launch gates.
- Owner-gated proof should be marked `approved`, `pending`, or `owner-blocked` so the launch decision is honest and auditable.
- The practical performance target is mobile/Lighthouse/Web Vitals risk reduction, not a decorative perfect Lighthouse score.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within Phase 17 scope.

</deferred>

---

*Phase: 17-Operations, Performance, and Final Production-Readiness Audit*
*Context gathered: 2026-06-23*
