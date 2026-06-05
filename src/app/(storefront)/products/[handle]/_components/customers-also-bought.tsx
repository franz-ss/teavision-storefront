import {
  RelatedProductsCarousel,
  SearchaniseRecommendations,
} from '@/components/product'
import { getProductRecommendations } from '@/lib/shopify/operations/product'
import type { Product } from '@/lib/shopify/types'

const CUSTOMERS_ALSO_BOUGHT_TITLE =
  'Customers Who Bought This Product Also Bought'
const SEARCHANISE_API_KEY = process.env.NEXT_PUBLIC_SEARCHANISE_API_KEY
const SEARCHANISE_ENABLED =
  process.env.NEXT_PUBLIC_SEARCHANISE_ENABLED === 'true'

export async function CustomersAlsoBought({ product }: { product: Product }) {
  const fallbackProducts = await getProductRecommendations(product.id)

  if (
    fallbackProducts.length === 0 &&
    (!SEARCHANISE_ENABLED || !SEARCHANISE_API_KEY)
  ) {
    return null
  }

  return (
    <SearchaniseRecommendations
      fallback={
        fallbackProducts.length > 0 ? (
          <RelatedProductsCarousel
            products={fallbackProducts}
            ariaLabel="Customers also bought products"
          />
        ) : undefined
      }
      title={CUSTOMERS_ALSO_BOUGHT_TITLE}
      titleId="customers-also-bought-title"
      sectionClassName="border-default border-t pt-10"
      headingClassName="mb-6 text-xl font-semibold"
      {...(!SEARCHANISE_ENABLED || !SEARCHANISE_API_KEY
        ? { fallbackDelayMs: 0 }
        : undefined)}
    />
  )
}
