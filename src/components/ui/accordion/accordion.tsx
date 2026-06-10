import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type AccordionItem = {
  id: string
  title: ReactNode
  content: ReactNode
  defaultOpen?: boolean
}

export type AccordionProps = Omit<ComponentProps<'div'>, 'children'> & {
  items: AccordionItem[]
}

export function Accordion({ className, items, ...props }: AccordionProps) {
  return (
    <div className={cn('divide-y divide-hairline', className)} {...props}>
      {items.map((item) => (
        <details
          key={item.id}
          className="group"
          open={item.defaultOpen || undefined}
        >
          <summary className="font-display text-[1.15rem] text-ink focus-visible:ring-ring hover:text-brand flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 transition-colors marker:content-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
            <span>{item.title}</span>
            <span
              aria-hidden="true"
              className="text-brand h-2 w-2 shrink-0 rotate-45 border-r border-b border-current transition-transform group-open:rotate-225"
            />
          </summary>
          <div className="type-body-sm text-ink-soft px-4 pb-5">
            {item.content}
          </div>
        </details>
      ))}
    </div>
  )
}
