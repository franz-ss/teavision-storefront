# Content spec: /pages/bulk-wholesale-supply

Source: production page HTML supplied by Franz during Phase 11 UAT (2026-06-10). Texts and section layout are authoritative; implement with the Phase 11 design system (Section primitives, Eyebrow, Button, Accordion, tokens) — do NOT copy production classes/styles/scripts.

## Section order

### 1. Wholesale account banner (full-width image band)

- Background image (Shopify CDN): `https://www.teavision.com.au/cdn/shop/files/Screenshot_2025-10-29_at_14.01.32.png` (2000×675)
- H2: **BULK WHOLESALE ACCOUNT**
- P: Access 1500+ Ingredients Direct from Farms and Save
- CTA button: "Apply Now" → `/pages/appi-compliance?view=bulk-wholesale-supply`

### 2. Hero split (content left, media right)

- Caption/eyebrow (green): Bulk Imports • Containers • Volume Discounts
- H2: Large-Scale Tea Imports to Australia - Delivered to Your Warehouse
- P: Import premium teas, herbs and botanicals at scale with Teavision. We source across 10+ countries, manage container freight to Melbourne, and pass through significant volume savings.
- Primary button: "Apply Now - Wholesale Account" → `/pages/wholesale-account-request`
- Secondary button (phone icon): "Call 1300 729 617" → `tel:+611300729617`
- Desktop media: image `Section_Image.avif` (1500×1130); mobile media: autoplay/loop/muted video `b76f0f3e99f443ecbd95ecfcb9b844d9.mp4` with poster thumbnail

### 3. Features grid — 3 columns (icon row cards)

1. **ACO / HACCP Certified** — Programs & documentation available on request.
2. **Container Imports** — Reliable global lanes into Melbourne.
3. **Price Advantage** — Bulk & contract pricing for 100kg+ orders.

### 4. Media with text (image left `image-ship.png`, content right, sunken band)

- H2: Freight & Logistics — Done For You
- P: We coordinate origin pick-ups, ocean freight, customs, and final delivery. You'll get regular status updates and a clear ETA so your planning stays on track.
- Check items:
  - **Container & LCL Options** to match your volumes
  - **Quality Control Checks** on arrival in Melbourne
  - **Supplier Due-Diligence** and document verification
  - **Consolidation Services** of teas, herbs, spices & functional ingredients

### 5. Features grid — 2 columns (check icon cards)

- H2: What You Can Import With Us
- P: We source across a wide network to meet your price, quality and lead-time targets.

1. **Tea Varieties** — Black, green, white, oolong, match & specialty teas
2. **Botanicals & Herbs** — Functional botanicals, herbs, spices & natural sweeteners
3. **Organic Options** — Organic options & documentation (ACO) available
4. **Custom Solutions** — Private-label packing & custom blends on request

### 6. Media with accordion (image left `ship.avif`, numbered accordion right)

- H2: Why Choose Teavision for Your Imported Tea Needs?

1. **Global Reach, Local Reliability** — We manage end-to-end importing, handling everything from timely container shipments to customs inspections out of our Melbourne warehouse. You'll enjoy smooth delivery and peace of mind at every step.
2. **Superior Product Quality** — When products arrive, we conduct meticulous quality checks to ensure freshness, accuracy, and pristine packaging — so you only receive the very best.
3. **Wide Selection, One Partner** — Beyond tea, we import bulk herbs, spices, and natural sweeteners — providing a versatile product range under one trusted supplier.
4. **Cost-Effective & Convenient** — Working with us means cutting out unnecessary steps. Say goodbye to supply delays, unreliable packaging, or questionable documentation, and enjoy streamlined importing that saves time and resources.
5. **Expertise You Can Count On** — With deep experience in international sourcing and logistics, we speak the language of importers — so you don't have to.

### 7. Process steps — "How It Works" (5 numbered cards; horizontal swiper on mobile)

1. **Get in Touch** — Contact our team for pricing and shipment options.
2. **Confirm Shipment Options** — We'll recommend suitable container sizes and logistics based on your forecast.
3. **Approve Scheduling & Pricing** — Finalise delivery timelines and pricing structures tailored to your goals.
4. **Product Arrival & Inspection** — We receive your shipment in Melbourne, assess quality, and prepare for dispatch.
5. **Order Fulfillment** — Your imported products are now ready for sale, blending, or fulfillment.

### 8. FAQ

- H2: Frequently asked questions
- P: You may have questions about sourcing wholesale tea, tea bags, and bulk spices. Below are answers to some of the most common queries from our partners.

1. **What types of products do you import?** — We import a broad range of items including teas, herbs, spices, and natural sweeteners, curated for Australian businesses.
2. **Are you a direct importer?** — Yes. We arrange international shipments directly to our Melbourne warehouse, ensuring control, speed, and transparency throughout the process.
3. **How do you ensure product quality?** — Upon arrival, every shipment undergoes thorough inspection, covering freshness, packaging integrity, and adherence to order specifications.
4. **Can you import in custom container sizes?** — Absolutely. We coordinate full or partial container shipments to match your business volume and delivery preferences.
5. **Do you support smaller-volume businesses?** — Yes — we tailor our services to accommodate businesses of all sizes, from specialty retailers to large food producers.
6. **How can I begin importing with you?** — Just reach out to our team with your product interests. We'll walk you through options, pricing, and timelines every step of the way.

### 9. CTA banner (centered, light band, green heading)

- H2: Ready to Get Started?
- P: Contact us today to discover how we can elevate your product offerings with global, high-quality tea and ingredients.
- Primary button: "Apply Now - Wholesale Account" → `/pages/wholesale-account-request`
- Secondary button (phone icon): "Call 1300 729 617" → `tel:+611300729617`

### 10. Need-help contact section

- Reuse the shared contact section component ("Need help? Speak with our Ingredients Experts Today." form).

## Notes

- Production also injects a Searchanise recommendations slot before the need-help section — optional, follow existing site patterns.
- Outbound link targets reference production pages (`wholesale-account-request`, `appi-compliance`) — keep as-is (relative paths) even if those routes are not yet built locally.
