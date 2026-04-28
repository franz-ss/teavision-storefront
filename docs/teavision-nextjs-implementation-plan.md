# Teavision Storefront Rebuild
## Next.js Implementation Plan

---

### Executive Summary

This document sets out a six-week plan to rebuild the Teavision storefront on Next.js, using Shopify's Storefront API for product, collection, content, and cart data. All commerce operations — orders, checkout, payments, tax, fulfillment, the Shopify admin, and back-office applications — remain on Shopify and continue to operate as they do today. The scope of this project is limited to the customer-facing storefront.

The plan is structured to deliver measurable improvements in front-end flexibility, design control, and long-term iteration speed, while protecting the organic search traffic the site depends on.

---

### 1. Project Context and Objectives

**Current state.** The storefront passes Google's Core Web Vitals assessment on real-user data, with mobile metrics of LCP 2.0 seconds, INP 95 milliseconds, and CLS 0.03 over the most recent 28-day measurement period. The Lighthouse synthetic test score of 41 indicates available optimisation headroom, but does not reflect the experience of actual visitors.

**Project objectives.**

1. Deliver a modern Next.js storefront that materially improves Lighthouse scores and provides moderate gains in real-user performance metrics.
2. Establish a flexible front-end foundation that supports future design and feature changes without the constraints of the current Liquid theme.
3. Preserve organic search traffic and SEO equity through a structured migration plan that prioritises URL parity, redirect integrity, and structured data continuity.
4. Maintain feature and integration parity with the existing storefront, including reviews, subscriptions, analytics, email capture, and any other customer-facing functionality currently in production.

**Non-objectives.** This project does not include migration of historical commerce data, replacement of the Shopify checkout, introduction of a separate content management system, addition of personalisation or A/B testing infrastructure, or international/multi-currency expansion beyond Shopify's native capabilities. Any of these can be scoped as separate projects following launch.

---

### 2. Pre-Kickoff Requirements

Repository and Shopify admin access are already in place. The following items remain to be resolved before development begins. Each represents a dependency that, if unresolved, will introduce timeline risk.

**Design assets.** Finalised designs for all required templates — product, collection, homepage, cart, account, content pages — across mobile and desktop breakpoints, including component states and edge cases. If designs from prior theme work are partial or need completion, a design phase will be added before development begins.

**Prior engagements.** Closure of any active engagements with previous developers or agencies, including transfer of relevant assets and intellectual property.

**SEO ownership.** Confirmation of who owns SEO for the site and how they will be involved in the redirect plan, URL structure decisions, and post-launch monitoring.

**Storefront API credentials.** A Storefront API access token with appropriate scopes, and an Admin API token where required for privileged server-side reads.

**Hosting.** Selection and provisioning of the production hosting environment. Vercel is recommended for its native Next.js support, edge network, and revalidation infrastructure.

---

### 3. Timeline Overview

| Week | Phase | Primary Deliverable |
|---|---|---|
| 1 | Audit and Foundation Kickoff | Scope finalised, infrastructure provisioned, initial Shopify integration operational |
| 2 | Foundation Completion | Cart, customer authentication, layout, design system primitives |
| 3 | Core Templates | Product detail page, collection page, homepage |
| 4 | Supporting Templates and Integrations | Cart pages, account pages, content pages, third-party integrations, analytics |
| 5 | SEO Implementation and Quality Assurance | Redirects, structured data, sitemap, performance optimisation, testing |
| 6 | Launch | Phased traffic migration with monitoring |

The project is budgeted at six weeks with a one-week contingency. The contingency covers two anticipated risk areas: complexity in third-party application integration and edge cases in the cart-to-checkout flow.

---

### 4. Phase 1 — Audit and Foundation Kickoff (Week 1)

#### 4.1 Site Audit (Days 1–2)

A full audit of the current storefront establishes the baseline for the rebuild. Audit deliverables:

- A complete inventory of all storefront URLs, ranked by traffic and revenue contribution.
- An export of all existing URL redirects from the Shopify admin.
- A documented assessment of installed applications, including integration points and porting requirements.
- A theme code review identifying customisations, embedded scripts, and metafield dependencies that need to be ported.
- An audit of existing SEO implementation, including structured data, metadata patterns, canonical configuration, sitemap structure, and robots directives.
- A review of Lighthouse diagnostic data to identify specific optimisation targets for the new build.

#### 4.2 Foundation Kickoff (Days 3–5)

