# Shopify Dev Store Copy Manual

Last reviewed: June 2026

This manual explains how to create a Shopify development store that is close enough to the production Teavision store for safe cart and checkout testing.

It is not a perfect one-click clone. Shopify supports backing up and duplicating parts of a store with CSV exports, theme downloads, and manual configuration, but some production data and settings cannot be transferred directly through the Shopify admin.

## Goal

Create a non-production Shopify store that can be connected to this Next.js storefront with its own `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.

Use it to test:

- Product listing and product detail data
- Variant selection
- Add to cart, remove from cart, and quantity changes
- Discount and promotion behavior
- Inventory validation
- Shipping rates
- Tax calculation
- Checkout handoff
- Test payments and failed payment scenarios

Do not use it for real customer purchases.

## Recommended Approach

Use this setup:

- A Shopify dev store created from the Shopify Dev Dashboard or Partner Dashboard
- Production product data copied by CSV
- Production theme copied by theme download/upload if theme parity is needed
- Store settings, markets, taxes, checkout, payments, shipping, apps, and navigation copied manually
- Test payments only, using Shopify Payments test mode or Shopify's Bogus Gateway
- A separate Storefront API token for this storefront project

If Teavision has Shopify Plus organization features that provide staging stores or store-copy tooling, use those instead of a standard Partner dev store. The remaining parity, safety, and validation checklists still apply.

## Safety Rules

Before copying anything, agree on these rules:

- Never connect the dev store to the production domain.
- Never use production payment credentials.
- Never enable real payment processing in the dev store.
- Never copy real customers unless there is a specific test need and the data is anonymized or approved.
- Never copy production order history for checkout testing.
- Disable or sandbox email, SMS, analytics, fulfilment, shipping label, ERP, review, loyalty, subscription, and marketing integrations.
- Use obvious test names such as `Teavision Dev Store` and `TEST ORDER`.
- Keep the dev store password protected.
- Keep test credentials out of the repository.

## What Copies Cleanly

These usually copy well:

- Products
- Product variants
- Product prices
- Product tags
- Product images, if the CSV image URLs remain public
- Some product metafields
- Customers, if exported and imported by CSV
- Theme code, when downloaded and uploaded as a theme zip

## What Requires Manual Work

Expect to recreate or manually verify:

- Store settings
- Checkout settings
- Shipping profiles
- Tax settings
- Markets and international pricing behavior
- Payment settings
- Discount codes
- Gift card balances
- Apps and app configuration
- Navigation menus
- Pages
- Blog posts
- Files in Content > Files
- Smart collection rules
- Custom data definitions
- Metaobjects
- Webhooks
- Analytics and pixels

Shopify's own duplication guidance calls out that some store information can be moved with CSV files, while other settings must be re-entered manually.

## Step 1: Create The Dev Store

1. Log in to the Shopify Dev Dashboard or Partner Dashboard.
2. Open Stores.
3. Choose Create store.
4. Choose a development store when the option is available.
5. Name it clearly, for example `Teavision Dev Checkout Testing`.
6. Pick the closest available plan/features to production.
7. Avoid feature previews unless a specific production feature requires them.
8. Create the store and log in.

Record these values somewhere secure:

- Dev store admin URL
- Dev store `.myshopify.com` domain
- Store owner account
- Staff accounts
- Purpose of the store
- Date created

## Step 2: Lock The Store Down

In the dev store admin:

1. Keep the password page enabled.
2. Do not connect the production domain.
3. Do not add production payment credentials.
4. Disable customer-facing email/SMS automations where possible.
5. Disable live fulfilment, ERP, and shipping label integrations.
6. Disable analytics pixels unless testing them intentionally.
7. Add only the staff members who need testing access.

The dev store should be safe even if someone accidentally reaches its storefront.

## Step 3: Copy The Theme

This project is a headless Next.js storefront, so the Shopify theme is not the primary customer-facing storefront. Still copy it if checkout branding, password page, app blocks, or Shopify-hosted pages need parity.

From production:

1. Go to Online Store > Themes.
2. Open the actions menu for the current production theme.
3. Choose Download theme file.
4. Wait for the theme zip email.

In the dev store:

1. Go to Online Store > Themes.
2. Upload the theme zip.
3. Keep it unpublished until checked.
4. Verify checkout branding, app embeds, theme settings, and password page behavior.

Important: Shopify theme downloads do not include products, collections, menus, pages, blog posts, images, or files. Those must be copied separately.

## Step 4: Copy Products And Variants

From production:

1. Go to Products.
2. Export products as CSV.
3. Keep an untouched backup copy of the export.
4. Make a working copy for the dev-store import.

Before importing:

- Do not sort the CSV in a way that separates products from their image rows.
- Keep the current Shopify column format.
- Preserve URL handles.
- Preserve option columns for variants.
- Confirm product image URLs are public and still valid.
- Confirm product metafield columns needed by the storefront are included.

In the dev store:

1. Go to Products.
2. Import the product CSV.
3. Review import errors.
4. Spot-check important products, variants, prices, tags, images, SEO fields, metafields, and availability.

For cart and checkout testing, create a small group of known test products:

- A normal in-stock product
- A product with multiple variants
- A low-stock product
- An out-of-stock product
- A product that allows overselling, if production uses that behavior
- A product eligible for discounts
- A product excluded from discounts
- A bulky or heavy product that affects shipping
- A product with compare-at pricing

## Step 5: Copy Collections

Product CSV import can help create a manual collection through a `Collection` column, but it does not fully recreate every collection setup.

For each important production collection:

1. Recreate the collection in the dev store.
2. Match the handle.
3. Match manual products or automatic collection rules.
4. Match SEO title and description.
5. Match collection image.
6. Verify the collection is available to the storefront sales channel.

Prioritize collections used by the storefront navigation and homepage.

## Step 6: Copy Content Needed By The Storefront

Review this codebase's Shopify queries before deciding how much content to copy. For cart and checkout testing, products and collections matter most, but the storefront can also depend on content.

Copy or recreate:

- Pages
- Blog posts
- Navigation menus
- Files used by theme or content
- Metaobjects
- Metafield definitions
- Product, variant, collection, and shop metafields

If content is only needed for visual parity, copy a representative subset. If content is queried by this Next.js storefront, copy the exact records and handles.

## Step 7: Copy Customers Only If Needed

For checkout testing, prefer synthetic test customers instead of production customers.

Create test customers such as:

- `test.customer+checkout@teavision.example`
- `test.customer+discounts@teavision.example`
- `test.customer+wholesale@teavision.example`

If customer data must be copied:

1. Export customers from production.
2. Remove or anonymize personal data unless there is a clear approved need.
3. Import the CSV into the dev store.
4. Do not expect customer passwords or order history to copy through CSV.

Shopify customer CSV imports cannot migrate passwords, and customer CSV files do not import order information.

## Step 8: Recreate Discounts And Promotions

Shopify's store duplication guidance says discount codes cannot be transferred directly.

Recreate only the discounts needed for testing:

- Percentage discount
- Fixed amount discount
- Free shipping discount
- Minimum spend discount
- Product-specific discount
- Collection-specific discount
- Expired discount
- Usage-limited discount
- Customer-segment discount, if relevant

Use obvious test names:

- `TEST10`
- `TEST-FREESHIP`
- `TEST-MIN-SPEND`
- `TEST-EXPIRED`
- `TEST-EXCLUDED-PRODUCT`

Verify the discount appears correctly in the Shopify cart and checkout responses used by the storefront.

## Step 9: Recreate Shipping And Tax Settings

In the dev store, manually configure:

- Store address
- Markets and currencies
- Shipping zones
- Shipping profiles
- Carrier-calculated rates, if production depends on them
- Local pickup or delivery options, if production uses them
- Tax registrations and overrides
- Product tax categories

Create test addresses for expected checkout regions:

- Local domestic address
- Interstate address
- Remote regional address
- International address, if Teavision sells internationally
- Invalid or incomplete address

Record expected shipping and tax outcomes so testers can identify regressions quickly.

## Step 10: Configure Test Payments

Use either Shopify Payments test mode or Shopify's Bogus Gateway.

For most checkout testing:

1. Go to Settings > Payments in the dev store.
2. Enable Shopify Payments test mode if available and appropriate.
3. Otherwise activate Shopify's Bogus Gateway.
4. Confirm real credit cards are not accepted.
5. Place test orders only.

Test these payment outcomes:

- Successful payment
- Declined payment
- Failed payment recovery
- Checkout abandonment and retry
- Order confirmation redirect
- Returning to cart after checkout failure

Do not enable test mode on the production store.

## Step 11: Reinstall Apps Carefully

Install only apps needed for the test objective.

For each app:

1. Confirm whether the app supports dev stores.
2. Confirm whether it has a sandbox mode.
3. Use dev or sandbox API keys.
4. Disable production webhooks.
5. Disable production email/SMS sends.
6. Disable live fulfilment or fulfilment holds.
7. Document any setting that differs from production.

High-risk app categories:

- Payments
- Subscriptions
- Loyalty and rewards
- Reviews
- Email and SMS marketing
- Analytics and pixels
- Search and merchandising
- Fulfilment and ERP
- Shipping labels
- Fraud tools

If an app cannot be safely sandboxed, leave it disabled and document the resulting testing limitation.

## Step 12: Create Storefront API Access

This codebase reads Shopify data through the Storefront GraphQL API.

In the dev store:

1. Install or configure the Headless sales channel if that is how the production token is managed.
2. Create a storefront for this Next.js app.
3. Copy the public Storefront API access token.
4. Ensure the token has the unauthenticated access scopes needed by the storefront.

At minimum, this project needs access for:

- Products and collections
- Cart interaction
- Checkout initiation
- Content, if pages/blogs are queried
- Metaobjects and metafields, if queried by storefront features
- Product inventory, if inventory is rendered or validated through Storefront API responses

Update local environment variables:

```bash
SHOPIFY_STORE_DOMAIN=your-dev-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-dev-storefront-token
```

Then run:

```bash
pnpm codegen
pnpm dev
```

Use a separate `.env.local` or local-only environment configuration. Do not commit secrets.

## Step 13: Validate Store Parity

Before using the dev store for serious testing, run this checklist.

Products:

- Key product handles match production.
- Key variant titles and option names match production.
- Variant IDs are dev-store IDs and are not copied into code.
- Prices match expected test values.
- Compare-at prices match where needed.
- Product images load.
- Important metafields exist.
- Inventory states are intentional.

Collections:

- Key collection handles match production.
- Automatic collection rules are correct.
- Manual collection membership is correct.
- Collection pages return products through the Storefront API.

Cart:

- Cart can be created.
- Item can be added.
- Variant selection adds the correct variant.
- Quantity can be increased and decreased.
- Item can be removed.
- Empty cart state works.
- Invalid or stale cart ID recovers cleanly.
- Discounts appear correctly.
- Cart total matches Shopify.

Checkout:

- Checkout URL is created from cart.
- Customer information validates correctly.
- Shipping address validates correctly.
- Shipping methods appear as expected.
- Taxes appear as expected.
- Test payment success creates a test order.
- Test payment failure shows recoverable errors.
- Success redirect works.
- Returning from checkout does not corrupt cart state.

Integrations:

- No production email or SMS sends occur.
- No production fulfilment actions occur.
- No production analytics pollution occurs.
- No production webhooks receive dev events.

## Step 14: Connect Deployment Environments

For local development, use `.env.local`.

For hosted preview or staging deployments:

1. Create a dedicated deployment environment in the hosting provider.
2. Set `SHOPIFY_STORE_DOMAIN` to the dev store domain.
3. Set `SHOPIFY_STOREFRONT_ACCESS_TOKEN` to the dev token.
4. Confirm no production Shopify credentials are present.
5. Trigger a preview deployment.
6. Run the cart and checkout validation checklist against the preview URL.

Never point a public production deployment at the dev store unless intentionally testing a maintenance or failover scenario.

## Ongoing Sync Process

Use this whenever production changes and the dev store needs to be refreshed.

1. Export products from production.
2. Save the raw export as a dated backup.
3. Import into dev store.
4. Re-check collections and metafields.
5. Recreate any new discounts needed for tests.
6. Review app settings for drift.
7. Re-run the parity checklist.
8. Update this manual if the workflow changes.

Suggested naming:

```text
shopify-exports/
|-- 2026-06-04-production-products.csv
|-- 2026-06-04-production-customers-anonymized.csv
`-- 2026-06-04-dev-sync-notes.md
```

