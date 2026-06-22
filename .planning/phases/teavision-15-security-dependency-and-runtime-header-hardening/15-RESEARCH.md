# Phase 15: Security, Dependency, and Runtime Header Hardening - Research

**Researched:** 2026-06-22
**Status:** Ready for planning
**Confidence:** High

## Objective

Research what is needed to plan Phase 15 well: dependency audit remediation, production headers and report-only CSP, Customer Account OAuth-start behavior, and explicit public abuse-control posture for `SEC-01` through `SEC-05`.

## Required Reading Completed

- `.planning/ROADMAP.md` Phase 15 section
- `.planning/REQUIREMENTS.md` `SEC-01` through `SEC-05`
- `.planning/STATE.md`
- `.planning/PROJECT.md`
- `.planning/research/SUMMARY.md`
- `.planning/phases/teavision-15-security-dependency-and-runtime-header-hardening/15-CONTEXT.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md`
- `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`
- `docs/testing/customer-accounts-setup.md`
- `docs/conventions.md`

## Current Audit Evidence

Command run during planning research:

```bash
pnpm audit --audit-level moderate
```

Current result:

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 16 |
| Moderate | 18 |
| Low | 10 |
| Total | 45 |

Notable direct and transitive findings:

| Package | Severity | Current Path | Patched Target Observed |
|---------|----------|--------------|-------------------------|
| `next` | high/moderate | direct runtime dependency, also through `next-sanity` and Storybook | `>=16.2.6`; registry latest observed `16.2.9` |
| `shell-quote` | critical | `@graphql-codegen/cli` dev dependency path | `1.8.4` |
| `vite` | high/moderate | Sanity CLI and Storybook/Vitest tooling paths | `7.3.5` for v7, `8.0.16` for v8 |
| `undici` | high/moderate | Sanity CLI/jsdom/actions tooling paths | `6.27.0` for v6, registry latest observed `8.5.0` |
| `ws` | high/moderate | Sanity, jsdom, Storybook, Lighthouse tooling paths | `8.21.0` and `7.5.11` |
| `form-data` | high | Sanity CLI tooling path | `4.0.6` |
| `postcss` | moderate | Next dependency path | `8.5.10+`; registry latest observed `8.5.15` |
| `dompurify` | moderate | `next-sanity`/Sanity tooling path | `3.4.11` |
| `brace-expansion` | moderate | Sanity CLI tooling path | `5.0.6` |
| `tar` | moderate | Sanity CLI tooling path | `7.5.16` |
| `@opentelemetry/core` | moderate | Lighthouse -> Sentry dev tooling path | `2.8.0` |
| `uuid` | moderate | Sanity paths | `11.1.1+`; registry latest observed `14.0.1` |

Registry versions observed during research:

- `next@16.2.9`, `eslint-config-next@16.2.9`
- `next-sanity@13.1.1`
- `@storybook/nextjs-vite@10.4.6` and `storybook@10.4.6`
- `@graphql-codegen/cli@7.1.3`
- `lighthouse@13.4.0`
- `shell-quote@1.8.4`
- `vite@8.0.16`
- `ws@8.21.0`
- `form-data@4.0.6`
- `dompurify@3.4.11`
- `brace-expansion@5.0.6`
- `tar@7.5.16`
- `postcss@8.5.15`

Planning implication: resolve all critical/high advisories first. Residual moderate findings can only remain if the implementation evidence proves they are dev-only/tooling-only and have no runtime exposure.

## Next.js Header and CSP Findings

The local Next.js 16 headers guide says `next.config.ts` can export an async `headers()` function whose rules are checked before filesystem routes and static files. Header rules can target `/:path*`, and later matching rules override earlier rules for the same header key.

The local CSP guide gives two viable approaches:

1. Nonce CSP through Proxy, which requires dynamic rendering for pages that need the nonce. The guide explicitly warns this disables static optimization/ISR and is incompatible with Partial Prerendering because static shells cannot receive per-request nonces.
2. Static CSP in `next.config.ts`, with inline allowances where needed, preserving static rendering and CDN compatibility.

