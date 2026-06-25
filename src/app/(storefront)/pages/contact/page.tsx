import type { Metadata } from 'next'

import { withNoindexRobots } from '@/lib/seo/noindex'

import { PageContent } from './_components/page-content'

export const metadata: Metadata = withNoindexRobots({
  title: { absolute: 'Contact | Teavision' },
  description:
    'Contact Teavision for wholesale tea, custom blending, private label, samples, and supply enquiries across Australia.',
  openGraph: {
    title: 'Contact | Teavision',
    description:
      'Contact Teavision for wholesale tea, custom blending, private label, samples, and supply enquiries.',
    url: '/pages/contact',
  },
  alternates: { canonical: '/pages/contact' },
})

export default function Page() {
  return <PageContent />
}