Do not commit exported production data to this repository.

## Minimum Test Dataset

Keep a small, intentional fixture set in the dev store.

Products:

- `test-standard-tea`
- `test-variant-tea`
- `test-low-stock-tea`
- `test-out-of-stock-tea`
- `test-heavy-shipping-tea`
- `test-discount-eligible-tea`
- `test-discount-excluded-tea`

Discounts:

- `TEST10`
- `TEST-FREESHIP`
- `TEST-MIN-SPEND`
- `TEST-EXPIRED`

Customers:

- `test.customer+guest@teavision.example`
- `test.customer+account@teavision.example`
- `test.customer+wholesale@teavision.example`

Addresses:

- Valid domestic address
- Valid regional address
- Valid international address
- Invalid postcode/address combination
- Missing required fields

Payment:

- Successful test payment
- Declined test payment
- Failed payment requiring retry

## Troubleshooting

Product images do not load:

- Confirm image URLs in the CSV are public.
- Confirm the production source images still exist.
- Re-upload images to Content > Files or directly to products.

Variants changed unexpectedly:

- Check whether option columns were edited or omitted.
- Shopify warns that changing option values can create new variant IDs.
- Never hard-code variant IDs from production.

Products are missing from collections:

- Recreate automatic collection rules.
- Add the `Collection` column for simple manual collection import cases.
- Confirm products are published to the right sales channel.

