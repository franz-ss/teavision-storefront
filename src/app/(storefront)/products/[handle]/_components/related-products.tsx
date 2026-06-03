import { getTrustooProductRatings } from '@/lib/reviews/trustoo'
import { getCollectionProducts } from '@/lib/shopify/operations/collection'
import { getProductRecommendations } from '@/lib/shopify/operations/product'
import type { Product, ProductSummary } from '@/lib/shopify/types'
import { RelatedProductsCarousel } from '@/components/product'
import { Section } from '@/components/ui'

const RELATED_COLLECTION_FETCH_LIMIT = 12
const RELATED_PRODUCTS_TITLE = 'Related Products'

const RELATED_COLLECTION_BY_TAG = new Map<string, string>([
  ['categories_All Herbs', 'dried-herbs'],
])

function getRelatedCollectionHandle(product: Product): string | null {
  for (const tag of product.tags) {
    const handle = RELATED_COLLECTION_BY_TAG.get(tag)
    if (handle) return handle
  }

  return null
}

async function getRelatedProducts(product: Product): Promise<ProductSummary[]> {
  const relatedCollectionHandle = getRelatedCollectionHandle(product)
  let products: ProductSummary[]

  if (relatedCollectionHandle) {
    const collectionProducts = await getCollectionProducts(
      relatedCollectionHandle,
      RELATED_COLLECTION_FETCH_LIMIT,
    )

    products = collectionProducts
      .filter((item) => item.handle !== product.handle)
      .slice(0, RELATED_COLLECTION_FETCH_LIMIT)
  } else {
    products = await getProductRecommendations(product.id, 'RELATED')
  }

  const reviewSummaries = await getTrustooProductRatings(
    products.map((relatedProduct) => relatedProduct.handle),
  )

  return products.map((relatedProduct) => {
    const reviewSummary = reviewSummaries[relatedProduct.handle]
    if (!reviewSummary) return relatedProduct

    return {
      ...relatedProduct,
      rating: reviewSummary.rating,
      reviewCount: reviewSummary.reviewCount,
    }
  })
}

function RelatedProductsContent({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) return null

  return <RelatedProductsCarousel products={products} />
}

export async function RelatedProducts({ product }: { product: Product }) {
  const products = await getRelatedProducts(product)
  if (products.length === 0) return null

  return (
    <Section.Root
      tone="transparent"
      spacing="none"
      className="border-default border-t pt-10"
      aria-labelledby="related-products-title"
    >
      <h2 id="related-products-title" className="mb-6 text-xl font-semibold">
        {RELATED_PRODUCTS_TITLE}
      </h2>
      <RelatedProductsContent products={products} />
    </Section.Root>
  )
}
