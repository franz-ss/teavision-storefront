import { getProduct } from '@/lib/shopify/operations/product'

type RouteContext = {
  params: Promise<{ handle: string }>
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    return Response.json({ message: 'Product not found' }, { status: 404 })
  }

  return Response.json(product)
}
