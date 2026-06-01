'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui'
import type { NewsletterSignupActionResult } from '@/lib/contact/types'
import { cn } from '@/lib/utils'

export type FooterNewsletterAction = (
  previousState: NewsletterSignupActionResult,
  formData: FormData,
) => Promise<NewsletterSignupActionResult> | NewsletterSignupActionResult

type FooterNewsletterFormProps = {
  action: FooterNewsletterAction
}

const INITIAL_STATE: NewsletterSignupActionResult = { success: false }
const DEFAULT_ERROR =
  'Unable to send your signup right now. Please try again shortly.'

export function FooterNewsletterForm({ action }: FooterNewsletterFormProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE)

  const messageId = state.success
    ? 'footer-newsletter-success'
    : 'footer-newsletter-error'
  const hasMessage = state.success || Boolean(state.error)

  return (
    <form action={formAction} aria-busy={isPending} className="mt-5 max-w-96">
      <label className="sr-only" htmlFor="footer-newsletter-email">
        Email
      </label>
      <div className="flex gap-2">
        <input
          id="footer-newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoCapitalize="off"
          autoComplete="email"
          autoCorrect="off"
          spellCheck={false}
          required
          maxLength={254}
          placeholder="you@example.com"
          aria-describedby={hasMessage ? messageId : undefined}
          className="border-footer-input bg-surface text-footer-bottom placeholder:text-footer-placeholder focus-visible:border-footer-accent focus-visible:ring-ring h-12 min-w-0 flex-1 rounded-sm border px-4 text-base leading-[1.4] transition-colors focus-visible:ring-2 focus-visible:outline-none"
        />
        <Button
          type="submit"
          variant="brand"
          size="lg"
          isLoading={isPending}
          disabled={isPending}
          className="w-28 shrink-0"
        >
          {isPending ? 'Sending…' : 'Submit'}
        </Button>
      </div>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="footer-newsletter-website">Website</label>
        <input
          id="footer-newsletter-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {hasMessage ? (
        <p
          id={messageId}
          role={state.success ? 'status' : 'alert'}
          aria-live="polite"
          className={cn(
            'mt-3 rounded-sm border px-3 py-2 text-sm leading-[1.4]',
            state.success
              ? 'border-footer-accent text-on-brand'
              : 'border-footer-input bg-surface text-footer-bottom',
          )}
        >
          {state.success
            ? 'Thanks for signing up.'
            : (state.error ?? DEFAULT_ERROR)}
        </p>
      ) : null}
    </form>
  )
}
