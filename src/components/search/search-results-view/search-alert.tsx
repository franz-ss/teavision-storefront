import { AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

type SearchAlertProps = {
  message: string
  tone: 'error' | 'empty'
}

export function SearchAlert({ message, tone }: SearchAlertProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'border-default bg-surface grid gap-3 rounded-md border p-5',
        tone === 'error' && 'border-danger-border bg-danger-bg',
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          className={cn(
            'mt-0.5 size-5 shrink-0',
            tone === 'error' ? 'text-danger-text' : 'text-accent',
          )}
          aria-hidden="true"
        />
        <p className="type-body-sm text-default">{message}</p>
      </div>
    </div>
  )
}
