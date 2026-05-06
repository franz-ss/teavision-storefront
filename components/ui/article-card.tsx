import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

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

type ArticleCardProps = {
  article: ArticleCardArticle
  href: string
  publishedLabel: string
  variant?: 'default' | 'featured'
  headingLevel?: 'h2' | 'h3'
  priority?: boolean
  className?: string
}

export function ArticleCard({
  article,
  href,
  publishedLabel,
  variant = 'default',
  headingLevel = 'h2',
  priority = false,
  className,
}: ArticleCardProps) {
  const isFeatured = variant === 'featured'
  const Heading = headingLevel
  const imageSizes = isFeatured
    ? '(min-width: 768px) 50vw, 100vw'
    : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'

  return (
    <article
      className={cn(
        'border-default bg-surface group hover:border-brand focus-within:border-brand h-full overflow-hidden rounded-lg border transition-colors',
        className,
      )}
    >
      <Link
        href={href}
        className="focus-visible:ring-ring flex h-full flex-col focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <div className="bg-surface-sunken relative aspect-16/10 overflow-hidden">
          {article.featuredImage &&
          article.featuredImage.width &&
          article.featuredImage.height ? (
            <Image
              src={article.featuredImage.url}
              alt={article.featuredImage.altText ?? article.title}
              width={article.featuredImage.width}
              height={article.featuredImage.height}
              priority={priority}
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
                <span key={tag} className="type-eyebrow text-muted">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <Heading
            className={cn(
              'text-strong group-hover:text-brand line-clamp-2 transition-colors',
              isFeatured ? 'type-heading-02' : 'type-heading-03',
            )}
          >
            {article.title}
          </Heading>

          <p
            className={cn(
              'text-muted mt-3 line-clamp-3',
              isFeatured ? 'type-body' : 'type-body-sm',
            )}
          >
            {article.excerpt}
          </p>

          <p className="type-caption text-subtle mt-auto pt-5">
            {article.readingTimeMinutes} min read
            <span aria-hidden="true"> · </span>
            <time dateTime={article.publishedAt}>{publishedLabel}</time>
          </p>
        </div>
      </Link>
    </article>
  )
}