Foundation work establishes the technical infrastructure all subsequent development depends on:

- A Next.js application using the App Router, configured with TypeScript and Tailwind CSS, deployed to a Vercel preview environment.
- Environment variables for Storefront API access, Admin API access where required for privileged reads, webhook signing, and revalidation.
- The Storefront API client with GraphQL Codegen for end-to-end type safety.
- Foundational queries for products, collections, navigation menus, and cart operations.
- Webhook endpoints for cache revalidation on product and collection updates.
- Error monitoring (Sentry), structured logging, and a health-check endpoint.

**Phase 1 exit criteria.** A product page renders from live Shopify data on the Vercel preview environment. Audit findings are documented and reviewed.

---

### 5. Phase 2 — Foundation Completion (Week 2)

This phase delivers the shared infrastructure that every customer-facing template depends on.

**Cart.** A server-action-based cart system with operations for adding, updating, and removing items, and applying discounts. Shopify remains the authoritative source of cart state, with the cart identifier stored in a secure HTTP-only cookie. Error states for unavailable variants, out-of-stock inventory, and rejected discounts are handled explicitly.

**Customer authentication.** The Shopify Customer Account API for login, logout, account management, order history, addresses, and profile editing.

**Layout and navigation.** Site header, footer, navigation menu (sourced from Shopify), mobile navigation drawer, and the cart drawer accessible from all pages.

**Design system.** Foundational components including buttons, form inputs, price displays, badges, product cards, variant selectors, quantity controls, breadcrumbs, pagination, loading skeletons, and empty states.

**Observability.** Error capture, structured logging for cart operations and checkout redirects, and operational telemetry.

**Phase 2 exit criteria.** A product can be added to the cart, the cart drawer functions correctly, and the checkout redirect successfully transitions to Shopify's hosted checkout with all line items intact. Customer login and logout function end-to-end.

---

### 6. Phase 3 — Core Templates (Week 3)

This phase delivers the three template types responsible for most of the site's traffic and revenue.

**Product Detail Page.** Variant selection with availability and price updates, media gallery, compare-at price display, inventory state messaging, add-to-cart with feedback, related products, integration points for the reviews widget (completed in Phase 4), and metafield-driven content blocks for product-specific information including brewing instructions, origin details, and ingredients. Structured data includes Product markup with offers and BreadcrumbList.

**Collection Page.** Product grid display, faceted filtering implemented through URL search parameters to ensure shareability and indexability, sort, and pagination. Canonical URL handling for filtered and paginated states.

**Homepage.** Section-based layout driven by Shopify metafields, allowing content updates by the merchandising team without a code deployment. The metafield-driven approach is preferred over a separate content management system at this site scale to minimise ongoing system complexity.

**SEO foundation.** Initial implementation of per-route metadata generation drawing from Shopify's SEO fields, with fallback values. Sitemap and robots.txt scaffolding established for completion in Phase 5.

**Phase 3 exit criteria.** All three template types render live Shopify data, conform to design specifications, and pass internal review. Cart functionality works correctly from each template type. Metadata renders correctly in page source.

---

### 7. Phase 4 — Supporting Templates and Integrations (Week 4)

This phase completes the template inventory and implements all third-party integrations.

#### 7.1 Remaining Templates

- Cart drawer and full cart page, including shipping threshold messaging, gift messaging where applicable, and order notes.
- Customer account templates not completed in Phase 2.
- Search results page using Shopify's predictive search API.
- Static content pages including about, contact, policy pages, FAQ, blog index, and individual blog posts.
- Error pages including 404 and general error states.

#### 7.2 Integrations

- **Analytics.** Google Analytics 4, Meta Pixel, and any other advertising platforms in use. Klaviyo identification and event tracking for product views, cart additions, and checkout initiation. Server-side conversion tracking via the GA4 Measurement Protocol, Meta Conversions API, and Klaviyo server events to maintain measurement integrity in the presence of ad blockers.
- **Reviews.** Integration of the existing review platform with both client-side widget rendering on the product detail page and server-side data inclusion in structured data markup.
- **Subscriptions.** Where subscription functionality is in use, the relevant headless SDK on the product detail page with correct cart attribute handling and checkout routing.
- **Email capture.** Klaviyo forms or equivalent, loaded with appropriate script-loading strategies to avoid impact on page performance.
- **Tag management and consent.** Google Tag Manager and consent management infrastructure consistent with applicable regulatory requirements.

