import { SearchaniseRecommendations } from '@/components/product'

const CART_RECOMMENDATIONS_TITLE = 'Recommended for your order'
const SEARCHANISE_API_KEY = process.env.NEXT_PUBLIC_SEARCHANISE_API_KEY
const SEARCHANISE_ENABLED =
  process.env.NEXT_PUBLIC_SEARCHANISE_ENABLED === 'true'

export function CartRecommendations() {
  if (!SEARCHANISE_ENABLED || !SEARCHANISE_API_KEY) return null

  return (
    <SearchaniseRecommendations
      title={CART_RECOMMENDATIONS_TITLE}
      titleId="cart-recommendations-title"
      sectionClassName="border-default mt-12 border-t pt-10"
      headingClassName="mb-6 text-xl font-semibold"
    />
  )
}
