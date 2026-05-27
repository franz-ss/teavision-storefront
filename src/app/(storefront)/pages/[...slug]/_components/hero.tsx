import { Section } from '@/components/ui'
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
    <Section.Root tone="sunken" className="border-default border-b">
      <Section.Container>
        <Breadcrumb title={page.title} />

        <div className="grid gap-8 lg:grid-cols-3 lg:items-end">
          <div className="min-w-0 lg:col-span-2">
            <p className="type-eyebrow text-accent">{profile.kicker}</p>
            <h1 className="type-display-01 text-strong mt-5 max-w-4xl text-balance">
              {page.title}
            </h1>
            {description && (
              <p className="type-body-lg text-muted mt-6 max-w-prose break-words">
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
