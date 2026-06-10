'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FormLabel } from '@/components/ui/form-label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { TextInput } from '@/components/ui/text-input'
import {
  CUSTOM_TEA_BLEND_CATEGORIES,
  CUSTOM_TEA_BLEND_FORM_ID,
  CUSTOM_TEA_BLEND_LIMITS,
  CUSTOM_TEA_BLEND_PACK_FORMATS,
} from '@/lib/contact/custom-tea-blend'

import type { Action, ActionResult } from './form-types'

const INITIAL_STATE: ActionResult = { success: false }

export function FormFields({
  action,
  onReset,
}: {
  action: Action
  onReset: () => void
}) {
  const errorRef = useRef<HTMLParagraphElement>(null)
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE)

  useEffect(() => {
    if (state.error) {
      errorRef.current?.focus()
    }
  }, [state.error])

  if (state.success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border-brand/30 bg-brand-tint rounded-lg border p-6"
      >
        <p className="type-mono-meta text-brand">Brief received</p>
        <h2 className="type-heading-03 text-ink mt-3">
          Thanks for sharing your custom tea idea.
        </h2>
        <p className="type-body text-ink-soft mt-3 max-w-2xl">
          Teavision will review the flavour direction, format, and project notes
          before coming back to you. For urgent briefs, call 1300 729 617.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={onReset}
        >
          Send another brief
        </Button>
      </div>
    )
  }

  return (
    <form
      id={CUSTOM_TEA_BLEND_FORM_ID}
      action={formAction}
      className="grid gap-6"
      aria-label="Custom tea blend enquiry form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <FormLabel htmlFor="brief-name">Full name</FormLabel>
          <TextInput
            id="brief-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={CUSTOM_TEA_BLEND_LIMITS.field}
          />
        </div>

        <div className="grid gap-2">
          <FormLabel htmlFor="brief-email">Email</FormLabel>
          <TextInput
            id="brief-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={254}
            spellCheck={false}
          />
        </div>

        <div className="grid gap-2">
          <FormLabel htmlFor="brief-company">Company</FormLabel>
          <TextInput
            id="brief-company"
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={CUSTOM_TEA_BLEND_LIMITS.field}
          />
        </div>

        <div className="grid gap-2">
          <FormLabel htmlFor="brief-phone">Phone</FormLabel>
          <TextInput
            id="brief-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
          />
        </div>

        <div className="grid gap-2">
          <FormLabel htmlFor="brief-category">Blend category</FormLabel>
          <Select
            id="brief-category"
            name="blendCategory"
            defaultValue={CUSTOM_TEA_BLEND_CATEGORIES[0]}
          >
            {CUSTOM_TEA_BLEND_CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </Select>
        </div>

        <div className="grid gap-2">
          <FormLabel htmlFor="brief-format">Preferred format</FormLabel>
          <Select
            id="brief-format"
            name="packFormat"
            defaultValue={CUSTOM_TEA_BLEND_PACK_FORMATS[0]}
          >
            {CUSTOM_TEA_BLEND_PACK_FORMATS.map((format) => (
              <option key={format}>{format}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <FormLabel htmlFor="brief-notes">Project brief</FormLabel>
        <Textarea
          id="brief-notes"
          name="brief"
          rows={6}
          required
          maxLength={CUSTOM_TEA_BLEND_LIMITS.brief}
          placeholder="Example: peach green tea for boxed sachets, low sugar, Australian retail launch in spring…"
        />
      </div>

      <div hidden>
        <label htmlFor="brief-website">Website</label>
        <input
          id="brief-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.error && (
        <p
          ref={errorRef}
          id="brief-form-error"
          role="alert"
          tabIndex={-1}
          className="type-body-sm border-danger bg-danger-tint text-danger rounded-md border p-4"
        >
          {state.error}
        </p>
      )}

      <div className="border-hairline flex flex-col gap-4 border-t pt-6 lg:flex-row lg:items-center lg:justify-between">
        <p className="type-body-sm text-ink-soft max-w-prose">
          Your brief is sent to Teavision&rsquo;s product development team.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="submit"
            variant="brand"
            size="lg"
            isLoading={isPending}
            disabled={isPending}
            aria-describedby={state.error ? 'brief-form-error' : undefined}
          >
            <Mail className="size-4" aria-hidden="true" />
            {isPending ? 'Sending brief…' : 'Send custom blend brief'}
          </Button>
          <Button
            href="mailto:info@teavision.com.au?subject=Custom%20Blend%20Discussion"
            variant="secondary"
            size="lg"
          >
            Email instead
          </Button>
        </div>
      </div>
    </form>
  )
}
