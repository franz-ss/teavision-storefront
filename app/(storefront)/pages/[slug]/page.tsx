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

  return { title: `${page.title} | Teavision` }
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{page.title}</h1>
      <div
        className="bg-surface mt-8 rounded p-8 leading-relaxed text-base"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </div>
  )
}
