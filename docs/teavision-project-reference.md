# Teavision Storefront Rebuild — Project Reference

**Purpose of this document.** Single source of truth for the Teavision storefront rebuild on Next.js. Captures the project context, audit findings, technical decisions, scope, risks, and open questions that emerged from pre-kickoff analysis. Intended as reference material for development — including Claude Code — so context isn't lost between sessions.

**Status.** Pre-kickoff. Audit complete on the public-facing storefront. Three pre-kickoff conversations pending (business owner, SEO owner, operations). POC build commencing now to validate the technical approach in parallel with those conversations.

---

## Part 1 — Project Context

### What we're building

A Next.js storefront for teavision.com.au that replaces the current Liquid theme. Shopify remains the source of truth for products, inventory, orders, checkout, payments, tax, fulfillment, and back-office operations. The Next.js application pulls data from Shopify's Storefront API for product, collection, content, and cart data. Customers complete checkout on Shopify's hosted checkout via the cart's `checkoutUrl`.

### What we're not building

- A new commerce backend. Shopify stays.
- A custom checkout. Shopify hosted checkout, redirected via `checkoutUrl`.
- A migration of historical commerce data. Nothing moves.
- A separate CMS. Marketing content stays in Shopify metafields and native pages/blog.
- Personalisation, A/B testing, or dedicated search infrastructure (Algolia, Typesense). All deferred to post-launch projects if needed.
- Internationalisation. The site appears English-only based on audit (Translate & Adapt app installed but no language switcher detected).

### Why Next.js

The client requested an evaluation following a successful previous Next.js project. The honest framing: the site already passes Core Web Vitals on real users (mobile LCP 2.0s, INP 95ms, CLS 0.03), so this rebuild is not fixing a current performance crisis. The Lighthouse score of 41 will improve significantly (target 85+), but real-user metrics will improve only modestly from an already-good baseline.

The actual benefits driving the rebuild:

- Front-end flexibility for the design refresh and future iteration
- Stack alignment with the team's existing Next.js capability
- Engineering velocity for future feature work
- Modern component architecture and developer experience

The performance and SEO arguments are weaker than the Lighthouse score makes them look. The rebuild's value is design control and future-proofing, not transformative real-user speed gains. This expectation needs to be set explicitly with the business.

### Site basics

- Public domain: `teavision.com.au`
- Internal Shopify handle: `mrteashop-com` (suggests historical brand was "Mr Tea Shop" or similar)
- Secondary domain: `mrtea.com.au` — appears in footer login link, status unclear, needs resolution
- Plan tier: not yet confirmed (standard Shopify vs. Shopify Plus — affects checkout extensibility options)
- Catalog: self-reported 1,000+ ingredients, 1,500+ products
- Variant pattern: most products have 50g (sample), 250g, and 1kg variants; some go up to 2kg, 5kg, 10kg+

---

## Part 2 — Critical Audit Findings

These three findings reshape the rebuild scope and need to be reflected in every downstream decision.

### Finding 1: Teavision is a B2B-first business, not a retail storefront

**Evidence from the live site:**

- Homepage hero: "BULK WHOLESALE ACCOUNT - 100KG+ Orders → Apply Now"
- Self-description: "Australia's #1 tea company" oriented around supplying cafes, restaurants, retailers, wellness brands
- All customer testimonials are from business buyers (St. Ali, Remedy Drinks, MOOD Tea, Buy Organics Online)
- Product pages explicitly invite buyers to "ask the Teavision team for samples or wholesale pricing"
- Major service offerings: custom tea blending, private label, tea bag manufacturing, new product development
- 1300 phone number prominent on every page
- Catalogue PDFs (Tea, Tea Bag, Beverage RTD, Herbs & Spices, Tea Blends) linked from navigation

**Implications for the rebuild:**

- Retail Shopify checkout is a secondary path, not primary
- Lead-generation flows are first-class scope, not bolted-on content pages
- PDPs need to handle the "sample → bulk" pattern (50g sample tier as a try-before-commit)
- Inquiry CTAs (samples, wholesale pricing, custom blends) belong alongside add-to-cart, not as separate pages
- Wholesale account application, custom blend inquiry, catalogue download with lead capture, and quote request flows all need careful design and analytics tracking
- The conversion events the business actually cares about are inquiries, not just transactions

