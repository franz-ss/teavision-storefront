---
phase: 11
slug: full-visual-redesign
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-11
---

# Phase 11 - Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| build -> Google Fonts | Fonts load through `next/font/google` during build and are emitted as self-hosted assets. | Public font files; no runtime browser call to Google Fonts. |
| repo script -> filesystem | One-off design asset extraction reads the redesign mockup and writes PNG motifs. | Local design asset bytes into `public/images/`. |
| user -> newsletter/contact forms | Restyled forms submit untrusted input to existing Server Actions. | Email/contact fields plus honeypot value. |
| user -> search input | Header and search-page query text flows to Searchanise suggestion/search APIs. | User query string and filter params. |
| user -> cart mutations | Product, collection, and cart quantity actions call Shopify cart mutations through Server Actions. | Variant IDs, line IDs, quantities, cart cookie ID. |
| Shopify/Sanity CMS -> rendered HTML | Merchant/CMS rich content is rendered in page, article, and product surfaces. | HTML transformed by sanitizer and typed renderers. |
| Shopify -> storefront display | Shopify product, tag, discount, and checkout data are rendered as text, links, or structured data. | Merchant-managed product metadata and cart pricing data. |
| none new | Several packages were presentational restyles or docs/tests only. | No new network, auth, file, or schema boundary. |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation / Verification | Status |
|-----------|----------|-----------|-------------|---------------------------|--------|
| T-11-01 | Tampering (supply chain) | font loading | mitigate | `src/app/layout.tsx` imports `Spectral`, `Hanken_Grotesk`, `Space_Mono`, and `Caveat` from `next/font/google`; `rg "fonts.googleapis.com|fonts.gstatic.com" src public scripts` found no runtime references. | closed |
| T-11-02 | Information Disclosure | design tokens in CSS | accept | Styling tokens in `src/app/globals.css` are public presentation values only; accepted as non-sensitive. | closed |
| T-11-03 | Tampering | `extract-redesign-assets.mjs` | mitigate | Script writes to fixed `public/images/${id}.png` paths; `stamp-ring.png`, `illo-cup.png`, `illo-teapot.png`, and `illo-handshake.png` all have PNG magic bytes. | closed |
| T-11-04 | Tampering | `button-system.test.mjs` | mitigate | `scripts/component-contracts/button-system.test.mjs` retains assertions for button size, variants, and motion-reduce contracts. | closed |
| T-11-05 | Denial of Service (a11y regression) | Button sizes | mitigate | `src/components/ui/button/button.tsx` keeps `min-h-11` for small/default/mockup sizes and `min-h-12` for large/CTA sizes; contracts assert the small size. | closed |
| T-11-06 | Tampering/DoS | newsletter-signup | mitigate | Newsletter UI still posts `website` honeypot fields; `src/lib/contact/actions.ts` checks honeypot and calls `checkRateLimit()`. | closed |
| T-11-07 | Elevation (XSS) | rich-text | mitigate | `RichText` accepts `SanitizedHtml`; Shopify HTML is sanitized in `src/lib/shopify/html-content.ts` with allowlists, scheme limits, and transform tags before `dangerouslySetInnerHTML`. | closed |
| T-11-08 | Tampering | search autocomplete | mitigate | Header autocomplete keeps `AbortController`, debounce timeout, `URLSearchParams`, and array checks; Searchanise mapping narrows `unknown` via typed guards. | closed |
| T-11-09 | Spoofing (phishing-adjacent) | utility-bar links | mitigate | Header utility links are hardcoded to `/pages/wholesale` and `tel:1300729617`; no user-controlled URL is used. | closed |
| T-11-10 | Elevation (XSS) | mega feature card imagery | mitigate | Header feature imagery uses `next/image` and data arrays; no `dangerouslySetInnerHTML` was found in header mega-panel components. | closed |
| T-11-11 | Tampering/DoS | footer newsletter form | mitigate | Footer newsletter form keeps the `website` honeypot and submits through the existing newsletter Server Action boundary. | closed |
| T-11-12 | Information Disclosure | error pages | mitigate | `src/app/error.tsx`, `global-error.tsx`, and cart error page log errors to console but render generic copy without stack or raw error message output. | closed |
| T-11-13 | DoS (a11y/motion regression) | certs marquee, hover reveals | mitigate | Homepage marquee and hover-reveal components retain `motion-reduce:animate-none`, `motion-reduce:transition-none`, and scale-reset classes; contract tests assert the motion-reduce trio. | closed |
| T-11-14 | Elevation (XSS) | mockup markup porting | mitigate | Homepage motif ports use static JSX, `next/image`, and inline SVG text paths; no homepage HTML injection path was introduced beyond serialized JSON-LD. | closed |
| T-11-15 | Tampering/DoS | homepage newsletter + contact forms | mitigate | Homepage passes `submitNewsletterSignupFormAction` and `submitContactFormAction` to existing form components; both action paths retain honeypot and rate-limit checks. | closed |
| T-11-16 | Elevation (XSS) | Stamp SVG port | mitigate | `src/components/homepage/stamp/stamp.tsx` uses static JSX SVG/textPath and `next/image`; no `dangerouslySetInnerHTML`. | closed |
| T-11-17 | DoS (motion/a11y) | float animations, FAQ rotate | mitigate | Homepage decorative animations and FAQ row transitions include reduced-motion guards such as `motion-reduce:animate-none` and `motion-reduce:transition-none`. | closed |
| T-11-18 | Tampering | quick-add path | mitigate | Collection cards and product purchase form still call `useAddToCart`, which delegates to `addToCartAction`; no new mutation surface was added. | closed |
| T-11-19 | Denial of Service | PLP payload | mitigate | Collection GraphQL keeps bounded variables (`$first`, `$after`) and `variants(first: 20)`; collection product list renders bounded fetched products. | closed |
| T-11-20 | Tampering | tag-derived badges | accept | Shopify product tags are first-party merchant data rendered as React text-derived badge state, with no HTML injection vector. | closed |
| T-11-21 | Tampering | Searchanise response handling | mitigate | `src/lib/searchanise/search.ts` parses responses from `unknown` with `isRecord`, `Array.isArray`, typed filters, and sanitized text extraction. | closed |
| T-11-22 | Information Disclosure | query echo in heading | mitigate | Search query text is rendered as React text in metadata and `SearchHero`; no `dangerouslySetInnerHTML` is used for query echo. | closed |
| T-11-23 | Tampering | buy row / quantity | mitigate | Product form uses `useAddToCart`; `src/lib/cart/actions.ts` normalizes quantity with finite-number checks, truncation, and minimum quantity enforcement before Shopify mutation. | closed |
| T-11-24 | Elevation (XSS) | JSON-LD / product HTML | mitigate | JSON-LD uses `serializeInlineJson()` with `<` escaping; product/page HTML stays behind `sanitizeShopifyHtml()` and `RichText` typed `SanitizedHtml`. | closed |
| T-11-25 | Repudiation | preserved unstaged edits | mitigate | Phase summaries document working-tree preservation and deviations; current secure-phase run observed unrelated local edits and did not revert them. | closed |
| T-11-26 | Tampering | cart mutations | mitigate | Cart quantity/remove paths call Server Actions using the `teavision_cart` cookie and Shopify operations; cart UI files do not bypass those actions. | closed |
| T-11-27 | Repudiation | discount display | mitigate | Cart GraphQL fetches `discountAllocations`; cart operations reshape Shopify-reported titles/amounts, and cart view renders those allocations rather than client-side discount authority. | closed |
| T-11-28 | Elevation (XSS) | `html-content.ts` | mitigate | Sanitizer configuration remains explicit: allowed attributes/classes/schemes/tags, HTTPS-only image schemes, protocol-relative URLs disabled, and disallowed tags discarded. | closed |
| T-11-29 | Tampering | portable-text renderers | mitigate | Portable text and rich content remain renderer/class-map code paths; summary confirms class-map restyle only, with sanitizer plumbing unchanged. | closed |
| T-11-30 | Tampering/DoS | wholesale + contact forms | mitigate | Contact surfaces reuse `ContactSection`/`ContactSectionForm` with `submitContactFormAction`; `src/lib/contact/actions.ts` keeps validation, honeypot, rate limit, and no form-value logging. | closed |
| T-11-31 | Elevation (XSS) | `[...slug]` page bodies | mitigate | Storefront page bodies render via sanitized Shopify HTML pipeline and JSON-LD serialization, not raw CMS HTML. | closed |
| T-11-32 | DoS (build break) | old-token deletion | mitigate | Phase 11 summaries record lint/typecheck/build/test gates; old token checks were run after deletion work, and the final plan reports `pnpm build` clean. | closed |
| T-11-33 | Tampering | eslint guard-rule edit | mitigate | `scripts/eslint-rules/no-section-root-tone-class.mjs`, `no-raw-section` tests, docs, and component contracts preserve Section.Root tone guard coverage. | closed |

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-11-01 | T-11-02 | Design tokens are public CSS presentation values and do not expose credentials, customer data, or private business logic. | Phase 11 plan-time threat model; verified by Codex secure-phase | 2026-06-11 |
| AR-11-02 | T-11-20 | Product tags are first-party merchant-controlled Shopify metadata rendered as React text-derived badge state, not executable markup. | Phase 11 plan-time threat model; verified by Codex secure-phase | 2026-06-11 |

---

## Security Audit 2026-06-11

| Metric | Count |
|--------|-------|
| Threats found | 33 |
| Closed | 33 |
| Open | 0 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-11 | 33 | 33 | 0 | Codex secure-phase |

---

## Summary Threat Flags

Phase summaries reported no new security-relevant surface beyond the plan-time threat model. Later visual/UAT packages reported no new network endpoints, auth paths, file access boundaries, schema changes, or trust-boundary expansions. Noted pre-existing build/story failures in summaries were either resolved by later packages or documented as unrelated to security mitigations.

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-11
