import crypto from 'crypto'
import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest): Promise<Response> {
  // Read raw body as buffer for HMAC verification
  let rawBody: Buffer
  try {
    const arrayBuffer = await request.arrayBuffer()
    rawBody = Buffer.from(arrayBuffer)
  } catch {
    return Response.json({ error: 'Failed to read request body' }, { status: 400 })
  }

  // Verify HMAC signature
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  if (!secret) {
    return Response.json({ error: 'Webhook secret not configured' }, { status: 401 })
  }

  const shopifyHmac = request.headers.get('x-shopify-hmac-sha256')
  if (!shopifyHmac) {
    return Response.json({ error: 'Missing HMAC header' }, { status: 401 })
  }

  const computedHmac = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64')

  const shopifyHmacBuffer = Buffer.from(shopifyHmac, 'base64')
  const computedHmacBuffer = Buffer.from(computedHmac, 'base64')

  if (
    shopifyHmacBuffer.length !== computedHmacBuffer.length ||
    !crypto.timingSafeEqual(shopifyHmacBuffer, computedHmacBuffer)
  ) {
    return Response.json({ error: 'Invalid HMAC signature' }, { status: 401 })
  }

  // Route based on topic
  const topic = request.headers.get('x-shopify-topic') ?? ''

  switch (topic) {
    case 'products/create':
    case 'products/update':
    case 'products/delete':
      revalidateTag('product', { expire: 0 })
      revalidateTag('products', { expire: 0 })
      break

    case 'collections/create':
    case 'collections/update':
    case 'collections/delete':
      revalidateTag('collection', { expire: 0 })
      revalidateTag('collections', { expire: 0 })
      break

    case 'collections/products_add':
    case 'collections/products_remove':
      revalidateTag('collection', { expire: 0 })
      revalidateTag('product', { expire: 0 })
      break

    default:
      // Unknown topics are accepted but ignored
      break
  }

  return Response.json({ revalidated: true }, { status: 200 })
}
