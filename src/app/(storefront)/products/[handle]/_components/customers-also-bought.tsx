import {
  RelatedProductsCarousel,
  SearchaniseRecommendations,
} from '@/components/product'
import { searchanisePublicConfig } from '@/lib/env/public'
import { getProductRecommendations } from '@/lib/shopify/operations/product'
import type { Product } from '@/lib/shopify/types'

const CUSTOMERS_ALSO_BOUGHT_TITLE =
  'Customers Who Bought This Product Also Bought'

export async function CustomersAlsoBought({ product }: { product: Product }) {
  const fallbackProducts = await getProductRecommendations(product.id)

  if (
    fallbackProducts.length === 0 &&
    (!searchanisePublicConfig.enabled || !searchanisePublicConfig.apiKey)
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
            heading={
              <h2
                id="customers-also-bought-title"
                className="font-display text-ink text-[1.4rem]"
              >
                {CUSTOMERS_ALSO_BOUGHT_TITLE}
              </h2>
            }
          />
        ) : undefined
      }
      title={CUSTOMERS_ALSO_BOUGHT_TITLE}
      titleId="customers-also-bought-title"
      sectionClassName="border-t border-hairline pt-10"
      headingClassName="font-display text-ink text-[1.4rem]"
      {...(!searchanisePublicConfig.enabled || !searchanisePublicConfig.apiKey
        ? { fallbackDelayMs: 0 }
        : undefined)}
    />
  )
}
