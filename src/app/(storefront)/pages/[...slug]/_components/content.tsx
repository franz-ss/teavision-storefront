import type { ShopifyPage } from '@/lib/shopify/operations/storefront-page'

import { resolveCompliancePage } from '../_lib/compliance'
import { getLeadDescription } from '../_lib/page-formatting'
import { resolvePageProfile } from '../_lib/page-profile'
import { Body } from './body'
import { Compliance } from './compliance'
import { Hero } from './hero'
import { JsonLd } from './json-ld'
import { SupportCta } from './support-cta'

type ContentProps = {
  page: ShopifyPage
}

export function Content({ page }: ContentProps) {
  const profile = resolvePageProfile(page.handle)
  const compliancePage = resolveCompliancePage(page.handle)
  const description = getLeadDescription(page)

  return (
    <>
      <JsonLd description={description} page={page} />
      <Hero
        description={compliancePage ? undefined : description}
        page={page}
        profile={profile}
      />
      {compliancePage ? (
        <Compliance page={compliancePage} />
      ) : (
        <Body page={page} />
      )}
      <SupportCta profile={profile} />
    </>
  )
}
