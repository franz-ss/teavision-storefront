import 'server-only'

import sanitizeHtml from 'sanitize-html'

declare const sanitizedHtmlBrand: unique symbol

export type SanitizedHtml = string & {
  readonly [sanitizedHtmlBrand]: true
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const ALLOWED_TAGS = [
  'a',
  'b',
  'blockquote',
  'br',
  'caption',
  'div',
  'em',
  'figcaption',
  'figure',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'li',
  'ol',
  'p',
  'span',
  'strong',
  'sub',
  'sup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
]

const ALLOWED_ATTRIBUTES: Record<string, sanitizeHtml.AllowedAttribute[]> = {
  a: ['href', 'rel', 'target', 'title'],
  img: ['alt', 'height', 'loading', 'src', 'title', 'width'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan', 'scope'],
}

const SAFE_LINK_SCHEMES = ['http', 'https', 'mailto', 'tel']

const PLAIN_TEXT_SEPARATOR_TAGS = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'br',
  'caption',
  'dd',
  'div',
  'dl',
  'dt',
  'figcaption',
  'figure',
  'footer',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'li',
  'main',
  'ol',
  'p',
  'section',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'ul',
])

function transformExternalLink(
  tagName: string,
  attributes: sanitizeHtml.Attributes,
): sanitizeHtml.Tag {
  const nextAttributes = { ...attributes }

  if (nextAttributes.target === '_blank') {
    nextAttributes.rel = 'noopener noreferrer'
  } else {
    delete nextAttributes.target
    delete nextAttributes.rel
  }

  return {
    tagName,
    attribs: nextAttributes,
  }
}

function transformImage(
  tagName: string,
  attributes: sanitizeHtml.Attributes,
): sanitizeHtml.Tag {
  return {
    tagName,
    attribs: {
      ...attributes,
      alt: attributes.alt ?? '',
      loading: 'lazy',
    },
  }
}

function buildHeadingTransforms(): NonNullable<
  sanitizeHtml.IOptions['transformTags']
> {
  const headingMap: Partial<Record<HeadingTag, HeadingTag>> = { h1: 'h2' }
  const transforms: NonNullable<sanitizeHtml.IOptions['transformTags']> = {
    a: transformExternalLink,
    img: transformImage,
  }

  for (const [from, to] of Object.entries(headingMap)) {
    if (!to) continue
    transforms[from] = sanitizeHtml.simpleTransform(to, {}, true)
  }

  return transforms
}

const SHOPIFY_PAGE_BODY_OPTIONS: sanitizeHtml.IOptions = {
  allowedAttributes: ALLOWED_ATTRIBUTES,
  allowedSchemes: SAFE_LINK_SCHEMES,
  allowedSchemesAppliedToAttributes: ['href', 'src'],
  allowedSchemesByTag: { img: ['https'] },
  allowedTags: ALLOWED_TAGS,
  allowProtocolRelative: false,
  disallowedTagsMode: 'discard',
  transformTags: buildHeadingTransforms(),
}

export function sanitizeShopifyPageBodyHtml(html: string): SanitizedHtml {
  return sanitizeHtml(html, SHOPIFY_PAGE_BODY_OPTIONS) as SanitizedHtml
}

export function plainTextFromHtml(html: string): string {
  let prependTextSeparator = false

  return decodePlainTextEntities(
    sanitizeHtml(html, {
      allowedAttributes: {},
      allowedTags: [],
      disallowedTagsMode: 'discard',
      onCloseTag(tagName) {
        if (PLAIN_TEXT_SEPARATOR_TAGS.has(tagName)) {
          prependTextSeparator = true
        }
      },
      onOpenTag(tagName) {
        if (PLAIN_TEXT_SEPARATOR_TAGS.has(tagName)) {
          prependTextSeparator = true
        }
      },
      textFilter(text) {
        if (!prependTextSeparator) return text

        prependTextSeparator = false
        return ` ${text}`
      },
    }),
  )
    .replace(/\s+/g, ' ')
    .trim()
}

function decodePlainTextEntities(value: string): string {
  return value
    .replace(/\u00a0/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}
