import {
  getArticlePath,
  getBlog,
  getBlogPath,
  normalizeBlogHandle,
} from '@/lib/blog/operations'

type Props = {
  params: Promise<{ blog: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teavision.com.au'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(_request: Request, { params }: Props) {
  const { blog } = await params
  const normalizedBlog = normalizeBlogHandle(blog)
  const blogData = await getBlog(normalizedBlog)

  if (!blogData) {
    return new Response('Not found', { status: 404 })
  }

  const blogPath = getBlogPath(normalizedBlog)
  const updated = blogData.articles[0]?.publishedAt ?? new Date().toISOString()
  const entries = blogData.articles
    .map((article) => {
      const url = `${baseUrl}${getArticlePath(normalizedBlog, article.handle)}`

      return [
        '<entry>',
        `<title>${escapeXml(article.title)}</title>`,
        `<link href="${escapeXml(url)}" />`,
        `<id>${escapeXml(url)}</id>`,
        `<updated>${new Date(article.publishedAt).toISOString()}</updated>`,
        `<summary>${escapeXml(article.excerpt)}</summary>`,
        '</entry>',
      ].join('')
    })
    .join('')

  const feed = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    `<title>${escapeXml(blogData.title)}</title>`,
    `<link href="${escapeXml(`${baseUrl}${blogPath}/atom`)}" rel="self" />`,
    `<link href="${escapeXml(`${baseUrl}${blogPath}`)}" />`,
    `<id>${escapeXml(`${baseUrl}${blogPath}`)}</id>`,
    `<updated>${new Date(updated).toISOString()}</updated>`,
    entries,
    '</feed>',
  ].join('')

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  })
}
