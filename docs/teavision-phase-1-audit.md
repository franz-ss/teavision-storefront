# Teavision Storefront Audit — Phase 1 Findings

A first-pass audit of the public-facing storefront at teavision.com.au, conducted via direct fetch and analysis of the homepage and a representative product page. Findings here are grounded in the actual current state of the site, not assumptions.

This document focuses on the things that should change the rebuild plan if they're true. Comprehensive crawl, structured data validation, and the deeper SEO audit still need to happen — but the items below are concrete enough to act on now.

---

## 1. Headline Finding: This Is a B2B-First Business

The most important finding from the audit, and one that significantly reshapes the rebuild scope.

The hero of the homepage is "BULK WHOLESALE ACCOUNT - 100KG+ Orders → Apply Now." The site self-describes as "Australia's #1 tea company" oriented around supplying cafes, restaurants, retailers, and wellness brands. Every customer testimonial on the homepage is from a business buyer (MOOD Tea, St. Ali, Remedy Drinks, Buy Organics Online). Product pages explicitly invite contact for "samples or wholesale pricing." The catalogue PDFs, custom tea blending, private label, tea bag manufacturing, new product development request — all B2B services with quote/inquiry flows.

Retail purchase exists (the Shopify cart and checkout work for direct buyers) but it's secondary to the wholesale operation. The 1300 phone number is prominent on every page.

**Why this matters for the rebuild:**

The original plan and risk analysis treated wholesale as a question to investigate. The audit confirms it's a primary use case, not a side feature. Several rebuild assumptions need to be revisited:

- **"Add to cart → Shopify checkout" is the retail path, but it's not the dominant conversion path.** The dominant paths are wholesale account application, custom blend inquiry, private label inquiry, catalogue download, and direct phone contact. The rebuild must treat these flows as first-class, not as content pages bolted onto a retail storefront.
- **Lead-generation surfaces matter as much as PDPs.** Catalogue downloads, sample requests, quote requests, and the "Apply Now" wholesale flow drive sales pipeline. Each one needs careful handling and analytics tracking — they're the conversion events the business actually cares about.
- **The MultiVariants app concern from the earlier risk analysis is now confirmed.** Bulk ordering is real for this business, even if the current implementation doesn't use a dedicated bulk-order UI on PDPs. This is something to confirm with the team — what does bulk ordering look like today, what should it look like in the rebuild.
- **PDP "Add to Cart" UX serves a smaller share of revenue than retail-first stores.** This affects how much PDP polish is worth investing in vs. the wholesale inquiry flows.

**Recommended action:** before kickoff, surface this with the business explicitly. Confirm the retail/wholesale revenue split, understand which flows drive what proportion of business, and validate that the rebuild scope reflects actual business priorities rather than retail-storefront defaults.

---

## 2. SEO Investment Is Visible and Substantial

The brief said "we do heaps of SEO" and the audit confirms this is not casual. There's deliberate, sophisticated SEO infrastructure throughout the site that the rebuild must preserve faithfully.

**Footer keyword link distribution.** The footer contains roughly 100 keyword-targeted links pointing to specific collections — "matcha powder," "olive leaf tea," "buy rooibos tea," "ginger powder," etc. This is a deliberate internal-linking strategy distributing authority across the long tail. Removing or reducing this is one of the fastest ways to lose long-tail rankings.

**Programmatic location-based collections.** URLs like `/collections/tea-wholesale-perth`, `/collections/tea-wholesale-adelaide`, and likely similar for other Australian cities are pure programmatic SEO plays. They have keyword-heavy meta titles ("Wholesale Loose Tea for Sale Online Adelaide | Teavision"), keyword-rich H1s, and substantial copy blocks targeting city-specific search intent.

**Keyword-stuffed page-level copy.** Collection and content pages contain large H1s, paragraph blocks, and footer copy clearly written for SEO ranking. Examples include `/pages/global-tea-supplier`, `/pages/tea-importers-australia`, `/pages/import-tea-herbs-australia` — these are content-marketing landing pages targeting specific commercial intent.

**Active blog.** The Tea Journal publishes regularly (multiple posts dated April 2026, the current month). Topics target B2B keywords ("Wholesale Herbs and Spices: The Secret to Consistent Menu Flavour", "How to Streamline Ingredient Costs with Bulk Spice Purchasing"). This is ongoing content marketing, not a dormant blog.

