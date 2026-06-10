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
    <form action={formAction} aria-busy={isPending} className="mt-5">
      <label className="sr-only" htmlFor="footer-newsletter-email">
        Email
      </label>
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
        placeholder="you@business.com.au"
        aria-describedby={hasMessage ? messageId : undefined}
        className="w-full rounded-full border border-paper/20 bg-paper/5 px-4.5 py-3.5 text-[0.95rem] text-paper placeholder:text-paper/60 transition-colors focus:border-gold focus:ring-0 focus:outline-none"
      />
      <Button
        type="submit"
        variant="inverse"
        size="sm"
        isLoading={isPending}
        disabled={isPending}
        className="mt-2.5 w-full"
      >
        {isPending ? 'Sending…' : 'Subscribe'}
      </Button>
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
              ? 'border-brand-mid text-paper'
              : 'border-paper/20 bg-paper/5 text-paper/75',
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
