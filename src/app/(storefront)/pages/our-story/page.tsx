import type { Metadata } from 'next'

import { withNoindexRobots } from '@/lib/seo/noindex'

import { HERO_IMAGE } from './_lib/data'
import { PageContent } from './_components/page-content'

const DESCRIPTION =
  'Born in Melbourne, Teavision was founded by Lucas and Belinda in 2014 to make a meaningful difference through quality teas, herbs, and healthy living.'

export const metadata: Metadata = withNoindexRobots({
  title: { absolute: 'Our Story' },
  description: DESCRIPTION,
  openGraph: {
    title: 'Our Story',
    description: DESCRIPTION,
    url: '/pages/our-story',
    type: 'website',
    images: [
      {
        url: HERO_IMAGE.src,
        width: HERO_IMAGE.width,
        height: HERO_IMAGE.height,
        alt: 'Teavision Our Story',
      },
    ],
  },
  alternates: { canonical: '/pages/our-story' },
})

export default function Page() {
  return <PageContent />
}
