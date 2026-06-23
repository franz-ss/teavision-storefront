# Cart and Checkout Hosted UAT

Status: blocked until Shopify dev store setup is complete.

Do not execute this checklist against production. Do not run hosted checkout, payment, tax, shipping-rate, order-creation, or success-redirect testing until the Shopify dev store is configured, test payments are safe, and the store owner explicitly approves checkout testing.

## Scope

This checklist covers Shopify-hosted checkout behavior that the Next.js storefront does not own:

- Customer information validation
- Shipping address validation
- Billing address validation
- Shipping method selection
- Payment method selection
- Hosted order summary calculations
- Tax and shipping calculations
- Test order creation
- Payment success and failure recovery
- Success or thank-you state

Local automated tests cover only cart behavior and the `cart.checkoutUrl` handoff.
Local production e2e evidence and its fake-provider boundary are recorded in
`docs/launch/production-e2e-evidence.md`.

## Preconditions

- Shopify dev store exists.
- Production data needed for testing has been copied or recreated safely.
- Test payments are enabled through Shopify Payments test mode or Bogus Gateway.
- Production payment credentials are not present.
- Production fulfilment, analytics, email, SMS, ERP, and shipping-label integrations are disabled or sandboxed.
- The Next.js environment points at the dev store.
- The store owner has explicitly approved hosted checkout testing.

## Test Data

Products:

- In-stock standard product
- Multi-variant product
- Low-stock product
- Out-of-stock product
- Discount-eligible product
- Discount-excluded product
- Heavy or bulky product that affects shipping

Discounts:

- `TEST10`
- `TEST-FREESHIP`
- `TEST-MIN-SPEND`
- `TEST-EXPIRED`

Customers:

- Guest checkout email
- Existing test customer email
- Wholesale-style test customer email if relevant

Addresses:

- Valid domestic address
- Valid regional address
- Valid international address if enabled
- Invalid postcode/address combination
- Missing required fields

## Checklist

### Cart To Checkout Handoff

- Add a standard product to cart from the PDP.
- Confirm cart subtotal and discount display in the storefront.
- Select Checkout.
- Confirm the browser enters the dev Shopify checkout, not production.
- Confirm the checkout order summary contains the same products and quantities.
- Confirm cart subtotal and discounts match before shipping and tax.

### Customer Information

- Submit checkout with missing required contact information.
- Confirm Shopify blocks progress and shows clear validation.
- Submit checkout with a valid test email.
- Confirm progress to shipping address.

### Shipping Address

- Submit an incomplete address.
- Confirm Shopify blocks progress and highlights required fields.
- Submit a valid domestic address.
- Confirm progress to shipping method.
- Submit an unsupported address if applicable.
- Confirm Shopify shows a safe no-rate or unsupported-address state.

### Shipping Method

- Confirm expected shipping methods are shown for the valid test address.
- Confirm free-shipping discount behavior when `TEST-FREESHIP` is applied.
- Confirm heavy or bulky product rates if configured.

### Billing Address

- Complete checkout with billing same as shipping.
- Complete checkout with a different billing address.
- Confirm both paths preserve order summary totals.

### Payment

- Use only Shopify-approved test payment details.
- Confirm successful test payment creates a test order.
- Confirm declined test payment shows a recoverable error.
- Retry after a declined payment and confirm recovery works.

### Success State

- Confirm the success or thank-you page appears after successful payment.
- Confirm order number is visible.
- Confirm no production fulfilment, email, SMS, analytics, or ERP side effects occur.

## Evidence To Capture

- Dev store URL.
- Next.js environment URL.
- Test product handles.
- Discount codes used.
- Shipping addresses used.
- Payment test type.
- Order number for successful test order.
- Screenshots or notes for failures.

## Residual Risks

- Local automated tests cannot prove hosted Shopify checkout, tax, shipping, or payment behavior.
- Dev store settings can drift from production.
- App integrations may behave differently in sandbox or dev-store mode.
- The current storefront has no cart discount-code entry; discount-code behavior is checkout-only unless a separate feature adds cart-level discount mutations.
