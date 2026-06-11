import { describe, expect, test, vi } from 'vitest'

import { sendWholesaleAccountAction } from './actions'

const { resendSendMock } = vi.hoisted(() => ({
  resendSendMock: vi.fn(async () => ({ error: null })),
}))

vi.mock('server-only', () => ({}))

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers({ 'x-forwarded-for': '127.0.0.1' })),
}))

vi.mock('resend', () => ({
  Resend: vi.fn(function Resend() {
    return {
      emails: {
        send: resendSendMock,
      },
    }
  }),
}))

vi.mock('@/lib/env/server', () => ({
  getResendApiKey: vi.fn(() => 're_test'),
  shouldWarnAboutRateLimitMemoryFallback: vi.fn(() => false),
}))

function formData(fields: Record<string, string>): FormData {
  const data = new FormData()

  Object.entries(fields).forEach(([key, value]) => {
    data.set(key, value)
  })

  return data
}

const VALID_WHOLESALE_SUBMISSION = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  phone: '0400000000',
  email: 'ada@example.com',
  company: 'Analytical Tea Co',
  productList: 'Organic green tea, peppermint, chamomile',
  annualVolumeKg: '250kg per year',
  startPurchasing: 'Immediately',
  website: '',
}

describe('sendWholesaleAccountAction', () => {
  test('accepts a valid wholesale account request', async () => {
    const result = await sendWholesaleAccountAction(
      formData(VALID_WHOLESALE_SUBMISSION),
    )

    expect(result.success).toBe(true)
    expect(resendSendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'New Teavision wholesale account request',
        replyTo: 'ada@example.com',
        text: expect.stringContaining('Company / business name: Analytical Tea Co'),
      }),
    )
  })

  test('rejects a request without the required business details', async () => {
    const result = await sendWholesaleAccountAction(
      formData({
        ...VALID_WHOLESALE_SUBMISSION,
        company: '',
      }),
    )

    expect(result).toEqual({
      success: false,
      error: 'Please fill in all required fields.',
    })
  })

  test('rejects an unknown purchasing timeframe option', async () => {
    const result = await sendWholesaleAccountAction(
      formData({
        ...VALID_WHOLESALE_SUBMISSION,
        startPurchasing: 'Eventually, maybe',
      }),
    )

    expect(result).toEqual({
      success: false,
      error: 'Please fill in all required fields.',
    })
  })
})
