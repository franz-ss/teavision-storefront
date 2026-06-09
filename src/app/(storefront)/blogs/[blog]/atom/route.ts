import {
  getArticlePath,
  getBlog,
  getBlogPath,
  isLocalCanonicalPath,
  normalizeBlogHandle,
} from '@/lib/blog/operations'
import { SITE_URL } from '@/lib/seo/site-url'

type Props = {
  params: Promise<{ blog: string }>
}

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
  const articles = blogData.articles.filter((article) => {
    const localPath = getArticlePath(normalizedBlog, article.handle)

    return (
      !article.seo.noIndex &&
      isLocalCanonicalPath(article.seo.canonicalPath, localPath, SITE_URL)
    )
  })
  const updated = articles[0]?.publishedAt ?? new Date().toISOString()
  const entries = articles
    .map((article) => {
      const url = `${SITE_URL}${getArticlePath(normalizedBlog, article.handle)}`

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
    `<link href="${escapeXml(`${SITE_URL}${blogPath}/atom`)}" rel="self" />`,
    `<link href="${escapeXml(`${SITE_URL}${blogPath}`)}" />`,
    `<id>${escapeXml(`${SITE_URL}${blogPath}`)}</id>`,
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