### Finding 2: Substantial deliberate SEO investment

**Evidence:**

- Footer contains ~100 keyword-targeted collection links ("matcha powder", "olive leaf tea", "buy rooibos tea", "ginger powder", etc.)
- Programmatic location-based collections: `/collections/tea-wholesale-perth`, `/collections/tea-wholesale-adelaide`, likely others — keyword-heavy meta titles, keyword-rich H1s, substantial copy blocks
- Content marketing pages targeting commercial intent: `/pages/global-tea-supplier`, `/pages/tea-importers-australia`, `/pages/import-tea-herbs-australia`
- Active blog (Tea Journal) with regular publishing on B2B-targeted topics ("Wholesale Herbs and Spices: The Secret to Consistent Menu Flavour", "How to Streamline Ingredient Costs with Bulk Spice Purchasing")
- Tag-based collection URLs: `/collections/all/categories_all-herbs`, `/collections/all/cf-type-spearmint`
- Catalogue PDFs hosted on Shopify CDN, linked from navigation and footer

**Implications:**

- Redirect mapping is foundational, not a Phase 5 checklist item
- URL parity must be absolute — the footer keyword links, location pages, content pages, blog posts, and tag-based collections all need preservation
- SEO partner involvement required from now, not Phase 5
- Search Console "Pages → Indexed" report should be cross-referenced against Shopify's redirect export — Google has likely indexed URL variants Shopify doesn't know about
- Structured data must be reproduced exactly, not simplified

### Finding 3: Domain inconsistency

- Site renders at `teavision.com.au`
- Internal Shopify store handle is `mrteashop-com`
- Footer login link points to `https://mrtea.com.au/account/login`
- Header login link correctly points to `https://www.teavision.com.au/account/login`

Likely a domain shift at some historical point that wasn't fully cleaned up, but could indicate split customer accounts, redirect logic, or two stores sharing infrastructure. Must be resolved before launch.

---

## Part 3 — App Audit Summary

The store has 35 installed apps. Most don't affect the rebuild because they operate on order data after checkout. The relevant breakdown:

### Back-office only (zero rebuild work)

ShipStation, MachShip, Australia Post EZ Label, Robust NetSuite Integrator, Shopify Messaging, OrderCup, Starshipit, AfterShip Tracking, Order Printer Pro, Order Printer Templates, Order Printer (legacy), Postcode Shipping, Transdirect Shipping, Sendle Dashboard Shipping, Fulfillrite Order Fulfillment, Rewind Backups, Webify Metafields Editor, Shopify Flow.

These keep working unchanged.

### Storefront integrations needing headless port

| App | Role | Approach |
|---|---|---|
| Searchanise | Search and faceted filtering | Decision pending: headless SDK, replace with Algolia/Typesense, or drop to native Shopify |
| TrustWILL (Trustoo) | Product reviews | API-based, render widget client-side, surface review data in JSON-LD via SSR |
| POWR Popup | Marketing popups | Embeddable script with `next/script lazyOnload`, or rebuild native |
| AMP Back in Stock | Notify-me-when-back form | API-based subscription, native React form |
| MultiVariants Bulk Order | Bulk ordering UI | Likely needs native React rebuild — bulk pricing/order UI for B2B |
| Hulk Discounts | Volume discounts | API for tier rules, apply via cart line item attributes — or evaluate Shopify native discounts as replacement |
| Mailchimp | Email/SMS marketing, e-commerce tracking | JS SDK and API for forms, server-side events for cart abandonment |
| Consentmo GDPR | Cookie consent | Script tag works headless, or native consent solution |
| POWR Photo Gallery | Image gallery | Easier to rebuild as native React component |

### Likely vestigial — confirm and remove

- Three form builders (Powerful Form Builder, Zotabox, Shopify Forms) — only one likely active
- Two image gallery apps (Spice Image Gallery, POWR Photo Gallery) — probably one is dead
- Multiple shipping management apps (ShipStation, OrderCup, Starshipit, Fulfillrite) — likely only one active
- Order Printer (legacy) alongside Order Printer Pro — almost certainly redundant
- Translate & Adapt — probably installed but unused given no language switcher detected
- Digital Downloads — probably unused unless tea retailer sells digital products

