import type { Metadata } from 'next'

import { withNoindexRobots } from '@/lib/seo/noindex'

import { SupplyPaths } from './_components/supply-paths'
import { WholesaleHero } from './_components/wholesale-hero'
import { WholesaleInclusions } from './_components/wholesale-inclusions'

export const metadata: Metadata = withNoindexRobots({
  title: 'Wholesale Accounts | Teavision',
  description:
    'Apply for a Teavision wholesale account. Bulk tea, herbs and spices for cafes, restaurants, and retailers across Australia.',
  openGraph: {
    title: 'Wholesale Accounts | Teavision',
    description:
      'Apply for a Teavision wholesale account. Bulk tea, herbs and spices for cafes, restaurants, and retailers.',
    url: '/pages/wholesale',
  },
  alternates: { canonical: '/pages/wholesale' },
})

export default function Page() {
  return (
    <>
      <WholesaleHero />

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(18rem,0.3fr)]">
          <SupplyPaths />
          <WholesaleInclusions />
        </div>
      </div>
    </>
  )
}
