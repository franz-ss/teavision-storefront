'use client'

import {
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from 'react'

import { Button, FormLabel, Textarea, TextInput } from '@/components/ui'
import type { ContactActionResult } from '@/lib/contact/types'

export type { ContactActionResult } from '@/lib/contact/types'

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
      <div className="border-success-border/30 bg-success-bg rounded border p-6">
        <p className={labelClassName}>Enquiry received</p>
        <h2 className="type-heading-03 text-strong mt-4">
          Thanks for your message.
        </h2>
        <p className="type-body text-muted mt-3 max-w-xl">
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
        <h2 className="type-heading-03 text-strong mt-3">Start an enquiry</h2>
        <p className="type-body text-muted mt-3 max-w-2xl">
          Tell us what you need sourced, blended, packed, or quoted. A short
          brief is enough to start the conversation.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FormLabel className={labelClassName} htmlFor="contact-name">
            Name
          </FormLabel>
          <TextInput
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            value={values.name}
            onChange={updateField('name')}
            className="mt-2 rounded"
          />
        </div>

        <div>
          <FormLabel className={labelClassName} htmlFor="contact-phone">
            Phone
          </FormLabel>
          <TextInput
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={20}
            value={values.phone}
            onChange={updateField('phone')}
            className="mt-2 rounded"
          />
        </div>
      </div>

      <div>
        <FormLabel className={labelClassName} htmlFor="contact-email">
          Email
        </FormLabel>
        <TextInput
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={values.email}
          onChange={updateField('email')}
          className="mt-2 rounded"
        />
      </div>

      <div>
        <FormLabel className={labelClassName} htmlFor="contact-message">
          Message
        </FormLabel>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          maxLength={2000}
          value={values.message}
          onChange={updateField('message')}
          className="mt-2 min-h-40 rounded"
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
          className="type-body-sm border-danger-border/30 bg-danger-bg text-danger-text rounded border p-4"
        >
          {error}
        </p>
      )}

      <div className="border-default flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="type-body-sm text-muted">
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
          {isPending ? 'Sending enquiry…' : 'Send enquiry'}
        </Button>
      </div>
    </form>
  )
}
