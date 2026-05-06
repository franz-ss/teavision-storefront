'use client'

import {
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from 'react'

import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

export type ContactActionResult = {
  success: boolean
  error?: string
}

type ContactFormProps = {
  action: (formData: FormData) => Promise<ContactActionResult>
  initialState?: 'idle' | 'success' | 'error'
  initialError?: string
}

type FormValues = {
  name: string
  phone: string
  email: string
  message: string
  website: string
}

const INITIAL_FORM_VALUES: FormValues = {
  name: '',
  phone: '',
  email: '',
  message: '',
  website: '',
}

const DEFAULT_ERROR =
  'Unable to send your message right now. Please try again shortly.'

const labelClassName = 'text-muted type-eyebrow'

const inputClassName =
  'mt-2 min-h-11 w-full rounded border border-default bg-canvas px-4 py-3 text-base text-default transition-colors placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-ring/20'

export function ContactForm({
  action,
  initialState = 'idle',
  initialError = DEFAULT_ERROR,
}: ContactFormProps) {
  const [values, setValues] = useState(INITIAL_FORM_VALUES)
  const [status, setStatus] = useState(initialState)
  const [error, setError] = useState(
    initialState === 'error' ? initialError : '',
  )
  const [isPending, startTransition] = useTransition()

  function updateField(field: keyof FormValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      try {
        const result = await action(formData)
        if (result.success) {
          setValues(INITIAL_FORM_VALUES)
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
      <div className="border-success/30 bg-success rounded border p-6">
        <p className={labelClassName}>Enquiry received</p>
        <h2 className="mt-4 text-2xl font-semibold">
          Thanks for your message.
        </h2>
        <p className="text-muted mt-3 max-w-xl leading-relaxed">
          We&rsquo;ll review the details and come back to you shortly. If your
          request is time-sensitive, call 1300 729 617.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus('idle')}
        >
          Send another enquiry
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
      aria-label="Contact enquiry form"
    >
      <div>
        <p className={labelClassName}>Procurement desk</p>
        <h2 className="mt-3 text-2xl font-semibold">Start an enquiry</h2>
        <p className="text-muted mt-3 max-w-2xl leading-relaxed">
          Tell us what you need sourced, blended, packed, or quoted. A short
          brief is enough to start the conversation.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClassName} htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            value={values.name}
            onChange={updateField('name')}
            className={inputClassName}
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="contact-phone">
            Phone
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={20}
            value={values.phone}
            onChange={updateField('phone')}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label className={labelClassName} htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={values.email}
          onChange={updateField('email')}
          className={inputClassName}
        />
      </div>

      <div>
        <label className={labelClassName} htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          maxLength={2000}
          value={values.message}
          onChange={updateField('message')}
          className={cn(inputClassName, 'resize-y')}
          placeholder="Wholesale account, custom blend, private label, sample request, or general supply question."
        />
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={updateField('website')}
        />
      </div>

      {status === 'error' && error && (
        <p
          id="contact-form-error"
          role="alert"
          className="border-danger/30 bg-danger text-danger rounded border p-4 text-sm"
        >
          {error}
        </p>
      )}

      <div className="border-default flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted text-sm">
          We reply from Teavision during Australian business hours.
        </p>
        <Button
          type="submit"
          size="lg"
          isLoading={isPending}
          disabled={isPending}
          aria-describedby={
            status === 'error' ? 'contact-form-error' : undefined
          }
        >
          {isPending ? 'Sending enquiry' : 'Send enquiry'}
        </Button>
      </div>
    </form>
  )
}
