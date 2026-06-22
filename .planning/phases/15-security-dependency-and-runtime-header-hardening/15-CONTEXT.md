# Phase 15: Security, Dependency, and Runtime Header Hardening - Context

**Gathered:** 2026-06-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 15 removes security launch blockers before the rest of v1.4 adds legal, analytics, operations, performance, and final-audit coverage. It owns dependency audit remediation, production response headers, staged CSP, Customer Account OAuth-start launch behavior, and explicit public abuse-control posture for current form/search surfaces.

This phase clarifies and implements `SEC-01` through `SEC-05`. It does not redesign storefront UI, add analytics destinations, create legal/policy routes, build full observability, or run real Shopify hosted checkout/OAuth tests without owner/admin approval.

</domain>

<decisions>
## Implementation Decisions

### Dependency-Audit Policy
- **D-01:** Phase 15 passes dependency readiness when all critical and high audit findings are fixed, overridden, removed, or otherwise eliminated, and only documented dev-only moderate residuals remain with no runtime exposure.
- **D-02:** Use targeted `pnpm.overrides` first for vulnerable transitive dev-tool packages when parent upgrades would create unnecessary churn. Every override must be verified with audit, build, and relevant tests.
- **D-03:** Create a dedicated Phase 15 dependency-audit evidence note with the audit command, before/after counts, patched packages, overrides, and any justified residual moderate findings.
- **D-04:** Avoid generated churn. Do not run `pnpm codegen` or touch generated Shopify types unless a dependency upgrade genuinely requires it.

### Headers and CSP Rollout
- **D-05:** Implement a static CSP in report-only mode first, with explicit allowlists and tests. Enforcement can happen only after smoke evidence proves it does not break required storefront behavior.
- **D-06:** Mandatory header set: production HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame protection through CSP `frame-ancestors` or `X-Frame-Options`, no `x-powered-by`, and staged CSP.
- **D-07:** CSP allowlists should cover only current required hosts for Next, Shopify, Sanity, Searchanise, Trustoo, current assets/images/fonts/connect endpoints, and browser-relevant form endpoints if any. Do not pre-allow GA4, GTM, Meta, Klaviyo, or Shopify pixels in Phase 15; analytics hosts belong to Phase 16.
- **D-08:** Header/CSP verification must use a built local production server and probe representative storefront, product, collection, cart, account, policy/static page, and API routes for expected headers and absence of `x-powered-by`.

### Account OAuth Launch Behavior
- **D-09:** Disable Next prefetch only on direct `/account/login/start` OAuth-start links, using `prefetch={false}` or a plain anchor wrapper. Normal internal `/account` navigation can remain regular Next navigation.
- **D-10:** Phase 15 must prove app-side callback/logout origin behavior through env-derived config checks, canonical localhost-to-configured-origin tests, and Shopify-admin-ready callback/logout URL documentation. It must not require live Shopify admin access.
- **D-11:** Do not run real Shopify Customer Account OAuth without explicit owner/admin approval. Document live OAuth as owner-gated when approval/admin setup is missing, and clearly state what fake/local tests cover.
- **D-12:** Local-production account evidence should cover all account entry and exit edges: header/footer account links, `/account`, `/account/login`, `/account/login/start`, `/account/callback`, `/account/logout`, legacy account bridge routes, and cart buyer-identity checkout handoff.

### Abuse-Control Posture
- **D-13:** Production abuse protection must be explicit and fail closed as a launch posture. Production must either declare provider/external protection, configure an approved durable store, or intentionally set and document memory fallback; implicit in-memory production use is launch-blocking.
- **D-14:** Trusted client identity for rate limits must be documented and tested. The planner should make the trusted proxy/header source explicit and avoid blindly relying on generic forwarded headers in production.
- **D-15:** When Phase 15 touches form/search abuse paths, replace raw provider/error logging with structured, redacted events for those surfaces. Full observability remains Phase 17.
- **D-16:** Abuse-control verification covers the current public mutation/search surfaces: contact, wholesale, custom blend, NPD order, newsletter, and `/api/search/suggestions`. Prove honeypot, validation, rate-limit, and safe error behavior.

