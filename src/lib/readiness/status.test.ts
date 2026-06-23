import { describe, expect, it } from 'vitest'

import {
  isOwnerGateStatus,
  makePublicHealthPayload,
  summarizeReadiness,
  type ReadinessCheck,
} from './status'

describe('readiness status helpers', () => {
  it('creates a safe public health payload with exact public keys', () => {
    const payload = makePublicHealthPayload({
      release: 'abc123',
      now: new Date('2026-06-23T06:00:00.000Z'),
    })

    expect(Object.keys(payload).sort()).toEqual(['release', 'service', 'status', 'timestamp'])
    expect(payload).toEqual({
      status: 'ok',
      service: 'teavision-storefront',
      release: 'abc123',
      timestamp: '2026-06-23T06:00:00.000Z',
    })
  })

  it('summarizes blocked checks before degraded or ok checks', () => {
    const checks: ReadinessCheck[] = [
      {
        id: 'shopify-env',
        label: 'Shopify config',
        status: 'ok',
        detail: 'present',
      },
      {
        id: 'account-config',
        label: 'Customer Account config',
        status: 'blocked',
        detail: 'missing launch config',
      },
      {
        id: 'analytics-mode',
        label: 'Analytics mode',
        status: 'degraded',
        detail: 'fake sink documented',
      },
    ]

    expect(summarizeReadiness(checks)).toBe('blocked')
  })

  it('summarizes degraded checks when none are blocked', () => {
    expect(
      summarizeReadiness([
        {
          id: 'indexing',
          label: 'Indexing mode',
          status: 'degraded',
          detail: 'launch evidence pending',
        },
        {
          id: 'security-probe',
          label: 'Security probe',
          status: 'ok',
          detail: 'script present',
        },
      ]),
    ).toBe('degraded')
  })

  it('summarizes all ok checks as ok', () => {
    expect(
      summarizeReadiness([
        {
          id: 'security-probe',
          label: 'Security probe',
          status: 'ok',
          detail: 'script present',
        },
      ]),
    ).toBe('ok')
  })

  it('accepts only supported owner-gated readiness states', () => {
    expect(isOwnerGateStatus('approved')).toBe(true)
    expect(isOwnerGateStatus('pending')).toBe(true)
    expect(isOwnerGateStatus('owner-blocked')).toBe(true)
    expect(isOwnerGateStatus('blocked')).toBe(false)
    expect(isOwnerGateStatus('degraded')).toBe(false)
    expect(isOwnerGateStatus('')).toBe(false)
  })
})
