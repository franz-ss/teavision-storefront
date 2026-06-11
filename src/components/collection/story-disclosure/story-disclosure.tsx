import { ChevronDown } from 'lucide-react'

import { RichText } from '@/components/ui/rich-text'
import type { SanitizedHtml } from '@/lib/shopify/html-content'
import { cn } from '@/lib/utils'

type StoryDisclosureProps = {
  title: string
  html: SanitizedHtml
  defaultOpen?: boolean
  className?: string
}

export function StoryDisclosure({
  title,
  html,
  defaultOpen = false,
  className,
}: StoryDisclosureProps) {
  return (
    <details
      className={cn(
        'border-hairline bg-paper group rounded-lg border',
        className,
      )}
      open={defaultOpen}
    >
      <summary className="focus-visible:ring-ring flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-4 py-3 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-5">
        <span className="type-label text-ink min-w-0 wrap-break-word">
          {title}
        </span>
        <ChevronDown
          className="text-ink-soft size-4 shrink-0 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="border-hairline border-t px-4 py-5 sm:px-5">
        <RichText html={html} variant="disclosure" />
      </div>
    </details>
  )
}
