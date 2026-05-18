import { plainTextFromHtml } from '@/lib/shopify/html-content'
import type { ShopifyPage } from '@/lib/shopify/operations/storefront-page'

const PAGE_DESCRIPTION_MAX_LENGTH = 180

type PageDescriptionSource = Pick<ShopifyPage, 'body'>

export function getStaticPageDescription({
  body,
}: PageDescriptionSource): string {
  return truncateDescription(
    plainTextFromHtml(body),
    PAGE_DESCRIPTION_MAX_LENGTH,
  )
}

export function getStaticPageLeadDescription(page: ShopifyPage): string {
  const seoDescription = plainTextFromHtml(page.seo.description ?? '')

  return seoDescription || getStaticPageDescription(page)
}

export function getStaticPageMetaDescription(page: ShopifyPage): string {
  const fallbackDescription =
    getStaticPageLeadDescription(page) ||
    `${page.title} from Teavision, Australia's wholesale tea, herb, and spice supplier.`

  return truncateMetaDescription(fallbackDescription)
}

export function formatUpdatedDate(iso: string): string {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) {
    return 'Recently updated'
  }

  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function truncateMetaDescription(value: string): string {
  return truncateDescription(value, 160)
}

function truncateDescription(value: string, maxLength: number): string {
  return value.length > maxLength
    ? `${value.slice(0, maxLength - 1).trimEnd()}…`
    : value
}
