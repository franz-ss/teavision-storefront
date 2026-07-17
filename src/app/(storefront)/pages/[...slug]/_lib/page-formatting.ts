import { plainTextFromHtml } from '@/lib/shopify/html-content'
import type { ShopifyPage } from '@/lib/shopify/operations/storefront-page'

const PAGE_DESCRIPTION_MAX_LENGTH = 180

type PageDescriptionSource = Pick<ShopifyPage, 'body'>

export function getDescription({ body }: PageDescriptionSource): string {
  return truncateDescription(
    plainTextFromHtml(body),
    PAGE_DESCRIPTION_MAX_LENGTH,
  )
}

export function getLeadDescription(page: ShopifyPage): string {
  const seoDescription = plainTextFromHtml(page.seo.description ?? '')

  return seoDescription || getDescription(page)
}

export function getMetaDescription(page: ShopifyPage): string {
  const fallbackDescription =
    getLeadDescription(page) ||
    `${page.title} from Teavision, Australia's wholesale tea, herb, and spice supplier.`

  return truncateMetaDescription(fallbackDescription)
}

function truncateMetaDescription(value: string): string {
  return truncateDescription(value, 160)
}

function truncateDescription(value: string, maxLength: number): string {
  return value.length > maxLength
    ? `${value.slice(0, maxLength - 1).trimEnd()}…`
    : value
}
