import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

import { logEvent } from '@/lib/observability/logger'
import { getSanityRevalidateSecret } from '@/lib/sanity/env'

type SanityWebhookPayload = {
  _type?: unknown
  articleSlug?: unknown
  blog?: unknown
  blogSlug?: unknown
  slug?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function readSlug(value: unknown): string | null {
  if (!isRecord(value)) return null

  const current = value.current
  return typeof current === 'string' && current ? current : null
}

function readSlugValue(value: unknown): string | null {
  return readString(value) ?? readSlug(value)
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value ? value : null
}

export async function POST(request: NextRequest): Promise<Response> {
  let expectedSecret: string
  try {
    expectedSecret = getSanityRevalidateSecret()
  } catch {
    logEvent('error', 'sanity_webhook_rejected', {
      reason: 'missing-secret',
    })

    return Response.json(
      { error: 'Webhook secret not configured' },
      { status: 500 },
    )
  }

  let parsedBody: Awaited<ReturnType<typeof parseBody<SanityWebhookPayload>>>
  try {
    parsedBody = await parseBody<SanityWebhookPayload>(
      request,
      expectedSecret,
      true,
    )
  } catch {
    logEvent('warn', 'sanity_webhook_rejected', {
      reason: 'invalid-payload',
    })

    return Response.json({ error: 'Invalid webhook payload' }, { status: 400 })
  }

  if (!parsedBody.isValidSignature) {
    logEvent('warn', 'sanity_webhook_rejected', {
      reason: 'invalid-signature',
    })

    return Response.json(
      { error: 'Invalid webhook signature' },
      { status: 401 },
    )
  }

  if (!isRecord(parsedBody.body)) {
    logEvent('warn', 'sanity_webhook_rejected', {
      reason: 'invalid-payload',
    })

    return Response.json({ error: 'Invalid webhook payload' }, { status: 400 })
  }

  const body = parsedBody.body
  const documentType = readString(body._type)
  const slug = readSlugValue(body.slug)
  const blogSlug =
    readString(body.blogSlug) ??
    readSlug(body.blog) ??
    (documentType === 'blog' ? slug : null)
  const articleSlug =
    readString(body.articleSlug) ??
    (documentType === 'blogPost' ? slug : null)
  let status: 'accepted' | 'ignored' = 'accepted'

  if (documentType === 'homePage') {
    revalidateTag('homePage', { expire: 0 })
    revalidateTag('sanity-homepage', { expire: 0 })
  } else if (documentType === 'blog' || documentType === 'blogPost') {
    revalidateTag('blog', { expire: 0 })

    if (blogSlug) {
      revalidateTag(`blog-${blogSlug}`, { expire: 0 })
    }

    if (documentType === 'blogPost' && blogSlug && articleSlug) {
      revalidateTag(`article-${blogSlug}-${articleSlug}`, { expire: 0 })
    }
  } else {
    status = 'ignored'
  }

  logEvent('info', 'sanity_webhook_received', {
    documentType,
    hasArticleSlug: Boolean(articleSlug),
    hasBlogSlug: Boolean(blogSlug),
    status,
  })

  return Response.json({ revalidated: status === 'accepted' }, { status: 200 })
}
