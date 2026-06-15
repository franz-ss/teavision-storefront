import type { ShopifyPage } from '@/lib/shopify/operations/storefront-page'

import { resolveDataRightsProfile } from '../_lib/data-rights'
import { formatUpdatedDate, getLeadDescription } from '../_lib/page-formatting'
import { resolvePageProfile } from '../_lib/page-profile'
import { Body } from './body'
import { DataRights } from './data-rights'
import { Hero } from './hero'
import { JsonLd } from './json-ld'
import { SupportCta } from './support-cta'

type ContentProps = {
  page: ShopifyPage
}

export function Content({ page }: ContentProps) {
  const profile = resolvePageProfile(page.handle)
  const dataRights = resolveDataRightsProfile(page.handle)

  if (dataRights) {
    const supportProfile = {
      ...profile,
      supportTitle: dataRights.support.title,
      supportCopy: dataRights.support.copy,
      primaryAction: { href: '/pages/contact', label: 'Talk to our team' },
    }

    return (
      <>
        <JsonLd description={dataRights.lede} page={page} />
        <Hero
          description={dataRights.lede}
          meta={
            <div className="mt-7">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="type-mono-meta text-paper/60">
                  Last reviewed {formatUpdatedDate(page.updatedAt)}
                </span>
                <span aria-hidden className="text-paper/30">
                  ·
                </span>
                {dataRights.laws.map((law) => (
                  <span
                    key={law}
                    className="type-mono-meta text-gold rounded-sm border border-paper/25 px-2.5 py-1.5"
                  >
                    {law}
                  </span>
                ))}
              </div>
              {dataRights.coverage ? (
                <p className="type-mono-meta text-paper/55 mt-3 normal-case">
                  {dataRights.coverage}
                </p>
              ) : null}
            </div>
          }
          page={page}
          profile={{ ...profile, kicker: dataRights.jurisdiction }}
          showActions={false}
        />
        <DataRights profile={dataRights} />
        <SupportCta profile={supportProfile} />
      </>
    )
  }

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
