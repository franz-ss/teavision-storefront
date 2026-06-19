# Customer Accounts Setup And Launch Readiness

Phase 14 uses Shopify's modern Customer Account API for OAuth sign-in, protected customer data, account pages, cart buyer identity sync, and checkout handoff preparation. This checklist is for operators and developers configuring the Shopify dev or production store.

## Required Shopify Admin Setup

- Enable Shopify customer accounts for the store.
- Install and configure the Headless or Hydrogen sales channel that exposes Customer Account API credentials.
- Create or confirm the Customer Account API client used by this storefront.
- Configure the callback URL to match `SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI`.
- Configure the logout redirect URL to match `SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_REDIRECT_URI`.
- Confirm protected customer data access covers the customer, address, and order fields rendered by `/account`.
- Keep `https://mrtea.com.au/account/login` retired for this storefront unless the owner explicitly decides Teavision and Mr Tea accounts are separate.

## Environment Variables

Server-side Customer Account variables:

```bash
SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID=
SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET=
SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI=
SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_REDIRECT_URI=
```

Automated fake-server tests may also set:

```bash
SHOPIFY_CUSTOMER_ACCOUNT_TEST_MODE=true
SHOPIFY_CUSTOMER_ACCOUNT_TEST_URL=http://127.0.0.1:<port>
```

Do not expose Customer Account credentials, access tokens, refresh tokens, ID tokens, or real customer examples through `NEXT_PUBLIC_*`, Storybook args, browser props, logs, analytics, or screenshots.

## Local HTTPS OAuth Testing

Shopify Customer Account OAuth requires a public HTTPS callback. Localhost callback URLs are not enough for live OAuth. Use an HTTPS tunnel for manual OAuth testing, then configure the tunneled callback and logout URLs in Shopify admin before starting the flow.

Keep the local fake Customer Account API for automated unit, integration, Storybook, and Playwright coverage. The fake endpoint must stay local and must only be enabled with `SHOPIFY_CUSTOMER_ACCOUNT_TEST_MODE=true`.

## Protected Customer Data Access

Before launch, verify the Shopify admin protected customer data access covers:

- Customer email, name, and phone fields used in the dashboard and profile pages.
- Mailing address fields used in address book and address forms.
- Order history, order details, line items, totals, financial status, fulfillment status, shipping address, and tracking fields.

If access is missing, account pages should fail closed with operator-facing setup guidance rather than serving stubbed customer data.

## Automated Test Boundary

Automated tests may cover OAuth helpers, fake OAuth discovery/token exchange, protected route handling, account UI states, address/profile Server Actions, cart buyer identity sync, and fake checkout URL handoff.

Automated tests must stop at the fake checkout URL such as `https://checkout.test/`. They must not load or submit Shopify hosted checkout.

## Manual Approval Gate

Real Shopify hosted checkout, payment, shipping-rate, tax, order creation, and success redirect tests are blocked until the store owner explicitly approves checkout testing.

After approval, run those tests only against the approved Shopify dev store or production-safe test boundary, using test products/payment methods approved by the owner. Record the approval, date, tester, store, and exact scenarios before any live checkout attempt.

## Reorder Parity

Reorder remains deferred unless a future implementation uses authoritative Shopify cart actions, current variant availability, and no price promises.

A future reorder flow must re-check each line against current Shopify variant availability before adding items to cart. It must not replay old prices, promise historical discounts, or bypass cart Server Actions.

## B2B And Customer Pricing Parity

B2B and customer-specific pricing parity is Shopify-admin-dependent and checkout/cart-authoritative.

The headless UI must not calculate or promise client-side customer-specific prices. If Shopify B2B, company location, catalogs, or customer context affects pricing, that authority must come from Shopify cart or checkout data returned for the signed-in customer.

## Launch Checklist

- Shopify customer accounts are enabled.
- Headless or Hydrogen sales channel credentials are configured.
- `SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID` is set server-side.
- `SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET` is set server-side with a strong secret.
- Callback and logout URLs match Shopify admin configuration.
- HTTPS tunnel callback/logout URLs are configured for live local OAuth tests.
- Protected customer data access covers account, address, and order fields.
- Header account icon and footer Login route point to `/account`.
- Legacy account routes show the modern Shopify sign-in bridge and no password forms.
- Cart checkout handoff is covered by fake-Shopify tests only.
- Store-owner approval is recorded before any real hosted checkout testing.
