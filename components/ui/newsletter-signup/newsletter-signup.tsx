'use client'

import {
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from 'react'

import type { NewsletterSignupActionResult } from '@/lib/contact/actions'
import { cn } from '@/lib/utils'

import { Button } from '../button'
import { Section } from '../section'

type NewsletterSignupProps = {
  action: (formData: FormData) => Promise<NewsletterSignupActionResult>
  tone?: 'surface' | 'brand'
  className?: string
}

const DEFAULT_ERROR =
  'Unable to send your signup right now. Please try again shortly.'

export function NewsletterSignup({
  action,
  tone = 'surface',
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
  }

  function handleWebsiteChange(event: ChangeEvent<HTMLInputElement>) {
    setWebsite(event.target.value)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      try {
        const result = await action(formData)
        if (result.success) {
          setEmail('')
          setWebsite('')
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

  if (status === 'success') {
    return (
      <div
        className={cn(
          'rounded-lg border p-6',
          tone === 'brand'
            ? 'border-on-brand bg-brand-strong text-on-brand'
            : 'border-success-border bg-success-bg text-success-text',
          className,
        )}
        role="status"
      >
        <p className="type-label">You&rsquo;re in.</p>
        <p
          className={cn(
            'type-body-sm mt-2',
            tone === 'brand' ? 'text-on-brand' : 'text-default',
          )}
        >
          Look out for the next Tea Journal edition.
        </p>
      </div>
    )
  }

  return (
    <Section.Root
      tone={tone}
      spacing="none"
      className={cn(
        'rounded-lg border p-6',
        tone === 'brand' ? 'border-on-brand' : 'border-default',
        className,
      )}
      aria-labelledby="newsletter-signup-heading"
    >
      <p className="type-eyebrow">Tea Journal</p>
      <h2 id="newsletter-signup-heading" className="type-heading-03 mt-3">
        Tea Journal in your inbox
      </h2>
      <p
        className={cn(
          'type-body-sm mt-3 max-w-xl',
          tone === 'brand' ? 'text-on-brand' : 'text-muted',
        )}
      >
        Monthly market notes, sourcing guides, and wholesale tea ideas from the
        Teavision team.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-5 flex flex-col gap-3 sm:max-w-xl sm:flex-row"
      >
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter Email"
          className={cn(
            'type-body focus:ring-ring min-h-11 flex-1 rounded-md border px-4 transition-colors focus:ring-2 focus:outline-none',
            tone === 'brand'
              ? 'border-on-brand bg-brand text-on-brand placeholder:text-on-brand'
              : 'border-default bg-canvas text-default placeholder:text-muted',
          )}
          aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
        />

        <div className="sr-only" aria-hidden="true">
          <label htmlFor="newsletter-website">Website</label>
          <input
            id="newsletter-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={handleWebsiteChange}
          />
        </div>

        <Button type="submit" isLoading={isPending} disabled={isPending}>
          {isPending ? 'Subscribing' : 'Subscribe'}
        </Button>
      </form>

      {status === 'error' && error && (
        <p
          id="newsletter-error"
          role="alert"
          className={cn(
            'type-body-sm mt-3 rounded-md border p-3',
            tone === 'brand'
              ? 'border-on-brand text-on-brand'
              : 'border-danger-border bg-danger-bg text-danger-text',
          )}
        >
          {error}
        </p>
      )}
    </Section.Root>
  )
}
