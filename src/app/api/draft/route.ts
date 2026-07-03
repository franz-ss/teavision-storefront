import { timingSafeEqual } from 'crypto'

import { draftMode } from 'next/headers'

import { logEvent } from '@/lib/observability/logger'
import { getSanityPreviewSecret } from '@/lib/sanity/env'
import { getDraftHomepage } from '@/lib/sanity/home-page'

const HOMEPAGE_SLUG = '/'
const MIN_PREVIEW_SECRET_LENGTH = 32

function jsonError(error: string, status: number): Response {
  return Response.json({ error }, { status })
}

function isValidPreviewSecret(
  candidateSecret: string | null,
  expectedSecret: string,
): boolean {
  if (!candidateSecret) return false

  const candidate = Buffer.from(candidateSecret)
  const expected = Buffer.from(expectedSecret)

  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  )
}

function isHomepageSlug(slug: string | null): slug is typeof HOMEPAGE_SLUG {
  return slug === HOMEPAGE_SLUG
}

export async function GET(request: Request): Promise<Response> {
  let expectedSecret: string
  try {
    expectedSecret = getSanityPreviewSecret()
  } catch {
    logEvent('error', 'draft_preview_rejected', {
      reason: 'missing-secret',
    })

    return jsonError('Preview secret not configured', 500)
  }

  if (expectedSecret.length < MIN_PREVIEW_SECRET_LENGTH) {
    logEvent('error', 'draft_preview_rejected', {
      reason: 'short-secret',
    })

    return jsonError('Preview secret not configured', 500)
  }

  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')
  const slug = url.searchParams.get('slug')

  if (!isValidPreviewSecret(secret, expectedSecret)) {
    logEvent('warn', 'draft_preview_rejected', {
      reason: 'invalid-secret',
      slugAllowed: isHomepageSlug(slug),
    })

    return jsonError('Invalid preview secret', 401)
  }

  if (!isHomepageSlug(slug)) {
    logEvent('warn', 'draft_preview_rejected', {
      reason: 'invalid-slug',
      slugPresent: Boolean(slug),
    })

    return jsonError('Invalid preview slug', 400)
  }

  try {
    await getDraftHomepage()
  } catch {
    logEvent('warn', 'draft_preview_rejected', {
      reason: 'draft-homepage-missing',
    })

    return jsonError('Draft homepage not found', 404)
  }

  const draft = await draftMode()
  draft.enable()

  logEvent('info', 'draft_preview_enabled', {
    slug,
    status: 'accepted',
  })

  return Response.redirect(new URL(HOMEPAGE_SLUG, request.url))
}