Phase 15 context chooses static report-only CSP first. That matches the project because:

- `cacheComponents: true` is enabled in `next.config.ts`.
- The roadmap warns to avoid nonce CSP unless the plan explicitly accepts dynamic-rendering/PPR trade-offs.
- Phase 16 will add analytics/consent destinations later, so Phase 15 must not pre-allow GA4, GTM, Meta, Klaviyo, or Shopify pixels.

Recommended initial header set:

| Header | Value / Policy |
|--------|----------------|
| `poweredByHeader` | `false` in `next.config.ts` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` for production responses |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` |
| `X-Frame-Options` | `SAMEORIGIN` as compatibility defense while CSP has `frame-ancestors 'self'` |
| `Content-Security-Policy-Report-Only` | Static explicit allowlist, no speculative analytics hosts |

Recommended report-only CSP directives:

```text
default-src 'self';
base-uri 'self';
object-src 'none';
frame-ancestors 'self';
form-action 'self';
script-src 'self' 'unsafe-inline' https://searchserverapi.com;
style-src 'self' 'unsafe-inline';
img-src 'self' blob: data: https://cdn.shopify.com https://www.teavision.com.au https://cdn.sanity.io https://searchserverapi.com https://searchserverapi1.com;
font-src 'self' data:;
connect-src 'self' https://searchserverapi1.com https://api.trustoo.io https://*.myshopify.com https://*.shopify.com;
frame-src 'self' https://maps.google.com;
media-src 'self';
manifest-src 'self';
upgrade-insecure-requests;
```

The exact source list should be implemented as named arrays in a testable helper, not as an untested template literal in `next.config.ts`.

## Current Third-Party Host Inventory

Observed current browser/server integration hosts:

- Shopify Storefront API: `https://{SHOPIFY_STORE_DOMAIN}/api/2026-04/graphql.json`
- Shopify image CDN: `https://cdn.shopify.com`
- Legacy Teavision CDN paths: `https://www.teavision.com.au/cdn/shop/**`
- Sanity images: `https://cdn.sanity.io/images/**`
- Searchanise API search: `https://searchserverapi1.com/getresults`
- Searchanise widget loader: `https://searchserverapi.com/widgets/shopify/init.js`
- Trustoo ratings API: `https://api.trustoo.io/api/v1/reviews/get_products_rating`
- Contact map iframe: `https://maps.google.com/maps?...&output=embed`
- Social/direction external links are navigations, not CSP fetch/script requirements.

## Customer Account OAuth Findings

Current account login-start route:

- `src/app/(storefront)/account/login/start/route.ts` canonicalizes `localhost`/forwarded-origin starts to the configured Customer Account redirect origin before setting pending auth state.
- Existing tests prove PKCE S256, pending auth cookie, and localhost-to-configured-origin canonical redirect.
- Callback/logout tests already prove configured-origin fallback behavior and fake Customer Account route behavior.

Current direct OAuth-start links:

- `src/app/(storefront)/account/_components/login-panel/login-panel.tsx` renders `Button href={loginHref}`, where `loginHref` is `/account/login/start?...`.
- `src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.tsx` renders `Button href={primaryHref}`, where legacy account routes resolve to `/account/login/start?...`.

Because `Button` passes `LinkProps` through to `next/link`, those call sites can use `prefetch={false}` without changing the shared abstraction. Header/footer links point to `/account`, not directly to `/account/login/start`, so normal internal account navigation can stay prefetched.

## Abuse-Control Findings

Current shared boundary:

