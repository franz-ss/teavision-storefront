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

export type SanityPortableTextImageValue = {
  _key?: string
  _type: 'image' | 'imageWithAlt'
  alt?: string | null
  caption?: string | null
  attribution?: string | null
  asset?: SanityImageAsset | null
  image?: SanityImage | null
}

export type SanityPortableTextCalloutValue = {
  _key?: string
  _type: 'callout'
  title?: string | null
  body?: string | null
}

export type SanityPortableTextTableCell = {
  _key?: string
  text?: string | null
  image?: SanityImage | null
  alt?: string | null
  sourceUrl?: string | null
}

export type SanityPortableTextTableRow = {
  _key?: string
  cells?: SanityPortableTextTableCell[] | null
}

export type SanityPortableTextTableValue = {
  _key?: string
  _type: 'table'
  caption?: string | null
  rows?: SanityPortableTextTableRow[] | null
}

export type SanityPortableTextBlock =
  | (PortableTextBlock & { _type: 'block' })
  | SanityPortableTextImageValue
  | SanityPortableTextCalloutValue
  | SanityPortableTextTableValue

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
  body: SanityPortableTextBlock[] | null
  legacyComments: SanityLegacyComment[] | null
}

export type SanityBlogListingResult = {
  blog: SanityBlog | null
  articles: SanityBlogPostSummary[]
}

/**
 * Tag arrays from all published articles — used to compute unique tag navigation.
 * Only categories and tags fields; no body or image data.
 */
export type SanityArticleTagArrays = {
  categories: (string | null)[] | null
  tags: string[] | null
}

/**
 * Result shape for the light default-listing query.
 * articles contains only the first page of latest articles (no bodyText).
 * totalCount is the full article count for pagination UI.
 * allTagArrays provides the raw tag/category data needed for tag navigation.
 */
export type SanityDefaultBlogListingResult = {
  blog: SanityBlog | null
  articles: Omit<SanityBlogPostSummary, 'bodyText'>[]
  totalCount: number
  allTagArrays: SanityArticleTagArrays[]
}

export type SanityBlogPostResult = {
  article: SanityBlogPost | null
}

export type SanityHomeLink = {
  label: string | null
  href: string | null
}

export type SanityHomeSection = {
  eyebrow: string | null
  title: string | null
  copy: string | null
}

export type SanityHomeProofPoint = {
  iconKey: string | null
  image: SanityImageWithAlt | null
  title: string | null
  description: string | null
}

export type SanityHomeHero = {
  eyebrow: string | null
  title: string | null
  copy: string | null
  cta: SanityHomeLink | null
  image: SanityImageWithAlt | null
  trustMarks: SanityImageWithAlt | null
  proofPoints: SanityHomeProofPoint[] | null
}

export type SanityHomeImageCard = {
  title: string | null
  href: string | null
  image: SanityImageWithAlt | null
  action: string | null
  badge: SanityImageWithAlt | null
  body: string | null
}

export type SanityHomeCertificationItem = {
  label: string | null
  iconKey: string | null
}

export type SanityHomeTestimonial = {
  logo: SanityImageWithAlt | null
  name: string | null
  role: string | null
  brand: string | null
  quote: string | null
}

export type SanityHomeContactMethod = {
  label: string | null
  value: string | null
  href: string | null
}

export type SanityHomeFaqItem = {
  question: string | null
  answer: string | null
}

export type SanityHomePageResult = {
  _id: string
  title: string | null
  slug: string | null
  hero: SanityHomeHero | null
  productRange: {
    intro: SanityHomeSection | null
    cards: SanityHomeImageCard[] | null
  } | null
  newsletter: {
    intro: SanityHomeSection | null
  } | null
  privateLabel: {
    intro: SanityHomeSection | null
    cards: SanityHomeImageCard[] | null
  } | null
  organicHerbs: {
    intro: SanityHomeSection | null
    image: SanityImageWithAlt | null
    checklist: (string | null)[] | null
    cta: SanityHomeLink | null
  } | null
  supplyChain: {
    intro: SanityHomeSection | null
    cta: SanityHomeLink | null
  } | null
  certificationCoverage: {
    items: SanityHomeCertificationItem[] | null
  } | null
  supplyChainProtection: {
    intro: SanityHomeSection | null
    marks: SanityImageWithAlt[] | null
  } | null
  testimonials: {
    intro: SanityHomeSection | null
    items: SanityHomeTestimonial[] | null
  } | null
  teaJournal: {
    intro: SanityHomeSection | null
    blogHandle: string | null
    linkLabel: string | null
    maxPosts: number | null
  } | null
  contact: {
    intro: SanityHomeSection | null
    methods: SanityHomeContactMethod[] | null
  } | null
  catalogueCta: {
    intro: SanityHomeSection | null
    cta: SanityHomeLink | null
    secondaryCta: SanityHomeLink | null
  } | null
  faq: {
    intro: SanityHomeSection | null
    items: SanityHomeFaqItem[] | null
  } | null
  seo: SanitySeo | null
}
