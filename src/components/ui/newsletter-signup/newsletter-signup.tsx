'use client'

import {
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from 'react'

import type { NewsletterSignupActionResult } from '@/lib/contact/types'
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
            ? 'border-paper/30 bg-brand-deep text-paper'
            : 'border-brand bg-brand-tint text-brand',
          className,
        )}
        role="status"
      >
        <p className="type-label">You&rsquo;re in.</p>
        <p
          className={cn(
            'type-body-sm mt-2',
            tone === 'brand' ? 'text-paper/90' : 'text-ink',
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
        tone === 'brand' ? 'border-paper/30' : 'border-hairline',
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
          tone === 'brand' ? 'text-paper/90' : 'text-ink-soft',
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
          autoCapitalize="off"
          autoComplete="email"
          autoCorrect="off"
          spellCheck={false}
          required
          maxLength={254}
          value={email}
          onChange={handleEmailChange}
          placeholder="you@example.com"
          className={cn(
            'type-body min-h-11 flex-1 rounded-full border px-4.5 py-3.5 transition-colors focus:ring-0 focus:outline-none',
            tone === 'brand'
              ? 'border-paper/20 bg-paper/5 text-paper placeholder:text-paper/60 focus:border-gold'
              : 'border-hairline bg-card text-ink placeholder:text-ink-faint focus:border-brand focus:shadow-focus',
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
          {isPending ? 'Subscribing…' : 'Subscribe'}
        </Button>
      </form>

      {status === 'error' && error && (
        <p
          id="newsletter-error"
          role="alert"
          className={cn(
            'type-body-sm mt-3 rounded-md border p-3',
            tone === 'brand'
              ? 'border-paper/30 text-paper'
              : 'border-danger bg-danger-tint text-danger',
          )}
        >
          {error}
        </p>
      )}
    </Section.Root>
  )
}
