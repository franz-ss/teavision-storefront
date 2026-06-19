import { beforeEach, describe, expect, test, vi } from 'vitest'

import { requireAccountSessionForPath } from './protection'

const cookieState = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => cookieState),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`redirect:${url}`)
  }),
}))

describe('account route protection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('SHOPIFY_CUSTOMER_ACCOUNT_TEST_MODE', 'true')
    vi.stubEnv(
      'SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET',
      'test-session-secret-with-at-least-32-characters',
    )
  })

  test('unauthenticated /account redirects to login with return path', async () => {
    await expect(requireAccountSessionForPath('/account')).rejects.toThrow(
      'redirect:/account/login?returnTo=%2Faccount',
    )
  })
})