### Native Shopify (use as-is via Storefront API)

- Search & Discovery — Shopify's native search and recommendations

---

## Part 4 — Technical Stack and Architecture

### Core stack

- **Framework:** Next.js 15+ with App Router
- **Language:** TypeScript end-to-end
- **Styling:** Tailwind CSS
- **Component primitives:** shadcn/ui as starting point, custom design system on top
- **Data layer:** Shopify Storefront API (GraphQL) via typed client with GraphQL Codegen
- **Admin operations:** Shopify Admin API for server-only privileged reads where needed
- **Hosting:** Vercel (recommended — native Next.js, edge network, ISR/on-demand revalidation, edge middleware for canary routing)
- **State:** React Server Components for server state; Zustand or React Context for client UI state only; Shopify is the cart's source of truth
- **Search (v1):** Shopify predictive search; revisit Searchanise/Algolia/Typesense based on the search/filter decision
- **Images:** `next/image` with Shopify CDN as source, custom loader for Shopify image transformations
- **Auth:** Shopify Customer Account API (OAuth-based)
- **Observability:** Sentry, structured logs, health-check endpoint
- **Testing:** Playwright for E2E (especially cart-to-checkout), unit tests for cart logic and utilities

### Rendering strategy

- Static generation with on-demand revalidation (ISR) for product and collection pages
- Server-rendered for cart, account, search
- Client components only where interactivity requires (cart drawer, variant selector, search input)
- Webhook-driven revalidation: Shopify webhooks → Next.js route handler → `revalidateTag` on affected resources

### Repo structure

```
app/                  # App Router routes
  (storefront)/       # Public storefront routes
  (account)/          # Customer account routes
  api/                # Webhook handlers, internal API routes
components/           # Reusable UI components
  ui/                 # Design system primitives (button, input, etc.)
  product/            # Product-specific (variant selector, gallery)
  cart/               # Cart drawer, line items
  ...
lib/
  shopify/            # Storefront API client, typed queries, types from codegen
  cart/               # Cart server actions
  analytics/          # Tracking abstractions
  seo/                # JSON-LD builders, metadata helpers
content/              # MDX if used for editorial content
```

### Cart architecture

- Cart server actions: `addItem`, `updateItem`, `removeItem`, `applyDiscountCode`, `removeDiscountCode`
- `cartId` stored in HTTP-only cookie
- Shopify is authoritative — every action returns the fresh cart from Shopify
- Client only holds UI state (drawer open/closed, optimistic UI flags)
- Explicit error handling: variant unavailable, out of stock, discount rejected, currency mismatch, session expired
- Line item properties must match what Shopify-side apps expect (Hulk Discounts tier metadata, MultiVariants bulk attributes, back-in-stock subscription markers)

### URL strategy

Match Shopify conventions exactly:
- `/products/{handle}`
- `/collections/{handle}`
- `/collections/{handle}/{filter-state-as-search-params}`
- `/blogs/{blog-handle}/{article-handle}`
- `/pages/{handle}`

Trailing slash convention: needs decision — current site is inconsistent, must normalize to one and 301 the other.

Filtered collection canonicalization: pending Searchanise decision and SEO partner input. Default position: canonical to unfiltered collection unless filtered URLs are demonstrably ranking and earning traffic.

### SEO implementation

- `generateMetadata` per route from Shopify `seo.title` and `seo.description` with sensible fallbacks
- Structured data: Product (with offers, aggregateRating), BreadcrumbList, Organization, WebSite (with SearchAction), BlogPosting, FAQPage where applicable
- Dynamic `sitemap.xml` from Shopify data with accurate `lastmod`; split into multiple sitemaps if catalog exceeds 50k URLs
- `robots.txt` with appropriate directives and sitemap reference
- All redirects as 301 permanent via `redirects()` in `next.config.js` or middleware for pattern-based

---

## Part 5 — Project Plan Summary

Six-week plan with one-week contingency. Solo developer using Claude Code Max 20x.

