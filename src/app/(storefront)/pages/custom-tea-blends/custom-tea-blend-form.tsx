'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormLabel } from '@/components/ui/form-label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { TextInput } from '@/components/ui/text-input'
import {
  CUSTOM_TEA_BLEND_CATEGORIES,
  CUSTOM_TEA_BLEND_FLAVOUR_GROUPS,
  CUSTOM_TEA_BLEND_LIMITS,
  CUSTOM_TEA_BLEND_PACK_FORMATS,
} from '@/lib/contact/custom-tea-blend'

type CustomTeaBlendActionResult = {
  success: boolean
  error?: string
}

type CustomTeaBlendFormProps = {
  action: (
    previousState: CustomTeaBlendActionResult,
    formData: FormData,
  ) => Promise<CustomTeaBlendActionResult>
}

const INITIAL_STATE: CustomTeaBlendActionResult = { success: false }

export function CustomTeaBlendForm({ action }: CustomTeaBlendFormProps) {
  const [formKey, setFormKey] = useState(0)

  return (
    <CustomTeaBlendFormFields
      key={formKey}
      action={action}
      onReset={() => setFormKey((key) => key + 1)}
    />
  )
}

function CustomTeaBlendFormFields({
  action,
  onReset,
}: CustomTeaBlendFormProps & { onReset: () => void }) {
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
        className="border-success-border bg-success-bg rounded-lg border p-6"
      >
        <p className="type-eyebrow text-success-text">Brief received</p>
        <h2 className="type-heading-03 text-strong mt-3">
          Thanks for sharing your custom tea idea.
        </h2>
        <p className="type-body text-muted mt-3 max-w-2xl">
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
      action={formAction}
      className="grid gap-6"
      aria-label="Custom tea blend enquiry form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <FormLabel htmlFor="custom-blend-name">Full name</FormLabel>
          <TextInput
            id="custom-blend-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={CUSTOM_TEA_BLEND_LIMITS.field}
          />
        </div>

        <div className="grid gap-2">
          <FormLabel htmlFor="custom-blend-email">Email</FormLabel>
          <TextInput
            id="custom-blend-email"
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
          <FormLabel htmlFor="custom-blend-company">Company</FormLabel>
          <TextInput
            id="custom-blend-company"
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={CUSTOM_TEA_BLEND_LIMITS.field}
          />
        </div>

        <div className="grid gap-2">
          <FormLabel htmlFor="custom-blend-phone">Phone</FormLabel>
          <TextInput
            id="custom-blend-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
          />
        </div>

        <div className="grid gap-2">
          <FormLabel htmlFor="custom-blend-category">Blend category</FormLabel>
          <Select
            id="custom-blend-category"
            name="blendCategory"
            defaultValue={CUSTOM_TEA_BLEND_CATEGORIES[0]}
          >
            {CUSTOM_TEA_BLEND_CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </Select>
        </div>

        <div className="grid gap-2">
          <FormLabel htmlFor="custom-blend-format">Preferred format</FormLabel>
          <Select
            id="custom-blend-format"
            name="packFormat"
            defaultValue={CUSTOM_TEA_BLEND_PACK_FORMATS[0]}
          >
            {CUSTOM_TEA_BLEND_PACK_FORMATS.map((format) => (
              <option key={format}>{format}</option>
            ))}
          </Select>
        </div>
      </div>

      <fieldset className="border-default rounded-lg border p-4">
        <legend className="type-eyebrow text-muted px-2">
          Flavour direction
        </legend>
        <p className="type-body-sm text-muted mt-1">
          Select any useful starting points. The team can also work from a
          reference product or flavour note.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {CUSTOM_TEA_BLEND_FLAVOUR_GROUPS.map((group) => (
            <div key={group.name}>
              <p className="type-label text-strong">{group.name}</p>
              <div className="mt-3 grid gap-2">
                {group.options.map((flavour) => (
                  <label
                    key={flavour}
                    className="type-body-sm border-default bg-surface hover:bg-surface-sunken flex min-h-11 items-center gap-3 rounded-md border px-3 transition-colors"
                  >
                    <Checkbox name="flavours" value={flavour} />
                    <span>{flavour}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <FormLabel htmlFor="custom-blend-brief">Project brief</FormLabel>
        <Textarea
          id="custom-blend-brief"
          name="brief"
          rows={6}
          required
          maxLength={CUSTOM_TEA_BLEND_LIMITS.brief}
          placeholder="Example: peach green tea for boxed sachets, low sugar, Australian retail launch in spring…"
        />
      </div>

      <div hidden>
        <label htmlFor="custom-blend-website">Website</label>
        <input
          id="custom-blend-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.error && (
        <p
          ref={errorRef}
          id="custom-blend-form-error"
          role="alert"
          tabIndex={-1}
          className="type-body-sm border-danger-border bg-danger-bg text-danger-text rounded-md border p-4"
        >
          {state.error}
        </p>
      )}

      <div className="border-default flex flex-col gap-4 border-t pt-6 lg:flex-row lg:items-center lg:justify-between">
        <p className="type-body-sm text-muted max-w-prose">
          Your brief is sent to Teavision&rsquo;s product development team.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="submit"
            size="lg"
            isLoading={isPending}
            disabled={isPending}
            aria-describedby={
              state.error ? 'custom-blend-form-error' : undefined
            }
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
