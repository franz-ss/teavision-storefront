---
status: complete
phase: 22-storefront-data-and-rendering
source: [22-01-SUMMARY.md, 22-02-SUMMARY.md, 22-03-SUMMARY.md, 22-04-SUMMARY.md, 22-05-SUMMARY.md, 22-06-SUMMARY.md, 22-07-SUMMARY.md]
started: 2026-07-02T23:14:54Z
updated: 2026-07-02T23:47:24Z
---

## Current Test

[testing complete]

## Tests

### 1. Homepage CMS Route Loads
expected: Visiting `/` loads the storefront homepage from Sanity-backed homepage content, renders the full homepage shell without static fixture fallback content, and shows exactly one visible H1.
result: issue
reported: "the main section is blank at first, should load server side, this will affect SEO"
severity: major

### 2. Above-Fold Homepage Content
expected: The hero, proof points, and product range sections show authored homepage headline, body, proof-point, image, card, CTA, and alt-text content while preserving the hero full-width LCP image behavior and product-card CTA interactions.
result: pass

### 3. Middle Homepage Sections
expected: The newsletter, private-label, and organic-herbs sections show CMS-authored intro, card, checklist, CTA, image, and alt-text content; the newsletter form remains present and uses the existing signup interaction.
result: pass

### 4. Supply-Chain And Certification Sections
expected: The supply-chain intro/CTA, certification coverage labels/icons, and supply-chain-protection mark grid render from homepage content while keeping the existing decorative motifs, icon mapping, stable mark layout, and links.
result: pass

### 5. Testimonials And Tea Journal
expected: The testimonials section shows CMS-authored intro and testimonial items in the existing slider, and the Tea Journal section uses CMS blog handle, link label, and max-post configuration to show up to the configured live article cards or hide cleanly when no articles exist.
result: pass

### 6. Contact, Catalogue, And FAQ
expected: The contact section shows CMS intro and contact methods while preserving the contact form interaction; the catalogue CTA shows CMS primary and secondary labels/links with approved button variants; FAQ items expand and collapse with native details/summary behavior.
result: pass

### 7. Homepage SEO Metadata And JSON-LD
expected: The homepage head metadata uses CMS SEO title, description, canonical path, Open Graph image, and noindex settings, while Organization and WebSite JSON-LD remain present as code-owned structured data.
result: pass

### 8. Missing Or Invalid Homepage Content Fails Loudly
expected: If required Sanity homepage content is missing or invalid, the homepage request fails visibly at request time instead of silently rendering stub or fixture content; restoring valid content makes the homepage render normally again.
result: pass

## Summary

total: 8
passed: 7
issues: 1
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "Visiting `/` loads the storefront homepage from Sanity-backed homepage content, renders the full homepage shell without static fixture fallback content, and shows exactly one visible H1."
  status: failed
  reason: "User reported: the main section is blank at first, should load server side, this will affect SEO"
  severity: major
  test: 1
  artifacts: []
  missing: []