| Week | Phase | Headline Deliverable |
|---|---|---|
| 1 | Audit + Foundation Kickoff | Stack running, first product renders from Shopify |
| 2 | Foundation Complete | Cart, auth, layout, design system primitives |
| 3 | Core Templates | PDP, PLP, homepage |
| 4 | Supporting Templates + Integrations | Cart, account, content, analytics, reviews, SEO scaffolding |
| 5 | SEO + QA | Redirects, structured data, sitemap, CWV, E2E tests, UAT |
| 6 | Launch | Canary 1% → 10% → 50% → 100%, week-1 monitoring |

### Phase 1 (Week 1) — Audit deliverables

- URL inventory ranked by traffic and revenue
- Redirect export from Shopify Admin (Online Store → Navigation → URL Redirects)
- Application audit with porting plan per app
- Theme code review for customisations, embedded scripts, metafield dependencies
- Existing SEO audit (structured data, metadata patterns, canonicals, sitemap, robots)
- Lighthouse diagnostic review for specific optimisation targets

### Phase 2 (Week 2) — Foundation primitives

Cart server actions, Customer Account API auth, layout/header/footer/navigation, design system primitives (button, input, select, price, product card, variant selector, etc.), observability.

Exit criteria: add-to-cart → drawer → checkout redirect to Shopify works end-to-end. Login/logout works.

### Phase 3 (Week 3) — Core templates

PDP, PLP, homepage. Variant selection, filtering, faceted search, metafield-driven content blocks. SEO foundations established.

### Phase 4 (Week 4) — Supporting templates and integrations

Cart pages, account pages, search results, content pages. Analytics (GA4, Meta, Klaviyo), reviews, popups, email capture, tag manager, consent.

**For Teavision specifically:** lead-generation flows are first-class scope here:
- Wholesale account application form and confirmation
- Custom blend inquiry flow
- Catalogue download with lead capture
- Quote request flows
- Sample request handling

### Phase 5 (Week 5) — SEO and QA

Redirects, metadata, structured data, sitemap, robots, performance optimisation, E2E tests, cross-browser, accessibility, UAT, crawl comparison, Search Console preflight.

### Phase 6 (Week 6) — Launch

Canary rollout: 1% (day 1) → 10% (days 2-3) → 50% (day 4) → 100% (days 5-6). Kill-switch at 5% revenue-per-session drop without 4-hour recovery. Old Shopify theme retained as rollback for 30 days.

---

## Part 6 — Risks Register

### Tier 1 — Business-impact risks

**SEO traffic loss during migration.** Highest-priority risk given Teavision's substantial SEO investment. Mitigations: comprehensive redirect mapping including Search Console-discovered URLs (not just Shopify's export), URL parity, structured data continuity, internal linking preservation (especially the footer keyword block), canary rollout with monitoring, SEO partner involvement throughout.

**Cart and checkout regressions.** Subtle bugs in line item properties, discount code handling, currency context, or checkout URL handoff cost revenue and are hard to detect. Mitigations: E2E tests for every product type before any cart code ships, real cart-structure comparison between current site and new build, chaos testing (expired codes, unavailable variants, session expiry).

**Search and filter functionality regression.** If Searchanise is doing meaningful work and we drop to native Shopify search/filters without realising, the collection page experience degrades. Mitigations: confirm Searchanise's actual role in week 1, decide on headless SDK vs. replacement vs. native before Phase 3.

### Tier 2 — Timeline risks

**B2B/wholesale scope discovery.** Confirmed B2B-first business; the rebuild needs lead-generation flows as first-class scope. Risk: discovering wholesale-specific functionality (customer-group pricing, gated catalogs, quote workflows) mid-build. Mitigation: business owner conversation before Phase 3 to scope wholesale flows fully.

**App audit reveals more than expected.** 35 installed apps with signs of accumulation (three form builders, four shipping management apps). Risk: theme code references inactive apps still loading scripts. Mitigation: grep theme for script tags and external domains during code audit, cross-reference against active app list.

**Multilingual scope creep.** Translate & Adapt installed but appears unused. Risk: discovering live translations during build. Mitigation: confirm Settings → Languages in admin before Phase 2.

### Tier 3 — Soft risks

