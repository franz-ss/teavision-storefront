import type { ShopifyPage } from '@/lib/shopify/operations/storefront-page'

import { getLeadDescription } from '../_lib/page-formatting'
import { resolvePageProfile } from '../_lib/page-profile'
import { Body } from './body'
import { Hero } from './hero'
import { JsonLd } from './json-ld'
import { SupportCta } from './support-cta'

type ContentProps = {
  page: ShopifyPage
}

export function Content({ page }: ContentProps) {
  const profile = resolvePageProfile(page.handle)
  const description = getLeadDescription(page)

  return (
    <>
      <JsonLd description={description} page={page} />

      <Hero description={description} page={page} profile={profile} />

      <Body page={page} />
      <SupportCta profile={profile} />
    </>
  )
}
