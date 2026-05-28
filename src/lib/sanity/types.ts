import type { PortableTextBlock } from '@portabletext/react'
import type { SanityImageCrop, SanityImageHotspot } from '@sanity/image-url'

export type SanitySeo = {
  metaTitle: string | null
  metaDescription: string | null
  canonicalPath: string | null
  noIndex: boolean | null
  ogImage: SanityImageWithAlt | null
}

export type SanityImageDimensions = {
  width: number | null
  height: number | null
  aspectRatio: number | null
}

export type SanityImageAsset = {
  _id: string
  url: string | null
  metadata: {
    dimensions: SanityImageDimensions | null
    lqip: string | null
  } | null
}

export type SanityImage = {
  asset: SanityImageAsset | null
  crop?: SanityImageCrop | null
  hotspot?: SanityImageHotspot | null
}

export type SanityImageWithAlt = {
  alt: string | null
  caption: string | null
  attribution: string | null
  image: SanityImage | null
}

export type SanityAuthor = {
  name: string | null
}

export type SanityCategory = {
  title: string | null
}

export type SanityLegacyComment = {
  _key: string | null
  id: string | null
  authorName: string | null
  contentHtml: string | null
}

export type SanityBlog = {
  _id: string
  title: string | null
  slug: string | null
  description: string | null
  heroImage: SanityImageWithAlt | null
  seo: SanitySeo | null
  featuredPosts: SanityBlogPostSummary[] | null
}

export type SanityBlogPostSummary = {
  _id: string
  title: string | null
  slug: string | null
  excerpt: string | null
  featuredImage: SanityImageWithAlt | null
  author: SanityAuthor | null
  categories: SanityCategory[] | null
  tags: string[] | null
  publishedAt: string | null
  bodyText: string | null
  seo: SanitySeo | null
}

export type SanityBlogPost = SanityBlogPostSummary & {
  _updatedAt: string | null
  body: PortableTextBlock[] | null
  legacyComments: SanityLegacyComment[] | null
  legacy: {
    contentHtml: string | null
  } | null
}

export type SanityBlogListingResult = {
  blog: SanityBlog | null
  articles: SanityBlogPostSummary[]
}

export type SanityBlogPostResult = {
  article: SanityBlogPost | null
}
