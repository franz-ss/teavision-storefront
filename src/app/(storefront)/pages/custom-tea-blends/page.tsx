import type { Metadata } from 'next'

import {
  CUSTOM_TEA_BLEND_DESCRIPTION,
  CUSTOM_TEA_BLEND_META_TITLE,
  CUSTOM_TEA_BLEND_PAGE_PATH,
} from '@/lib/contact/custom-tea-blend'
import { withNoindexRobots } from '@/lib/seo/noindex'

import { PageContent } from './_components/page-content'

export const metadata: Metadata = withNoindexRobots({
  title: CUSTOM_TEA_BLEND_META_TITLE,
  description: CUSTOM_TEA_BLEND_DESCRIPTION,
  openGraph: {
    title: 'Custom Tea Blending | Teavision',
    description: CUSTOM_TEA_BLEND_DESCRIPTION,
    url: CUSTOM_TEA_BLEND_PAGE_PATH,
    type: 'website',
  },
  alternates: { canonical: CUSTOM_TEA_BLEND_PAGE_PATH },
})

export default function Page() {
  return <PageContent />
}
