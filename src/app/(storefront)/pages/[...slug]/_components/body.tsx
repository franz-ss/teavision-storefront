import { Section } from '@/components/ui'
import { RichText } from '@/components/ui/rich-text'
import { sanitizeShopifyPageBodyHtml } from '@/lib/shopify/html-content'
import type { ShopifyPage } from '@/lib/shopify/operations/storefront-page'

export function Body({ page }: { page: ShopifyPage }) {
  const bodyHtml = sanitizeShopifyPageBodyHtml(page.body)

  return (
    <Section.Root>
      <Section.Container>
        <RichText html={bodyHtml} variant="page" />
      </Section.Container>
    </Section.Root>
  )
}
