import { Section } from '@/components/ui'
import { RichText } from '@/components/ui/rich-text'
import { sanitizeShopifyPageBodyHtml } from '@/lib/shopify/html-content'
import type { ShopifyPage } from '@/lib/shopify/operations/storefront-page'

import { isPolicyPageHandle } from '../_lib/page-profile'

export function Body({ page }: { page: ShopifyPage }) {
  const bodyHtml = sanitizeShopifyPageBodyHtml(page.body)

  if (isPolicyPageHandle(page.handle)) {
    return (
      <Section.Root tone="surface" className="border-hairline border-t">
        <Section.Container>
          <h2 className="sr-only">Policy text</h2>
          <RichText
            html={bodyHtml}
            variant="page"
            className="max-w-[70ch] [&>p:has(>strong:first-child)]:mt-8 [&>p:has(>strong:first-child)]:text-ink [&>p:has(>strong:first-child)+p]:mt-3 [&>p>strong:first-child]:text-ink"
          />
        </Section.Container>
      </Section.Root>
    )
  }

  return (
    <Section.Root tone="surface">
      <Section.Container variant="compact">
        <RichText html={bodyHtml} variant="page" />
      </Section.Container>
    </Section.Root>
  )
}
