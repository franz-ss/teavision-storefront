import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

type CollectionStoryDisclosureProps = {
  title: string
  html: string
  defaultOpen?: boolean
  className?: string
}

const COLLECTION_BODY_CLASS_NAME = cn(
  'type-body space-y-6 break-words text-default',
  '[&>*:first-child]:mt-0 [&_*]:!text-inherit [&_a]:!text-link [&_a]:underline [&_a]:underline-offset-4',
  '[&_blockquote]:type-body-lg [&_blockquote]:rounded-lg [&_blockquote]:border [&_blockquote]:border-default [&_blockquote]:bg-surface [&_blockquote]:p-5 [&_blockquote]:italic',
  '[&_h3]:type-heading-03 [&_h3]:mt-10 [&_h3]:!text-strong [&_h4]:type-heading-04 [&_h4]:mt-8 [&_h4]:!text-strong',
  '[&_hr]:border-default [&_img]:my-8 [&_img]:h-auto [&_img]:rounded-lg [&_img]:border [&_img]:border-default',
  '[&_li]:pl-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:text-default [&_strong]:type-label [&_table]:w-full [&_table]:border-collapse',
  '[&_td]:border [&_td]:border-default [&_td]:p-3 [&_th]:type-label [&_th]:border [&_th]:border-default [&_th]:bg-surface-sunken [&_th]:p-3 [&_ul]:list-disc [&_ul]:pl-6',
)

export function CollectionStoryDisclosure({
  title,
  html,
  defaultOpen = false,
  className,
}: CollectionStoryDisclosureProps) {
  return (
    <details
      className={cn(
        'border-default bg-surface group rounded-md border',
        className,
      )}
      open={defaultOpen}
    >
      <summary className="focus-visible:ring-ring flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-md px-4 py-3 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-5">
        <span className="type-label text-strong min-w-0 break-words">
          {title}
        </span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="border-default border-t px-4 py-5 sm:px-5">
        <div
          className={COLLECTION_BODY_CLASS_NAME}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </details>
  )
}
