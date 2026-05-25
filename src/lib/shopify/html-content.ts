import 'server-only'

import sanitizeHtml from 'sanitize-html'

declare const sanitizedHtmlBrand: unique symbol

export type SanitizedHtml = string & {
  readonly [sanitizedHtmlBrand]: true
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type ShopifyHtmlVariant = 'page' | 'article' | 'compact'
type ShopifyHtmlClassMap = Partial<Record<string, string>>

const SHOPIFY_HTML_ALLOWED_TAGS = [
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
] satisfies sanitizeHtml.IOptions['allowedTags']

const SHOPIFY_HTML_ALLOWED_ATTRIBUTES: Record<
  string,
  sanitizeHtml.AllowedAttribute[]
> = {
  a: ['class', 'href', 'rel', 'target', 'title'],
  blockquote: ['class'],
  caption: ['class'],
  figcaption: ['class'],
  figure: ['class'],
  h2: ['class'],
  h3: ['class'],
  h4: ['class'],
  h5: ['class'],
  h6: ['class'],
  hr: ['class'],
  img: ['alt', 'class', 'height', 'loading', 'src', 'title', 'width'],
  li: ['class'],
  ol: ['class'],
  p: ['class'],
  table: ['class'],
  td: ['class', 'colspan', 'rowspan'],
  th: ['class', 'colspan', 'rowspan', 'scope'],
  ul: ['class'],
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

const SHOPIFY_HTML_CLASS_NAMES: Record<
  ShopifyHtmlVariant,
  ShopifyHtmlClassMap
> = {
  page: {
    blockquote:
      'type-body-lg text-default rounded-lg border border-default bg-surface p-5 italic',
    caption: 'type-body-sm text-muted mb-3',
    figcaption: 'type-body-sm text-muted mt-3',
    figure: 'my-8',
    h2: 'type-heading-02 text-strong mt-10',
    h3: 'type-heading-03 text-strong mt-8',
    h4: 'type-heading-04 text-strong mt-8',
    h5: 'type-heading-05 text-strong mt-6',
    h6: 'type-label text-strong mt-6',
    hr: 'border-default',
    img: 'my-8 h-auto max-w-full rounded-lg border border-default',
    li: 'type-body text-default pl-1',
    ol: 'list-decimal pl-6',
    p: 'type-body text-default',
    table: 'my-8 block w-full overflow-x-auto border-collapse',
    td: 'type-body-sm border border-default p-3 align-top',
    th: 'type-label border border-default bg-surface-sunken p-3 text-left align-top',
    ul: 'list-disc pl-6',
  },
  article: {
    blockquote:
      'type-body-lg text-default rounded-lg border border-default bg-surface p-5 italic',
    caption: 'type-body-sm text-muted mb-3',
    figcaption: 'type-body-sm text-muted mt-3',
    figure: 'my-8',
    h2: 'type-heading-02 text-strong mt-10',
    h3: 'type-heading-03 text-strong mt-8',
    h4: 'type-heading-04 text-strong mt-8',
    h5: 'type-heading-05 text-strong mt-6',
    h6: 'type-label text-strong mt-6',
    hr: 'border-default',
    img: 'my-8 h-auto max-w-full rounded-lg border border-default',
    li: 'type-body text-default pl-1',
    ol: 'list-decimal pl-6',
    p: 'type-body text-default',
    table: 'my-8 block w-full overflow-x-auto border-collapse',
    td: 'type-body-sm border border-default p-3 align-top',
    th: 'type-label border border-default bg-surface-sunken p-3 text-left align-top',
    ul: 'list-disc pl-6',
  },
  compact: {
    blockquote:
      'type-body-sm text-default rounded-lg border border-default bg-surface p-4 italic',
    caption: 'type-body-sm text-muted mb-3',
    figcaption: 'type-body-sm text-muted mt-3',
    figure: 'my-6',
    h2: 'type-heading-04 text-strong mt-6',
    h3: 'type-heading-05 text-strong mt-5',
    h4: 'type-label text-strong mt-5',
    h5: 'type-label text-strong mt-4',
    h6: 'type-label text-strong mt-4',
    hr: 'border-default',
    img: 'my-6 h-auto max-w-full rounded-lg border border-default',
    li: 'type-body-sm text-default pl-1',
    ol: 'list-decimal pl-6',
    p: 'type-body-sm text-default',
    table: 'my-6 block w-full overflow-x-auto border-collapse',
    td: 'type-body-sm border border-default p-3 align-top',
    th: 'type-label border border-default bg-surface-sunken p-3 text-left align-top',
    ul: 'list-disc pl-6',
  },
}

const SHOPIFY_HTML_LINK_CLASS_NAME =
  'text-link hover:text-link-hover focus-visible:ring-ring rounded underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const SHOPIFY_HTML_ALLOWED_CLASSES = Array.from(
  new Set(
    [
      SHOPIFY_HTML_LINK_CLASS_NAME,
      ...Object.values(SHOPIFY_HTML_CLASS_NAMES).flatMap((classMap) =>
        Object.values(classMap),
      ),
    ]
      .join(' ')
      .split(/\s+/)
      .filter(Boolean),
  ),
)

function withClass(
  attributes: sanitizeHtml.Attributes,
  className?: string,
): sanitizeHtml.Attributes {
  if (!className) {
    const nextAttributes = { ...attributes }
    delete nextAttributes.class
    return nextAttributes
  }

  return {
    ...attributes,
    class: className,
  }
}

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
    attribs: withClass(nextAttributes, SHOPIFY_HTML_LINK_CLASS_NAME),
  }
}

