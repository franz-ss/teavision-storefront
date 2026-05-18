import type React from 'react'

import type { SanitizedHtml } from '@/lib/shopify/html-content'
import { cn } from '@/lib/utils'

export type RichTextProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML'
> & {
  html: SanitizedHtml
}

const RICH_TEXT_CLASS_NAME = cn(
  'type-body space-y-6 break-words text-default',
  '[&>*:first-child]:mt-0 [&_*]:!text-inherit [&_a]:rounded [&_a]:!text-link [&_a]:underline [&_a]:underline-offset-4',
  '[&_a]:focus-visible:ring-2 [&_a]:focus-visible:ring-ring [&_a]:focus-visible:ring-offset-2 [&_a]:focus-visible:outline-none',
  '[&_blockquote]:type-body-lg [&_blockquote]:rounded-lg [&_blockquote]:border [&_blockquote]:border-default [&_blockquote]:bg-surface [&_blockquote]:p-5 [&_blockquote]:italic',
  '[&_h2]:type-heading-02 [&_h2]:mt-10 [&_h2]:!text-strong [&_h3]:type-heading-03 [&_h3]:mt-8 [&_h3]:!text-strong',
  '[&_h4]:type-heading-04 [&_h4]:mt-8 [&_h4]:!text-strong [&_hr]:border-default',
  '[&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-default',
  '[&_li]:pl-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:text-default [&_strong]:type-label',
  '[&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_td]:border [&_td]:border-default [&_td]:p-3',
  '[&_th]:type-label [&_th]:border [&_th]:border-default [&_th]:bg-surface-sunken [&_th]:p-3 [&_ul]:list-disc [&_ul]:pl-6',
)

export function RichText({ html, className, ...props }: RichTextProps) {
  return (
    <div
      {...props}
      className={cn(RICH_TEXT_CLASS_NAME, className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
