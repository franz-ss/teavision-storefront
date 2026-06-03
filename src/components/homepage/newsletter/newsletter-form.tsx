'use client'

import {
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from 'react'

import { Button } from '@/components/ui'
import type { NewsletterSignupActionResult } from '@/lib/contact/types'
import { cn } from '@/lib/utils'

type HomepageNewsletterFormProps = {
  action: (formData: FormData) => Promise<NewsletterSignupActionResult>
}

const DEFAULT_ERROR =
  'Unable to send your signup right now. Please try again shortly.'

export function HomepageNewsletterForm({
  action,
}: HomepageNewsletterFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      try {
        const result = await action(formData)

        if (result.success) {
          formRef.current?.reset()
          setStatus('success')
          setError('')
          return
        }

        setStatus('error')
        setError(result.error ?? DEFAULT_ERROR)
      } catch {
        setStatus('error')
        setError(DEFAULT_ERROR)
      }
    })
  }

  const messageId =
    status === 'success'
      ? 'homepage-newsletter-success'
      : 'homepage-newsletter-error'
  const hasMessage = status === 'success' || Boolean(error)

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      aria-busy={isPending}
      className="mx-auto mt-8 flex max-w-xl flex-col gap-2 sm:flex-row sm:flex-wrap"
    >
      <label className="sr-only" htmlFor="homepage-newsletter-email">
        Enter Email
      </label>
      <input
        id="homepage-newsletter-email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        maxLength={254}
        placeholder="Enter Email"
        aria-describedby={hasMessage ? messageId : undefined}
        className="type-body-sm focus-visible:ring-ring border-on-brand/30 bg-canvas text-strong placeholder:text-muted min-h-12 flex-1 rounded-md border px-4 focus-visible:ring-2 focus-visible:outline-none"
      />
      <div className="sr-only" aria-hidden="true">
        <input
          id="homepage-newsletter-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <Button
        type="submit"
        size="cta"
        isLoading={isPending}
        disabled={isPending}
      >
        {isPending ? 'Subscribing…' : 'Subscribe'}
      </Button>
      {hasMessage ? (
        <p
          id={messageId}
          role={status === 'success' ? 'status' : 'alert'}
          aria-live="polite"
          className={cn(
            'type-body-sm border-on-brand/30 w-full rounded-md border p-3 text-center',
            status === 'success'
              ? 'text-on-brand'
              : 'bg-surface text-strong',
          )}
        >
          {status === 'success' ? 'Thanks for signing up.' : error}
        </p>
      ) : null}
    </form>
  )
}
