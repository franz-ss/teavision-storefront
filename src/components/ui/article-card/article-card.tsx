import { cva } from 'class-variance-authority'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { Card } from '../card'

type ArticleCardArticle = {
  title: string
  excerpt: string
  featuredImage: {
    url: string
    altText: string | null
    width: number | null
    height: number | null
  } | null
  publishedAt: string
  tags: string[]
  readingTimeMinutes: number
}

export type ArticleCardVariant = 'default' | 'featured'

export type ArticleCardProps = {
  article: ArticleCardArticle
  href: string
  publishedLabel: string
  variant?: ArticleCardVariant
  headingLevel?: 'h2' | 'h3'
  preload?: boolean
  className?: string
}

const articleHeadingVariants = cva(
  'text-ink group-hover:text-brand font-display text-[1.25rem] line-clamp-2 transition-colors',
  {
    variants: {
      variant: {
        default: 'leading-[1.3]',
        featured: 'type-heading-02',
      } satisfies Record<ArticleCardVariant, string>,
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const articleExcerptVariants = cva('text-ink-soft mt-3 line-clamp-3', {
  variants: {
    variant: {
      default: 'type-body-sm',
      featured: 'type-body',
    } satisfies Record<ArticleCardVariant, string>,
  },
  defaultVariants: {
    variant: 'default',
  },
})

export function ArticleCard({
  article,
  href,
  publishedLabel,
  variant = 'default',
  headingLevel = 'h2',
  preload = false,
  className,
}: ArticleCardProps) {
  const isFeatured = variant === 'featured'
  const Heading = headingLevel
  const imageSizes = isFeatured
    ? '(min-width: 768px) 50vw, 100vw'
    : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'

  return (
    <Card
      as="article"
      interactive
      overflow="hidden"
      className={cn('group h-full', className)}
    >
      <Link
        href={href}
        className="focus-visible:ring-ring flex h-full flex-col focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <div className="bg-paper-2 relative aspect-16/10 overflow-hidden rounded-lg">
          {article.featuredImage &&
          article.featuredImage.width &&
          article.featuredImage.height ? (
            <Image
              src={article.featuredImage.url}
              alt={article.featuredImage.altText ?? article.title}
              width={article.featuredImage.width}
              height={article.featuredImage.height}
              preload={preload}
              sizes={imageSizes}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="h-full w-full" aria-hidden="true" />
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          {article.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {article.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="type-mono-meta text-brand">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <Heading className={articleHeadingVariants({ variant })}>
            {article.title}
          </Heading>

          <p className={articleExcerptVariants({ variant })}>
            {article.excerpt}
          </p>

          <p className="type-mono-meta text-ink-faint mt-auto pt-5">
            {article.readingTimeMinutes} min read
            <span aria-hidden="true"> · </span>
            <time dateTime={article.publishedAt}>{publishedLabel}</time>
          </p>
        </div>
      </Link>
    </Card>
  )
}
