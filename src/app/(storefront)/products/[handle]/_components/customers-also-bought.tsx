import { SearchaniseRecommendations } from '@/components/product'

const CUSTOMERS_ALSO_BOUGHT_TITLE =
  'Customers Who Bought This Product Also Bought'
const SEARCHANISE_API_KEY = process.env.NEXT_PUBLIC_SEARCHANISE_API_KEY
const SEARCHANISE_ENABLED =
  process.env.NEXT_PUBLIC_SEARCHANISE_ENABLED === 'true'

export function CustomersAlsoBought() {
  if (!SEARCHANISE_ENABLED || !SEARCHANISE_API_KEY) return null

  return (
    <SearchaniseRecommendations
      title={CUSTOMERS_ALSO_BOUGHT_TITLE}
      titleId="customers-also-bought-title"
      sectionClassName="border-default border-t pt-10"
      headingClassName="mb-6 text-xl font-semibold"
    />
  )
}