Discount does not apply:

- Recreate the discount manually in the dev store.
- Confirm product, collection, customer, usage, date, and minimum-spend rules.
- Confirm the discount is valid for the checkout channel being tested.

Checkout cannot take payment:

- Confirm Bogus Gateway or Shopify Payments test mode is active.
- Confirm no real payment provider is configured.
- Confirm the order total is high enough for the test gateway.

Storefront API returns missing fields:

- Confirm the dev Storefront API token has the required unauthenticated scopes.
- Confirm metafield definitions and values exist in the dev store.
- Confirm the queried records are published to the storefront channel.
- Re-run `pnpm codegen` if the schema or queried fields changed.

## Source References

- Shopify Help Center: Backups and duplication: https://help.shopify.com/en/manual/shopify-admin/duplicate-store
- Shopify.dev: Dev stores: https://shopify.dev/docs/apps/build/dev-dashboard/stores/development-stores
- Shopify Help Center: Product CSV import/export: https://help.shopify.com/en/manual/products/import-export/using-csv
- Shopify Help Center: Downloading themes: https://help.shopify.com/en/manual/online-store/themes/managing-themes/downloading-themes
- Shopify Help Center: Customer CSV import/export: https://help.shopify.com/en/manual/customers/import-export-customers
- Shopify Help Center: Activating a payment gateway in test mode: https://help.shopify.com/en/manual/checkout-settings/test-orders/payments-test-mode
- Shopify.dev: Storefront API access scopes: https://shopify.dev/docs/api/usage/access-scopes
