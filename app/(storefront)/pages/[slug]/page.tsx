import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPage } from '@/lib/shopify/operations/page'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    return { title: 'Page Not Found' }
  }

  const plainDescription = page.body
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)
  return {
    title: page.title,
    description: plainDescription || undefined,
    openGraph: {
      title: page.title,
      description: plainDescription || undefined,
      url: `/pages/${slug}`,
    },
    alternates: { canonical: `/pages/${slug}` },
  }
}

async function PageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{page.title}</h1>
      <div
        className="bg-surface mt-8 rounded p-8 text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </div>
  )
}

export default function StaticPage({ params }: Props) {
  return (
    <Suspense fallback={<div aria-live="polite">Loading…</div>}>
      <PageContent params={params} />
    </Suspense>
  )
}