**Performance expectation mismatch.** Real-user metrics already good; rebuild's gains will show in Lighthouse but be modest in field metrics. Mitigation: explicit framing in business owner conversation, written sign-off on what success looks like.

**Solo developer concentration risk.** Single point of failure for review, SEO depth, and launch operations. Mitigation: consider SEO consultant for Phase 5 + post-launch monitoring; consider peer review on cart/checkout PRs specifically.

---

## Part 7 — Open Questions

These need answers before specific phases can proceed safely. Grouped by who needs to answer.

### Business owner (highest priority — blocks Phase 3)

- Approximate retail/wholesale/services revenue split
- What the wholesale customer journey looks like end-to-end (application → first order)
- Which website inquiries actually convert vs. which are noise
- Status of the `mrtea.com.au` domain — active, redirect target, decommission candidate
- Status of any previous theme customisation work
- Specific features the current Shopify theme has been blocking
- Target launch date driver (campaign, trade event, fiscal milestone, or "as soon as ready")

### SEO owner (highest priority — blocks Phase 5, ideally engaged from now)

- Identity and engagement model
- Which pages drive the bulk of organic traffic
- Strategy behind the footer keyword link block
- Strategy behind location-based wholesale collections
- Whether tag-based collection URLs (`/collections/all/categories_all-herbs`) drive traffic
- How filtered collection URLs should be canonicalized
- Search Console and analytics access for the project
- Pre-agreed response if launch causes >20% traffic drop

### Operations / customer service (priority — blocks Phase 4)

- Which form-builder app is actually in use for which forms
- Wholesale customer reordering patterns (web vs. email vs. phone)
- Whether wholesale customers see different prices, products, or content
- Which apps the team actually uses day-to-day
- Who maintains the site post-launch and what content they update

### Self-investigation in admin (priority — blocks Phase 1 audit completion)

- Plan tier (Shopify vs. Plus)
- Settings → Languages — confirm multilingual status
- Settings → Markets — currency/region setup
- Online Store → Themes — live theme, draft themes, last edit dates
- Settings → Custom data — full metafield definitions
- Online Store → Navigation → URL Redirects — full export
- Apps page — which are configured vs. dormant

### Live-site interactive audit (priority — blocks Phase 3)

- Searchanise's actual role on the storefront (search, filters, merchandising rules)
- Whether Trustoo reviews are actually configured
- Whether AMP Back in Stock renders on out-of-stock products
- Whether POWR Popup is configured to fire
- Whether MultiVariants bulk ordering UI exists on PDPs

---

## Part 8 — Decisions Made and Why

Captured here so the reasoning isn't lost.

**Headless Shopify, not full replatform.** Shopify's commerce backend is working and replatforming would multiply scope and risk. Storefront-only rebuild is the right scope.

**Next.js with App Router.** Modern Next.js, supports the rendering strategies needed (RSC for product/collection, server actions for cart, edge middleware for canary). Aligns with team's existing capability.

**Shopify hosted checkout, no Checkout Extensibility.** Standard Shopify (assumed; confirm plan tier). Custom checkout out of scope. `cart.checkoutUrl` redirect is the approach.

**Vercel as hosting default.** Native Next.js, edge network, on-demand revalidation, middleware for canary. Confirm before kickoff but no strong reason to deviate.

**Metafield-driven homepage, not separate CMS.** Catalog scale and team size don't justify the overhead of an additional CMS. Shopify metafields with admin tooling provide enough flexibility.

**Native Shopify predictive search for v1.** Defer Searchanise/Algolia/Typesense decision until search role is confirmed and the SEO/business owner conversations have happened. Don't add infrastructure prematurely.

**E2E tests written first for cart and checkout.** Highest-stakes code path. AI-assisted development can produce plausible-looking bugs in this area. Test-first protects against silent revenue regressions.

**Canary rollout, not direct cutover.** 1% → 10% → 50% → 100% with kill-switch criteria. Old theme retained for 30-day rollback window.

**Performance framing is design/flexibility, not transformative speed.** Real-user metrics already good. Rebuild justified on design control, future iteration speed, and Lighthouse improvement, not on real-user speed gains. Set this expectation explicitly with the business.

