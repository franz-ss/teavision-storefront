'use client'

import { useId, useRef, useState, useTransition, type SubmitEvent } from 'react'

import { Button, FormLabel, Textarea, TextInput } from '@/components/ui'
import type { ContactActionResult } from '@/lib/contact/types'
import { cn } from '@/lib/utils'

type ContactSectionFormProps = {
  action: (formData: FormData) => Promise<ContactActionResult>
}

const DEFAULT_ERROR =
  'Unable to send your message right now. Please try again shortly.'

export function ContactSectionForm({ action }: ContactSectionFormProps) {
  const id = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
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

  const messageId = status === 'success' ? `${id}-success` : `${id}-error`
  const hasMessage = status === 'success' || Boolean(error)

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      aria-busy={isPending}
      className="grid gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <FormLabel htmlFor={`${id}-name`}>Name</FormLabel>
          <TextInput
            id={`${id}-name`}
            name="name"
            required
            maxLength={100}
            placeholder="Enter Name"
          />
        </div>
        <div className="grid gap-2">
          <FormLabel htmlFor={`${id}-phone`}>Number</FormLabel>
          <TextInput
            id={`${id}-phone`}
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
            placeholder="Enter Number"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <FormLabel htmlFor={`${id}-email`}>Email</FormLabel>
        <TextInput
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="Enter Email"
        />
      </div>
      <div className="grid gap-2">
        <FormLabel htmlFor={`${id}-message`}>Message</FormLabel>
        <Textarea
          id={`${id}-message`}
          name="message"
          required
          maxLength={2000}
          rows={5}
          placeholder="Enter Message"
        />
      </div>
      <div className="sr-only" aria-hidden="true">
        <input
          id={`${id}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <Button
        type="submit"
        variant="brand"
        size="cta"
        isLoading={isPending}
        disabled={isPending}
      >
        {isPending ? 'Sending…' : 'Submit'}
      </Button>
      {hasMessage ? (
        <p
          id={messageId}
          role={status === 'success' ? 'status' : 'alert'}
          aria-live="polite"
          className={cn(
            'type-body-sm rounded-md border p-3',
            status === 'success'
              ? 'border-brand bg-brand-tint text-brand'
              : 'border-danger bg-danger-tint text-danger',
          )}
        >
          {status === 'success'
            ? 'Thanks. The Teavision team will review your enquiry shortly.'
            : error}
        </p>
      ) : null}
    </form>
  )
}
