export const CANONICAL_BLOG_LISTING_PATH = '/blog'
export const DEFAULT_BLOG_HANDLE = 'teavision-blogs'
export const LEGACY_BLOG_HANDLE = 'journal'

export function normalizeBlogHandle(handle: string): string {
  return handle === LEGACY_BLOG_HANDLE ? DEFAULT_BLOG_HANDLE : handle
}

export function getBlogPath(blogHandle: string): string {
  return `/blogs/${normalizeBlogHandle(blogHandle)}`
}

export function getCanonicalBlogListingPath(blogHandle: string): string {
  return normalizeBlogHandle(blogHandle) === DEFAULT_BLOG_HANDLE
    ? CANONICAL_BLOG_LISTING_PATH
    : getBlogPath(blogHandle)
}

export function getArticlePath(
  blogHandle: string,
  articleHandle: string,
): string {
  return `${getBlogPath(blogHandle)}/${articleHandle}`
}

export function slugifyTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getTagPath(blogHandle: string, tag: string): string {
  return `${getBlogPath(blogHandle)}/tagged/${slugifyTag(tag)}`
}
