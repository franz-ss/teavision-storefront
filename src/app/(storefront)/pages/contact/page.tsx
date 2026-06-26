import type { Metadata } from 'next'

import { withNoindexRobots } from '@/lib/seo/noindex'

import { JsonLd } from './_components/json-ld'
import { PageContent } from './_components/page-content'

export const metadata: Metadata = withNoindexRobots({
  title: { absolute: 'Contact' },
  description:
    'Contact Teavision for wholesale tea, custom blending, private label, samples, and supply enquiries across Australia.',
  openGraph: {
    title: 'Contact',
    description:
      'Contact Teavision for wholesale tea, custom blending, private label, samples, and supply enquiries.',
    url: '/pages/contact',
  },
  alternates: { canonical: '/pages/contact' },
})

export default function Page() {
  return (
    <>
      <JsonLd />
      <PageContent />
    </>
  )
}