function transformImage(
  tagName: string,
  attributes: sanitizeHtml.Attributes,
  className?: string,
): sanitizeHtml.Tag {
  return {
    tagName,
    attribs: withClass(
      {
        ...attributes,
        alt: attributes.alt ?? '',
        loading: 'lazy',
      },
      className,
    ),
  }
}

function transformWithClass(
  tagName: string,
  attributes: sanitizeHtml.Attributes,
  classMap: ShopifyHtmlClassMap,
): sanitizeHtml.Tag {
  return {
    tagName,
    attribs: withClass(attributes, classMap[tagName]),
  }
}

function buildAllowedClasses(): NonNullable<
  sanitizeHtml.IOptions['allowedClasses']
> {
  return Object.fromEntries(
    SHOPIFY_HTML_ALLOWED_TAGS.map((tagName) => [
      tagName,
      SHOPIFY_HTML_ALLOWED_CLASSES,
    ]),
  )
}

function buildHeadingTransforms(
  classMap: ShopifyHtmlClassMap,
): NonNullable<sanitizeHtml.IOptions['transformTags']> {
  const headingMap: Partial<Record<HeadingTag, HeadingTag>> = { h1: 'h2' }
  const transforms: NonNullable<sanitizeHtml.IOptions['transformTags']> = {
    a: transformExternalLink,
    img: (tagName, attributes) =>
      transformImage(tagName, attributes, classMap.img),
  }

  for (const tagName of Object.keys(classMap)) {
    if (tagName === 'a' || tagName === 'img') continue

    transforms[tagName] = (currentTagName, attributes) =>
      transformWithClass(currentTagName, attributes, classMap)
  }

  for (const [from, to] of Object.entries(headingMap)) {
    if (!to) continue
    transforms[from] = (_tagName, attributes) => ({
      tagName: to,
      attribs: withClass(attributes, classMap[to]),
    })
  }

  return transforms
}

function buildShopifyHtmlOptions(
  variant: ShopifyHtmlVariant,
): sanitizeHtml.IOptions {
  const classMap = SHOPIFY_HTML_CLASS_NAMES[variant]

  return {
    allowedAttributes: SHOPIFY_HTML_ALLOWED_ATTRIBUTES,
    allowedClasses: buildAllowedClasses(),
    allowedSchemes: SAFE_LINK_SCHEMES,
    allowedSchemesAppliedToAttributes: ['href', 'src'],
    allowedSchemesByTag: { img: ['https'] },
    allowedTags: SHOPIFY_HTML_ALLOWED_TAGS,
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
    transformTags: buildHeadingTransforms(classMap),
  }
}

export function sanitizeShopifyPageBodyHtml(html: string): SanitizedHtml {
  return sanitizeHtml(html, buildShopifyHtmlOptions('page')) as SanitizedHtml
}

export function sanitizeShopifyArticleHtml(html: string): SanitizedHtml {
  return sanitizeHtml(html, buildShopifyHtmlOptions('article')) as SanitizedHtml
}

export function sanitizeShopifyCompactHtml(html: string): SanitizedHtml {
  return sanitizeHtml(html, buildShopifyHtmlOptions('compact')) as SanitizedHtml
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