**Tag-based collection URLs.** The site uses Shopify tags like `categories_All Herbs` and `cf-type-spearmint` to power collection filtering, producing URLs like `/collections/all/categories_all-herbs`. These tag-collection combinations may have accumulated SEO equity over years. The rebuild's collection architecture must accommodate this pattern or carefully redirect away from it.

**Catalogue PDFs hosted on Shopify CDN.** Multiple PDF catalogues (Tea Catalogue, Tea Bag Catalogue, Beverage RTD, Herbs & Spices, Tea Blends) are linked from the navigation and footer. These are likely indexed and may rank for product-research queries. URLs must be preserved or redirected.

**Why this matters:**

This level of SEO investment means redirect mapping is not a Phase 5 checklist item — it's the foundation the entire project sits on. Every URL change is a risk. The rebuild should aim for absolute URL parity, no exceptions, with every variant accounted for.

It also means the SEO partner (whoever they are) is doing real work and needs to be involved early. They will know which pages currently rank for what, which footer keywords drive traffic, and which programmatic pages can't be touched. Without their input, the rebuild risks dismantling things they spent years building.

---

## 3. Domain / Login URL Inconsistency

Worth flagging because it's odd and indicates either a domain migration or a misconfiguration:

- Site renders at `teavision.com.au`
- Internal Shopify store handle is `mrteashop-com` (visible in admin URLs)
- Footer "Login" link points to `https://mrtea.com.au/account/login` — a different domain entirely
- Header "Log in" link points to `https://www.teavision.com.au/account/login` (correct)

There's a `mrtea.com.au` domain that's apparently still in use somewhere, or was historically the primary domain before a rebrand or migration. The footer login link is either a bug or a deliberate cross-domain account link.

**Implications for the rebuild:**

- Confirm with the business which domain is canonical and whether `mrtea.com.au` should redirect to `teavision.com.au`, vice versa, or remain separate.
- Customer accounts may be split across two stores — needs verification.
- The redirect map needs to handle whichever domain shifts happen.
- This is exactly the kind of detail that gets discovered in week 8 of a rebuild and causes panic. Resolving now.

---

## 4. URL Structure Observations

Several URL patterns to be aware of:

**Nested product URLs.** Some product links use the collection-prefixed pattern: `/collections/dried-herbs/products/chamomile-organic`. This is Shopify's default behaviour when products are accessed via collection pages and produces duplicate-content concerns unless canonicalized. Worth checking how the current site handles this.

**Tag-based pseudo-collections.** URLs like `/collections/all/categories_all-herbs` and `/collections/all/cf-type-spearmint` are powered by Shopify's tag-filtering on the `all` collection. These have likely been indexed historically.

**Trailing slash inconsistency.** Some collection URLs have trailing slashes (`/collections/wholesale-detox-tea/`, `/collections/organic-sleepy-tea/`), others don't (`/collections/sale`, `/collections/black-tea`). This needs to be normalized consistently in the rebuild — pick one convention and 301 the other.

**Sub-pseudo-collections like `/collections/australian-tea/categories_australian-tea`.** Doubly-tagged URLs that suggest the categorization scheme has evolved over time without cleanup. Each one is potentially indexed and needs a redirect plan.

**Recommended action:**

Before Phase 5 redirect work begins, the team should pull both the Shopify Admin redirect export *and* a Search Console "Pages → Indexed" report. The delta between what Shopify knows about and what Google has indexed will reveal the URL inventory the rebuild needs to handle. Expect this to be larger than anyone expects.

---

## 5. Catalog and Variant Structure

**Catalog size.** Self-reported as 1,000+ ingredients / 1,500+ products. Real catalog count needs admin confirmation but it's clearly substantial.

**Variant structure.** Most products have three size variants: 50g (sample), 250g, and 1kg. Some products go up to bulk sizes (2kg, 5kg, 10kg+). The 50g serves as a sampling SKU before larger commitments — this is part of the B2B sales process.

**Implications:**

