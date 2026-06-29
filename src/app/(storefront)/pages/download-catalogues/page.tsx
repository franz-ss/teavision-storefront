import type { Metadata } from 'next'

import { PageContent } from './_components/page-content'
import { HERO, PAGE_PATH } from './_lib/data'

const DESCRIPTION =
  'Download Teavision wholesale catalogues: loose leaf tea, tea bags, herbs & spices, blends, beverages, and the full ACO organic ingredients list. Pack sizes, MOQs, and lead times.'

export const metadata: Metadata = {
  title: { absolute: HERO.title },
  description: DESCRIPTION,
  openGraph: {
    title: HERO.title,
    description: DESCRIPTION,
    url: PAGE_PATH,
    type: 'website',
  },
  alternates: { canonical: PAGE_PATH },
}

export default function Page() {
  return <PageContent />
}
