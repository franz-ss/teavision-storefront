'use client'

import { useRef, useState, useTransition, type FormEvent } from 'react'

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
      className="mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap"
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
        className="min-h-12 flex-1 rounded-full border border-paper/25 bg-paper/10 px-5.5 text-paper placeholder:text-paper/60 focus:border-gold focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
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
        variant="inverse"
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
            'type-body-sm w-full rounded-md border p-3 text-center',
            status === 'success'
              ? 'border-paper/25 text-paper'
              : 'border-gold bg-paper text-ink',
          )}
        >
          {status === 'success' ? 'Thanks for signing up.' : error}
        </p>
      ) : null}
    </form>
  )
}