- Variant selector UX must handle the sampling flow gracefully — making the 50g option clear as a "try before you buy big" path.
- Product pages need to surface both retail prices (visible) and wholesale pricing (gated behind the "Apply Now" or "contact us" flow).
- Inventory levels visible in current product JSON — the rebuild needs to make a deliberate decision about whether to expose inventory to retail buyers (current behaviour) or hide it.
- Catalog of this size means sitemap structure matters — likely needs to be split into multiple sub-sitemaps.

---

## 6. Apps: What's Actually Rendering on the Storefront

The earlier app audit listed 35 installed apps. The site fetch reveals which ones actually render content on the storefront, vs. which are operational/back-office only.

**Confirmed rendering on the storefront:**

- **Searchanise** — likely powering predictive search and filtering, though not visible in the static homepage/PDP fetch (would need to inspect interactive search behaviour to confirm specific role).
- **A "Quick View" feature on related products** — could be theme-native or an app. Renders inline JSON for product data.
- **Newsletter / email capture forms** — at least two on the homepage. Likely Mailchimp or Shopify Forms.
- **"Need help?" contact form** — custom form, likely from one of the form-builder apps.
- **Theme-rendered "Sold Out" indicator** — uses a hardcoded image asset (`/cdn/shop/t/48/assets/soldout.png`), not an app.

**Not visible in the static fetch (might be lazy-loaded, might be inactive):**

- **TrustWILL / Trustoo reviews** — there's a "Reviews" tab placeholder on the PDP but no widget content rendered. Either lazy-loads on click, or installed but not configured. Needs interactive inspection to confirm.
- **AMP Back in Stock** — the spearmint product has all variants sold out, but no "notify me when back in stock" form is visible. Either the app isn't configured or it's lazy-loaded.
- **POWR Popup** — no popup triggered on the static homepage fetch. Could be configured to fire on exit-intent or scroll triggers.
- **MultiVariants Bulk Order** — no visible bulk-order UI on PDPs. May only render on specific product types or for logged-in wholesale customers.

**Recommended action:**

Browse the live site interactively with browser dev tools open and audit:
1. What scripts actually load (Network tab)
2. What renders after JavaScript executes that didn't appear in the static HTML
3. Specific behaviour for: searching, filtering on collection pages, viewing a sold-out product, clicking the Reviews tab, attempting to interact with bulk ordering

This will give a definitive answer on which of the 35 apps are doing real work vs. which are residue.

---

## 7. Multilingual: Likely Not Active

No language switcher detected in header or footer. No `hreflang` tags or locale-prefixed URLs visible. The Translate & Adapt app appears installed but unused.

**Recommended action:** confirm in admin (Settings → Languages) but the working assumption can be "English-only, no i18n scope needed in the rebuild."

---

## 8. Theme Observations

The theme is using path `/cdn/shop/t/48/...` — theme ID 48 in the Shopify admin. Worth checking when this theme was last updated.

**Specific theme behaviours to note:**

- **Inline product JSON in HTML.** Product data is rendered as inline `{...}` JSON blocks visible in page source. This is sometimes used for app integration (passing data to client-side widgets like Searchanise, Trustoo, or quick-view). The new build will need a different mechanism to provide product data to client components.
- **Hardcoded sold-out image.** `/cdn/shop/t/48/assets/soldout.png` is a theme asset. The new build can render this state in CSS instead of an image — better for performance and accessibility.
- **Mega-menu structure with rich content.** The header navigation includes promotional images and copy blocks within mega-menu panels. Not just a flat link list.
- **"Read more" expanding content blocks.** Pages have hidden content sections with `id="read-more"` that expand on click — used heavily for SEO copy that doesn't dominate the visible page.
- **Inconsistent image formats.** Mix of WebP (`hero-logos.webp`), JPG, and PNG. The rebuild should serve WebP/AVIF consistently.

---

## 9. What Still Needs to Be Audited

This audit covered the homepage and one product page. To complete Phase 1, the following still need to happen:

1. **Crawl with Screaming Frog or equivalent.** Full URL inventory, all template types, redirect chains, structured data on every page type, page weight per template, internal linking depth.

2. **Search Console data review.** Top queries, top pages, current rankings, indexed page count, coverage issues, Core Web Vitals reports per URL group, manual actions if any.