### the agent's Discretion
No selected area was delegated to the agent. The planner has implementation discretion only inside the decision boundaries above.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase and Milestone Scope
- `.planning/ROADMAP.md` — Defines Phase 15 goal, success criteria, dependencies, and Next docs that must be read before code changes.
- `.planning/REQUIREMENTS.md` — Defines v1.4 `SEC-01` through `SEC-05` and out-of-scope boundaries.
- `.planning/PROJECT.md` — Captures current v1.4 milestone context, launch gates, prior decisions, and Shopify authority boundaries.
- `.planning/STATE.md` — Captures current project position and known external/admin-dependent launch gates.
- `.planning/research/SUMMARY.md` — Summarizes the 2026-06-22 production-readiness research, audit counts, phase ordering, and major risks.

### Next.js 16 Header and CSP Guidance
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md` — Local Next 16 reference for `next.config.ts` response headers.
- `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md` — Local Next 16 CSP guidance, including nonce/dynamic-rendering trade-offs relevant to Cache Components/PPR.

### Existing Launch and Security Docs
- `docs/testing/customer-accounts-setup.md` — Customer Account credentials, protected-data, OAuth, and live-testing safety guidance.
- `docs/conventions.md` — Project conventions for rate limiting and production fallback configuration.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `next.config.ts` — Central place to add `headers()` and `poweredByHeader: false` while preserving existing redirects, image allowlists, `allowedDevOrigins`, and Cache Components.
- `src/lib/rate-limit/index.ts` — Already exposes a `RateLimitStore` type and `checkRateLimit()` boundary, but currently always uses in-memory buckets.
- `src/lib/env/server.ts` — Owns `RATE_LIMIT_EXTERNAL_PROTECTION` and `RATE_LIMIT_ALLOW_MEMORY_FALLBACK` checks; good fit for fail-closed production posture.
- `src/app/(storefront)/account/login/start/route.ts` — Already canonicalizes localhost/forwarded origins to configured Customer Account redirect origin before setting pending OAuth state.
- `src/components/ui/button/button.tsx` — Central anchor/Next Link abstraction; likely needs an escape hatch or call-site handling for `prefetch={false}` on OAuth-start links.

### Established Patterns
- Shopify credentials and Customer Account OAuth/session material stay server-owned; do not expose tokens or secrets in browser props, Storybook args, logs, screenshots, or client env.
- v1.4 hardening should stay inside existing boundaries: Next config/security helpers, account route tests, rate-limit helpers, contact/search action boundaries, and phase docs/scripts.
- Real Shopify hosted checkout, payment, shipping, tax, order, success redirect, Customer Account OAuth, protected customer data, and B2B pricing tests remain owner-approved launch gates.

### Integration Points
- Dependency remediation will touch `package.json` and `pnpm-lock.yaml`, plus `pnpm.overrides` if needed.
- Header/CSP work should connect to `next.config.ts` and a small `src/lib/security/` helper if policy construction benefits from tests.
- Abuse-control work connects to `src/lib/contact/actions.ts`, `src/app/api/search/suggestions/route.ts`, `src/lib/rate-limit/index.ts`, `src/lib/env/server.ts`, and `.env.example`.
- Account launch evidence connects to `src/app/(storefront)/account/**`, `src/components/layout/header/header.tsx`, `src/components/layout/footer/data.ts`, legacy account bridge components/routes, and cart checkout buyer-identity sync.

</code_context>

<specifics>
## Specific Ideas

- Current `pnpm audit --audit-level moderate` evidence gathered during discussion: 45 vulnerabilities total, including 1 critical, 16 high, 18 moderate, and 10 low.
- Direct runtime blocker observed: `next@16.2.4` has multiple advisories patched in `16.2.5`/`16.2.6`; Phase 15 should target the patched Next 16 line after reading local docs.
- The critical `shell-quote` finding and several high `vite`, `undici`, `ws`, and `form-data` findings appear through dev/tooling paths and should be patched or justified according to D-01 through D-04.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 15 scope.

</deferred>

---

*Phase: 15-Security, Dependency, and Runtime Header Hardening*
*Context gathered: 2026-06-22*
