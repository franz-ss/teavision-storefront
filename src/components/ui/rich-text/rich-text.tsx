import type React from 'react'

import type { SanitizedHtml } from '@/lib/shopify/html-content'
import { cn } from '@/lib/utils'

export type RichTextProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML'
> & {
  html: SanitizedHtml
  variant?: RichTextVariant
}

type RichTextVariant = 'page' | 'article' | 'compact' | 'disclosure'

const RICH_TEXT_BASE_CLASS_NAME = cn(
  'break-words text-default',
  '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
)

const RICH_TEXT_VARIANT_CLASS_NAMES: Record<RichTextVariant, string> = {
  page: 'type-body max-w-prose space-y-6',
  article: 'type-body max-w-prose space-y-6',
  compact: 'type-body-sm space-y-4',
  disclosure: 'type-body-sm space-y-4',
}

export function RichText({
  html,
  className,
  variant = 'page',
  ...props
}: RichTextProps) {
  return (
    <div
      {...props}
      className={cn(
        RICH_TEXT_BASE_CLASS_NAME,
        RICH_TEXT_VARIANT_CLASS_NAMES[variant],
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