A short parity note is produced for each integration, documenting prior behaviour, current implementation, and verification methodology.

**Phase 4 exit criteria.** All template types are complete and functional. All integrations fire verifiable events to their respective destinations. No template falls below a Lighthouse mobile performance score of 75.

---

### 8. Phase 5 — SEO Implementation and Quality Assurance (Week 5)

This phase implements the measures that protect organic search traffic during and after launch, and validates the build through systematic testing. Given the site's reliance on organic search, this phase functions as the primary risk-mitigation layer of the project.

#### 8.1 SEO Implementation

**URL parity.** The new site preserves Shopify's URL conventions exactly: `/products/{handle}`, `/collections/{handle}`, `/blogs/{blog}/{handle}`, and `/pages/{handle}`. Any URL that does change from the current implementation is captured in the redirect mapping.

**Redirects.** All redirects exported from Shopify in Phase 1 are imported into the Next.js application as 301 permanent redirects. Each redirect is validated through automated testing on staging to confirm correct status codes and destinations.

**Metadata.** Every route implements complete metadata: title, description, canonical URL, Open Graph properties, and Twitter Card markup, sourced from Shopify SEO fields with appropriate fallbacks.

**Structured data.** JSON-LD markup including Product schema with offers and aggregate ratings, BreadcrumbList, Organization, WebSite with SearchAction, BlogPosting for editorial content, and FAQPage where applicable. All markup is validated using Google's Rich Results Test on representative URLs from each template type.

**Sitemap and robots.** A dynamically generated sitemap drawing from live Shopify data with accurate last-modification timestamps. The robots.txt file is implemented with appropriate directives and sitemap references.

**Performance optimisation.** Targeted optimisation to deliver real-user metrics that match or exceed current production, with target thresholds of mobile LCP under 2.0 seconds, INP under 100 milliseconds, and CLS under 0.05 across the top twenty URLs by traffic.

#### 8.2 Quality Assurance

**End-to-end testing.** Automated testing of the complete cart-to-checkout flow for every product type in use, including standard products, variant products, subscription products, and gift cards. Tests verify correct line item composition, discount application, and successful handoff to Shopify checkout.

**Cross-browser validation.** Manual validation across iOS Safari, Android Chrome, and desktop Chrome, Safari, Firefox, and Edge, using physical devices where available.

**Accessibility audit.** Automated accessibility scanning supplemented by manual keyboard and screen reader testing on critical paths. Target conformance is WCAG 2.1 AA.

**User acceptance testing.** A structured walkthrough of the staging environment to validate that the rebuild meets functional and experiential requirements.

**Crawl comparison.** Comprehensive crawl of staging compared against current production, validating preservation of the URL inventory, page titles, meta descriptions, H1 headings, and redirect chains.

**Search Console preparation.** Verification of the new property in Google Search Console ahead of launch.

**Phase 5 exit criteria.** All items on the pre-launch readiness checklist (Section 10) are complete. Staging performance matches or exceeds current production on real-user-relevant metrics.

---

### 9. Phase 6 — Launch (Week 6)

Launch follows a phased traffic migration approach to validate performance and protect against unexpected regressions. A direct DNS cutover is not used.

**Migration sequence.**

1. *Day 1.* Production deployment with 1% of traffic routed to the new application via edge middleware or weighted DNS. Continuous monitoring of conversion rate, revenue per session, error rate, Core Web Vitals, and 404 rate against the existing Shopify-served control.
2. *Days 2–3.* Traffic share increased to 10% if metrics remain within tolerance. Re-evaluation at the 24-hour mark.
3. *Day 4.* Traffic share increased to 50%.
4. *Days 5–6.* Traffic share increased to 100%. The existing Shopify theme is preserved as a deployable rollback target for thirty days following full cutover.

**Rollback criteria.** A drop in revenue per session exceeding 5% at any migration stage that does not recover within four hours triggers a pause and diagnostic review. Migration does not advance until the issue is resolved.

**Cutover-day operations.**

- Redirect list imported and verified on production.
- DNS TTL reduced to 300 seconds 24 hours prior to cutover.
- Lock on Shopify theme modifications during the cutover window.
- Webhooks verified against the new application.
- New sitemap submitted to Google Search Console; indexing requested for top URLs.
- Analytics events verified firing correctly on production.
- Extended on-call window for the 72 hours following cutover.
- Rollback procedure validated on staging.

