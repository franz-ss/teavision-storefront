import { Eyebrow, Section } from '@/components/ui'
import type { ShopifyPage } from '@/lib/shopify/operations/storefront-page'

import type { PageProfile } from '../_lib/page-profile'
import { Actions } from './actions'
import { Breadcrumb } from './breadcrumb'

export function Hero({
  description,
  page,
  profile,
}: {
  description: string
  page: ShopifyPage
  profile: PageProfile
}) {
  return (
    <Section.Root tone="brand">
      <Section.Container>
        <Breadcrumb title={page.title} />

        <div className="grid gap-8 lg:grid-cols-3 lg:items-end">
          <div className="min-w-0 lg:col-span-2">
            <Eyebrow tone="gold">{profile.kicker}</Eyebrow>
            <h1 className="type-display text-paper mt-5 max-w-[16ch] text-balance">
              {page.title}
            </h1>
            {description && (
              <p className="type-lede text-paper/85 mt-6 max-w-[54ch] wrap-break-word">
                {description}
              </p>
            )}
            <Actions profile={profile} />
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