---

## Part 9 — POC Scope (Starting Point)

The POC commencing now should validate the core technical assumptions before full project commitment. Suggested POC scope:

**In scope:**
- Next.js 15 App Router project with TypeScript and Tailwind
- Shopify Storefront API client with GraphQL Codegen
- One product detail page rendering live Shopify data
- One collection page with basic filtering
- Cart server actions (add, update, remove, get)
- Cart drawer component
- Successful checkout redirect to Shopify hosted checkout
- Basic header/footer
- Deployed to Vercel preview

**Out of POC scope:**
- Auth (Customer Account API)
- All third-party integrations
- SEO infrastructure (metadata, JSON-LD, sitemap)
- Account pages
- Content pages
- Search
- Webhook revalidation
- Design system polish

**POC success criteria:**
- A real product loaded from Shopify renders on the PDP
- A real collection renders with at least one filter working
- Add a product to cart, see it in drawer, modify quantity
- Click checkout, land successfully on Shopify checkout with the correct line item
- Page loads in under 1 second on Vercel preview

If the POC validates the approach, full Phase 1 audit work and the pre-kickoff conversations proceed in parallel with Phase 2 foundation work.

---

## Part 10 — Reference Materials

The following supporting documents exist for this project:

- **Implementation Plan** (`teavision-nextjs-implementation-plan.md`) — formal six-week plan, internal voice, ready for stakeholder circulation
- **Phase 1 Audit Findings** (`teavision-phase-1-audit.md`) — detailed audit of the current public-facing storefront
- **Pre-Kickoff Question Sets** (`teavision-pre-kickoff-questions.md`) — three conversation guides for business owner, SEO owner, operations
- **Business Owner Message Draft** (`teavision-business-owner-message.md`) — message templates to schedule the pre-kickoff conversation

---

## Part 11 — Notes for Claude Code

Reference notes if Claude Code is used to assist development on this project.

**High-stakes areas requiring extra care:**

- **Cart server actions and line item construction** — subtle bugs cost revenue. Always check line item properties match what Shopify-side apps (Hulk Discounts, MultiVariants, AMP Back in Stock) expect. Write E2E tests first.
- **Checkout URL handoff** — handle session expiry, currency context mismatches, inventory race conditions, and unavailable variants explicitly.
- **Discount code handling** — partial-success responses are a real failure mode. Surface errors meaningfully to users.
- **Redirect map** — every URL Google has indexed needs handling. Don't trust that Shopify's export is complete. Cross-reference Search Console.
- **Structured data** — reproduce what's currently on the site, don't simplify. Rich results loss directly costs CTR.
- **Footer keyword link block** — preserve exactly. This is deliberate SEO infrastructure, not decorative.

**Architectural patterns to maintain:**

- Shopify is the source of truth for cart state. Client only holds UI state.
- Server Components for product, collection, content pages. Client components only where interactivity is required.
- ISR with webhook-driven revalidation, not long cache times.
- Server actions for mutations. No client-side Storefront API mutations except for cart UI state.
- Admin API never called from the browser. Server-only.

**Patterns to avoid:**

- Storing line items in client state (always a mistake — Shopify will become inconsistent)
- Using the Admin API where Storefront API can serve the need
- Building filter UIs that fetch all products and filter client-side at scale
- Reproducing Liquid theme inefficiencies (script tag injection, app residue)
- Skipping the "what does this look like in production with real data" check before merging

**Things that might be obvious but worth saying:**

- The B2B nature of this business means inquiry/lead-generation flows are first-class scope, not secondary
- The SEO investment is substantial and any URL or structure change is a real risk
- Performance expectations should be Lighthouse-improvement focused, not real-user-metric-transformation focused — the site is already fast for real users
- The 35-app footprint includes a lot of operational tooling that doesn't affect the storefront at all; don't conflate "app installed" with "app affects rebuild"

**When uncertain, prefer:**

- Asking about scope or business priority over making assumptions
- Writing tests before implementation in high-stakes areas
- Server-rendering over client-rendering when both work
- Native Shopify Storefront API features over adding new infrastructure
- Preserving current site behaviour over redesigning, unless redesign is the explicit task
