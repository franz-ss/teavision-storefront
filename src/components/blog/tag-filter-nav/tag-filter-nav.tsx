import Link from 'next/link'

import { getBlogPath, getTagPath } from '@/lib/blog/operations'
import { cn } from '@/lib/utils'

type TagFilterNavProps = {
  activeTag: string | null
  blogHandle: string
  tags: string[]
}

export function TagFilterNav({
  activeTag,
  blogHandle,
  tags,
}: TagFilterNavProps) {
  return (
    <nav aria-label="Filter by tag" className="mb-8 flex flex-wrap gap-2">
      <Link
        href={getBlogPath(blogHandle)}
        aria-current={!activeTag ? 'page' : undefined}
        className={cn(
          'type-label focus-visible:ring-ring inline-flex min-h-11 items-center rounded-full px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          !activeTag
            ? 'bg-action-primary text-action-primary-text'
            : 'border-default bg-surface text-default hover:border-brand border',
        )}
      >
        All
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={getTagPath(blogHandle, tag)}
          aria-current={activeTag === tag ? 'page' : undefined}
          className={cn(
            'type-label focus-visible:ring-ring inline-flex min-h-11 items-center rounded-full px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            activeTag === tag
              ? 'bg-action-primary text-action-primary-text'
              : 'border-default bg-surface text-default hover:border-brand border',
          )}
        >
          {tag}
        </Link>
      ))}
    </nav>
  )
}
