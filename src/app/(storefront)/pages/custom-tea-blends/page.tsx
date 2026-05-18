import type { Metadata } from 'next'

import {
  CUSTOM_TEA_BLEND_DESCRIPTION,
  CUSTOM_TEA_BLEND_META_TITLE,
  CUSTOM_TEA_BLEND_PAGE_PATH,
} from '@/lib/contact/custom-tea-blend'

import { CustomTeaBlendsPageContent } from './custom-tea-blends-page'

export const metadata: Metadata = {
  title: CUSTOM_TEA_BLEND_META_TITLE,
  description: CUSTOM_TEA_BLEND_DESCRIPTION,
  openGraph: {
    title: 'Custom Tea Blends | Teavision',
    description: CUSTOM_TEA_BLEND_DESCRIPTION,
    url: CUSTOM_TEA_BLEND_PAGE_PATH,
    type: 'website',
  },
  alternates: { canonical: CUSTOM_TEA_BLEND_PAGE_PATH },
}

export default function CustomTeaBlendsPage() {
  return <CustomTeaBlendsPageContent />
}
