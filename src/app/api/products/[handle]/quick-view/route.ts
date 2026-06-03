import { getProduct } from '@/lib/shopify/operations/product'
import type { Product, ProductQuickViewDetails } from '@/lib/shopify/types'

type RouteContext = {
  params: Promise<{ handle: string }>
}

function toQuickViewDetails(product: Product): ProductQuickViewDetails {
  return {
    description: product.description,
    handle: product.handle,
    id: product.id,
    images: product.images,
    options: product.options,
    priceRange: product.priceRange,
    rating: product.rating,
    reviewCount: product.reviewCount,
    title: product.title,
    variants: product.variants,
  }
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { handle } = await params

  try {
    const product = await getProduct(handle)

    if (!product) {
      return Response.json({ message: 'Product not found' }, { status: 404 })
    }

    return Response.json(toQuickViewDetails(product))
  } catch {
    return Response.json(
      { message: 'Product quick view is unavailable' },
      { status: 503 },
    )
  }
}
