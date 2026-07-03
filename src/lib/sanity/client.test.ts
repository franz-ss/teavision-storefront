import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createClient } from 'next-sanity'

import {
  getSanityClient,
  getSanityDraftClient,
  sanityDraftFetch,
  sanityFetch,
} from './client'

const { clientFetchMock } = vi.hoisted(() => ({
  clientFetchMock: vi.fn(),
}))

vi.mock('server-only', () => ({}))

vi.mock('next-sanity', () => ({
  createClient: vi.fn(() => ({
    fetch: clientFetchMock,
  })),
}))

describe('Sanity client boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'teavision-project')
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'production')
    vi.stubEnv('NEXT_PUBLIC_SANITY_API_VERSION', '2026-05-28')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  test('creates the published client with published perspective and stega disabled', () => {
    vi.stubEnv('SANITY_API_READ_TOKEN', '  optional-read-token  ')

    const client = getSanityClient()

    expect(client).toEqual({ fetch: clientFetchMock })
    expect(createClient).toHaveBeenCalledWith({
      apiVersion: '2026-05-28',
      dataset: 'production',
      perspective: 'published',
      projectId: 'teavision-project',
      stega: false,
      token: 'optional-read-token',
      useCdn: false,
    })
  })

  test('creates the draft client with the required read token and drafts perspective', () => {
    vi.stubEnv('SANITY_API_READ_TOKEN', '  draft-read-token  ')

    const client = getSanityDraftClient()

    expect(client).toEqual({ fetch: clientFetchMock })
    expect(createClient).toHaveBeenCalledWith({
      apiVersion: '2026-05-28',
      dataset: 'production',
      perspective: 'drafts',
      projectId: 'teavision-project',
      stega: false,
      token: 'draft-read-token',
      useCdn: false,
    })
  })

  test('fails loudly before creating the draft client when the read token is missing', () => {
    vi.stubEnv('SANITY_API_READ_TOKEN', ' ')

    expect(() => getSanityDraftClient()).toThrow(/SANITY_API_READ_TOKEN/)
    expect(createClient).not.toHaveBeenCalled()
  })

  test('dispatches published and draft fetches through separately configured clients', async () => {
    vi.stubEnv('SANITY_API_READ_TOKEN', 'draft-read-token')
    clientFetchMock
      .mockResolvedValueOnce({ title: 'published homepage' })
      .mockResolvedValueOnce({ title: 'draft homepage' })

    const published = await sanityFetch<{ title: string }>('published query', {
      slug: '/',
    })
    const draft = await sanityDraftFetch<{ title: string }>('draft query', {
      slug: '/',
    })

    expect(published).toEqual({ title: 'published homepage' })
    expect(draft).toEqual({ title: 'draft homepage' })
    expect(createClient).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ perspective: 'published' }),
    )
    expect(createClient).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        perspective: 'drafts',
        token: 'draft-read-token',
      }),
    )
    expect(clientFetchMock).toHaveBeenNthCalledWith(1, 'published query', {
      slug: '/',
    })
    expect(clientFetchMock).toHaveBeenNthCalledWith(2, 'draft query', {
      slug: '/',
    })
  })
})
