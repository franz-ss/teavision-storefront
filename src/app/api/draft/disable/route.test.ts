import { beforeEach, describe, expect, test, vi } from 'vitest'

import { GET } from './route'

const { disableMock, draftModeMock } = vi.hoisted(() => ({
  disableMock: vi.fn(),
  draftModeMock: vi.fn(),
}))

vi.mock('next/headers', () => ({
  draftMode: draftModeMock,
}))

describe('draft disable route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    draftModeMock.mockResolvedValue({ disable: disableMock })
  })

  test('disables Draft Mode and redirects to the homepage', async () => {
    const response = await GET(
      new Request('https://teavision.test/api/draft/disable'),
    )

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('https://teavision.test/')
    expect(draftModeMock).toHaveBeenCalledTimes(1)
    expect(disableMock).toHaveBeenCalledTimes(1)
  })
})