**Communication.** Customer service is briefed on known differences between the previous and new storefronts, with reference materials provided. Non-essential marketing campaigns are paused for the 24 hours surrounding cutover. Third-party vendors with active integrations (review platform, subscription platform) are notified of the cutover.

**Post-launch monitoring (Week 1).** Daily review of conversion rate, revenue per session, 404 rate, error rate, Core Web Vitals, Search Console coverage, and customer support ticket trends. Same-day remediation of identified regressions.

**Post-launch monitoring (Weeks 2–4).** Transition to a weekly review cadence with a comparative dashboard tracking current performance against the pre-launch baseline. Particular attention to the trajectory of organic search traffic and Core Web Vitals.

**Project closure.** At 30 to 60 days following launch, with stable metrics confirmed, the previous Shopify theme is archived and the project is formally closed.

---

### 10. Pre-Launch Readiness Checklist

The following must be confirmed complete before traffic migration progresses beyond the initial 1% allocation:

- All templates built and validated through user acceptance testing
- Cart-to-checkout flow validated end-to-end for every product type in use
- All Shopify redirects ported and verified through automated testing on staging
- Sitemap generated, validated, and ready for submission
- Structured data validated on representative URLs from each template type
- Mobile Core Web Vitals matching or exceeding current production on the top twenty URLs by traffic
- All analytics events validated as received in destination platforms
- Error monitoring operational with on-call coverage scheduled for the post-launch window
- Rollback procedure validated end-to-end
- Customer service reference materials prepared
- DNS TTL reduced
- Launch decision formally documented with sign-off

---

### 11. SEO Risk Management

Given the importance of organic search to the business, SEO preservation is treated as a discrete workstream with dedicated activities at each project phase.

**Pre-launch.**

- Comprehensive redirect mapping covering every URL change between current and new implementations.
- Structured data audit ensuring complete parity between current and new markup coverage.
- Internal linking audit preserving the link structure that supports current page rankings.
- Verification of the new Search Console property well in advance of launch.
- Final crawl comparison validating preservation of titles, descriptions, headings, and canonical URLs.

**Launch.**

- Immediate sitemap submission upon cutover.
- Indexing requests submitted via Search Console for the top fifty URLs.
- Continuous monitoring of coverage reports throughout the first week.

**Post-launch monitoring (first four weeks).**

- Daily review of Search Console coverage, top-query positions, impressions, and click-through rates.
- Daily review of 404 rates from analytics. Any 404 on a previously-indexed URL is treated as a redirect-mapping defect requiring same-day remediation.
- Weekly comparison of organic session volume against the pre-launch baseline. A 5–15% temporary decline during recrawl is anticipated; declines exceeding 20% or persisting beyond week four are escalation triggers.
- Retention of the previous Shopify theme as a deployable rollback target for thirty days following launch.

If an external SEO partner is involved, they are included in the redirect mapping review and post-launch monitoring activities.

---

### 12. Scope Boundaries

To set clear expectations on what this project does and does not include, the following capabilities are explicitly out of scope. Each can be addressed in a subsequent project following launch.

- Search infrastructure beyond Shopify's native predictive search.
- A separate content management system.
- Personalisation or A/B testing infrastructure.
- Internationalisation or multi-currency capabilities beyond Shopify Markets.
- Custom checkout or Shopify Plus Checkout Extensibility.
- Migration of historical commerce data, which remains in Shopify.

---

### 13. Project Risks and Mitigations

**Risk: Loss of organic search traffic during migration.**
*Mitigation.* Comprehensive redirect mapping, URL parity, structured data continuity, phased traffic migration with rollback capability, and dedicated post-launch SEO monitoring as described in Section 11.

**Risk: Cart or checkout regression introducing revenue loss.**
*Mitigation.* End-to-end automated testing of the complete cart-to-checkout flow for every product type, executed continuously through development and at each migration stage.

**Risk: Third-party application incompatibility with the headless architecture.**
*Mitigation.* Application inventory and porting plan completed in Phase 1, with a documented headless approach for each application before downstream development depends on it.

**Risk: Performance regression on real-user metrics.**
*Mitigation.* Performance budgets enforced through development, baseline comparison against current production before launch, and inclusion of performance criteria in the readiness checklist.

**Risk: Scope expansion compromising timeline.**
*Mitigation.* Explicit scope boundaries documented in Section 12, with a defined process for handling change requests as separate post-launch projects.

---

*End of document.*
