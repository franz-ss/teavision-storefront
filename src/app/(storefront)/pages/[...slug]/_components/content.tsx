import { ContactSection } from '@/components/contact'
import type { ShopifyPage } from '@/lib/shopify/operations/storefront-page'
import { submitContactFormAction } from '@/lib/contact/actions'

import { getLeadDescription } from '../_lib/page-formatting'
import { isPolicyPageHandle, resolvePageProfile } from '../_lib/page-profile'
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
  const isTermsPage =
    page.handle === 'terms-conditions' || page.handle === 'terms-conditions-1'
  const showSupportCta = !isPolicyPageHandle(page.handle)

  return (
    <>
      <JsonLd description={description} page={page} />

      <Hero description={description} page={page} profile={profile} />

      <Body page={page} />
      {isTermsPage ? (
        <ContactSection action={submitContactFormAction} />
      ) : null}
      {showSupportCta ? (
        <SupportCta profile={profile} />
      ) : null}
    </>
  )
}
