import { describe, expect, test, vi } from 'vitest'

import { logEvent, type ObservabilityEventName } from './logger'
import {
  REDACTED_VALUE,
  hashIdentifier,
  redactRecord,
  redactText,
} from './redact'

describe('observability redaction', () => {
  test('removes customer email addresses from text', () => {
    const redacted = redactText('Email tea@example.com about the order.')

    expect(redacted).not.toContain('tea@example.com')
    expect(redacted).toContain(REDACTED_VALUE)
  })

  test('removes phone-like values from text', () => {
    const redacted = redactText('Phone 0412345678 when the carton arrives.')

    expect(redacted).not.toContain('0412345678')
    expect(redacted).toContain(REDACTED_VALUE)
  })

  test('removes customer account token values from text', () => {
    const redacted = redactText('token customer-access-token-abc')

    expect(redacted).not.toContain('customer-access-token-abc')
    expect(redacted).toContain(REDACTED_VALUE)
  })

  test('removes checkout URLs from text', () => {
    const redacted = redactText(
      'Continue at https://checkout.test/cart/fake-cart?key=secret',
    )

    expect(redacted).not.toContain(
      'https://checkout.test/cart/fake-cart?key=secret',
    )
    expect(redacted).toContain(REDACTED_VALUE)
  })

  test('removes submitted message body values by sensitive key', () => {
    const redacted = redactRecord({
      message: 'Please call me about a private order',
    })

    expect(JSON.stringify(redacted)).not.toContain(
      'Please call me about a private order',
    )
    expect(redacted.message).toBe(REDACTED_VALUE)
  })

  test('hashes identifiers with stable non-empty values', () => {
    const identifier = 'gid://shopify/Cart/123'
    const firstHash = hashIdentifier(identifier)
    const secondHash = hashIdentifier(identifier)

    expect(firstHash).toBe(secondHash)
    expect(firstHash).not.toBe('')
    expect(firstHash).not.toBe(identifier)
  })
})

describe('observability logger', () => {
  test('logs structured warning events with redacted context', () => {
    const consoleWarn = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined)

    try {
      logEvent('warn', 'searchanise_failed', { email: 'tea@example.com' })

      expect(consoleWarn).toHaveBeenCalledWith(
        '[observability]',
        expect.objectContaining({
          event: 'searchanise_failed',
          level: 'warn',
          context: {
            email: REDACTED_VALUE,
          },
        }),
      )
      expect(JSON.stringify(consoleWarn.mock.calls)).not.toContain(
        'tea@example.com',
      )
    } finally {
      consoleWarn.mockRestore()
    }
  })

  test('logs account failure events without raw checkout URL, token, or email', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    try {
      logEvent('error', 'customer_account_failed', {
        checkoutUrl: 'https://checkout.test/cart/fake-cart?key=secret',
        email: 'tea@example.com',
        token: 'customer-access-token-abc',
      })

      const calls = JSON.stringify(consoleError.mock.calls)

      expect(calls).not.toContain(
        'https://checkout.test/cart/fake-cart?key=secret',
      )
      expect(calls).not.toContain('customer-access-token-abc')
      expect(calls).not.toContain('tea@example.com')
      expect(calls).toContain(REDACTED_VALUE)
    } finally {
      consoleError.mockRestore()
    }
  })

  test('accepts provider and webhook event names with redacted sensitive fields', () => {
    const consoleWarn = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined)
    const providerEvents: ObservabilityEventName[] = [
      'shopify_storefront_failed',
      'customer_account_failed',
      'sanity_failed',
      'searchanise_failed',
      'trustoo_failed',
      'hulkapps_failed',
      'contact_provider_failed',
      'shopify_webhook_received',
      'shopify_webhook_rejected',
      'sanity_webhook_received',
      'sanity_webhook_rejected',
    ]

    try {
      providerEvents.forEach((eventName) => {
        logEvent('warn', eventName, {
          body: { email: 'tea@example.com' },
          email: 'tea@example.com',
          message: 'Please call me about a private order',
          payload: { token: 'customer-access-token-abc' },
          token: 'customer-access-token-abc',
        })
      })

      const calls = JSON.stringify(consoleWarn.mock.calls)

      expect(consoleWarn).toHaveBeenCalledTimes(providerEvents.length)
      expect(calls).not.toContain('tea@example.com')
      expect(calls).not.toContain('customer-access-token-abc')
      expect(calls).not.toContain('Please call me about a private order')
      expect(calls).toContain(REDACTED_VALUE)
    } finally {
      consoleWarn.mockRestore()
    }
  })
})