- `src/lib/rate-limit/index.ts` exposes `RateLimitStore` and `checkRateLimit()`.
- Public contact, wholesale, custom blend, NPD order, newsletter, and `/api/search/suggestions` surfaces use `checkRateLimit()`.
- `src/lib/env/server.ts` currently warns in production when neither `RATE_LIMIT_EXTERNAL_PROTECTION=true` nor `RATE_LIMIT_ALLOW_MEMORY_FALLBACK=true` is set.
- `docs/conventions.md` documents provider-level or durable-store protection and explicit memory fallback.

Gaps against Phase 15 decisions:

- Production currently warns instead of failing closed.
- Trusted client IP source is not explicit. `getClientIpFromHeaders()` currently reads `x-forwarded-for`, then `x-real-ip`, then `cf-connecting-ip`.
- Raw provider errors are logged in some form send paths. Phase 15 should replace touched form/search error logging with structured, redacted events that do not include request bodies, submitted form values, credentials, or provider payloads.

Recommended posture:

- Keep the memory store for local/test development.
- In production, block app-level public form/search usage unless one of these is explicit:
  - `RATE_LIMIT_EXTERNAL_PROTECTION=true`
  - `RATE_LIMIT_ALLOW_MEMORY_FALLBACK=true`
- Add explicit trusted header configuration, for example `RATE_LIMIT_TRUSTED_IP_HEADER=x-forwarded-for`, with an allowlist of `x-forwarded-for`, `x-real-ip`, and `cf-connecting-ip`.
- Preserve user-safe error copy when blocked by configuration.

## Validation Architecture

Existing test infrastructure:

- Unit/integration: Vitest via `pnpm test:unit` and `pnpm test:integration`
- Contract tests: Node test runner via `pnpm test:contracts`
- Fake-Shopify browser coverage: Playwright via `pnpm test:e2e`
- Build/lint: `pnpm lint`, `pnpm typecheck`, `pnpm build`

Phase 15 validation should add:

- A dependency audit evidence command that parses `pnpm audit --audit-level moderate --json` and fails if any critical/high remains.
- Header/CSP unit tests for the policy builder.
- Contract tests that assert `next.config.ts` exports `poweredByHeader: false` and includes the required header names.
- Integration tests for account login-start links or component tests/stories proving `prefetch={false}` reaches the rendered direct OAuth-start anchors.
- Integration/unit tests for rate-limit fail-closed production posture and trusted header selection.
- A production response probe script that checks representative routes for headers and absence of `x-powered-by`.

Representative route set for production response probes:

- `/`
- `/products/test-standard-tea` or another fake/local product handle
- `/collections/all`
- `/cart`
- `/account`
- `/account/login`
- `/pages/contact`
- `/api/search/suggestions?q=tea`

The final evidence must distinguish automated fake/local proof from owner-gated live Shopify OAuth/checkout proof.

## Key Risks

| Risk | Mitigation |
|------|------------|
| Dependency overrides break tooling or peer expectations | Prefer direct parent upgrades first, then targeted overrides. Verify `pnpm install`, audit, lint, typecheck, build, and targeted tests. |
| Static CSP breaks Searchanise, Trustoo, maps, Shopify images, or Sanity images | Stage as `Content-Security-Policy-Report-Only`, implement allowlists from current observed hosts, and run browser/response smoke checks. |
| Nonce CSP accidentally disables static/PPR behavior | Do not implement nonce CSP in Phase 15. Keep policy static unless a future phase explicitly accepts the trade-off. |
| Fake/local Customer Account evidence is mistaken for live Shopify signoff | Keep live OAuth owner-gated in docs and final evidence. Automated tests must state they cover local/fake behavior only. |
| Rate limit fail-closed behavior blocks local development | Restrict fail-closed posture to production runtime; keep local/test behavior deterministic. |

## Recommended Plan Shape

1. Dependency audit remediation and evidence.
2. Security headers and report-only CSP helper/tests.
3. Customer Account OAuth-start prefetch hardening and origin proof.
4. Abuse-control fail-closed posture and redacted logs.
5. Final production-response probes and Phase 15 evidence report.

## RESEARCH COMPLETE