3. **Interactive behaviour audit.** Open the site in a browser with dev tools, confirm which apps actually render and what scripts they load. Specifically check Searchanise, Trustoo, AMP Back in Stock, and any popup behaviour.

4. **Admin walkthrough.**
   - Online Store → Themes (live theme, draft themes, last edit dates, the "previous theme" question)
   - Settings → Languages (multilingual confirmation)
   - Settings → Markets (currency / region setup)
   - Online Store → Navigation → URL Redirects (full export)
   - Settings → Custom data (metafield definitions for products, collections, and any other resource)
   - Apps → review which are actually configured vs. installed-but-dormant

5. **Repo review.** Theme code review for: custom Liquid, embedded scripts, metafield usage in templates, app integrations baked into the theme, any custom JavaScript, A/B testing or personalization code.

6. **SEO partner conversation.** Identify whoever owns the SEO strategy. They need to be brought into the project before Phase 5, and ideally before Phase 1 finishes. They will have data and context that can't be reverse-engineered from the live site.

7. **Business conversation about wholesale.** Get explicit clarity on: what proportion of revenue is retail vs. wholesale, what the wholesale customer journey looks like end-to-end, whether any of MultiVariants or Hulk Discounts are doing important work, and whether B2B-specific pricing or catalog visibility exists.

---

## 10. Implications for the Rebuild Plan

Based on the findings above, the implementation plan needs revisiting in several places:

**Section 1 (Project Context).** Add B2B-first nature of the business as a stated context. The plan currently reads as if the storefront is primarily retail.

**Section 2 (Pre-Kickoff Requirements).** Add: business confirmation of retail/wholesale split and wholesale flow priority. The mrtea.com.au / teavision.com.au domain question. SEO partner identification (already noted but now elevated in importance).

**Section 6 (Phase 3 — Core Templates).** PDPs need to handle:
- The variant-as-sample-tier pattern (50g/250g/1kg)
- Inquiry CTAs alongside add-to-cart for bulk volumes
- Wholesale pricing visibility logic (if applicable)

Additionally, the project needs first-class lead-generation templates that the original plan undersized:
- Wholesale account application form and confirmation
- Custom blend inquiry flow
- Catalogue download with optional lead capture
- Quote request flows

**Section 7 (Phase 4 — Integrations).** The form-builder app question becomes more important. The current site has multiple inquiry forms with different destinations; the rebuild needs a clear strategy for handling all of them.

**Section 8 (Phase 5 — SEO).** The SEO workstream needs more weight given the level of investment visible. Specific additions:
- Footer keyword-link block must be reproduced exactly (this is a deliberate ranking strategy, not decorative)
- Programmatic location pages (`/collections/tea-wholesale-perth` etc.) must be preserved with their copy and structure
- Tag-based collection URL patterns need an explicit decision: preserve, redirect, or canonicalize
- Catalogue PDF URLs preserved or redirected
- mrtea.com.au domain handling decided

**Section 11 (SEO Risk Management).** Elevated from "important workstream" to "primary risk-mitigation surface." Requires explicit SEO partner involvement.

**Section 12 (Scope Boundaries).** Add: B2B-specific pricing visibility, catalog gating by customer type, and quote-request flows — flag these as scope items requiring explicit decisions before kickoff (not implicit assumptions).

**Section 13 (Risks).** The "B2B / wholesale dimension" risk from the earlier risk analysis moves from speculative to confirmed. Treat as a primary risk going forward.

---

## 11. The Top Three Things to Do Next

If only three things happen before kickoff, these are the right three:

1. **Have the wholesale-flow conversation with the business.** What are the conversion paths that actually drive revenue, what proportion is wholesale vs. retail, what does the ideal wholesale buyer journey look like in the new site. This conversation will reshape the rebuild scope more than any other single input.

2. **Identify the SEO owner and bring them in.** They need to see the rebuild plan, sign off on the URL strategy, and be on the post-launch monitoring rotation. Without this, the SEO investment that's visible in the audit is at serious risk during migration.

3. **Resolve the mrtea.com.au domain question.** Probably 20 minutes of investigation, but unresolved domain ambiguity at launch is the kind of thing that causes very bad days.

Everything else in the rebuild plan can proceed in parallel with these.
