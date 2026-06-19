'use client'

import { useActionState } from 'react'

import { Button, Card, FormLabel, TextInput } from '@/components/ui'
import type { CustomerAccountProfile } from '@/lib/shopify/customer-account'
import type { CustomerAccountFormState } from '@/lib/shopify/customer-account/types'

type ProfileFormProps = {
  action: (
    previousState: CustomerAccountFormState,
    formData: FormData,
  ) => Promise<CustomerAccountFormState>
  initialState?: CustomerAccountFormState
  isPendingOverride?: boolean
  profile: CustomerAccountProfile
}

const initialProfileFormState: CustomerAccountFormState = {
  fieldErrors: {},
  message: null,
  status: 'idle',
}

export function ProfileForm({
  action,
  initialState = initialProfileFormState,
  isPendingOverride,
  profile,
}: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState)
  const pending = isPendingOverride ?? isPending
  const firstNameError = state.fieldErrors.firstName
  const lastNameError = state.fieldErrors.lastName
  const phoneError = state.fieldErrors.phone

  return (
    <Card padding="lg" radius="lg" tone="surface">
      <form action={formAction} className="grid gap-6">
        <div className="grid gap-2">
          <h1 className="type-heading-01 text-ink">Profile</h1>
          <p className="type-body-sm text-ink-soft">
            Update the contact details Shopify allows us to manage here.
          </p>
        </div>

        {state.message ? (
          <p
            className="type-body-sm bg-paper-2 border-hairline text-ink rounded-md border px-3 py-2"
            role={state.status === 'error' ? 'alert' : 'status'}
            aria-live={state.status === 'success' ? 'polite' : undefined}
          >
            {state.message}
          </p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <FormLabel htmlFor="firstName">First name</FormLabel>
            <TextInput
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              defaultValue={profile.firstName ?? ''}
              aria-invalid={firstNameError ? true : undefined}
              aria-describedby={
                firstNameError ? 'profile-first-name-error' : undefined
              }
            />
            {firstNameError ? (
              <p
                id="profile-first-name-error"
                className="type-body-sm text-danger"
              >
                {firstNameError}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <FormLabel htmlFor="lastName">Last name</FormLabel>
            <TextInput
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              defaultValue={profile.lastName ?? ''}
              aria-invalid={lastNameError ? true : undefined}
              aria-describedby={
                lastNameError ? 'profile-last-name-error' : undefined
              }
            />
            {lastNameError ? (
              <p
                id="profile-last-name-error"
                className="type-body-sm text-danger"
              >
                {lastNameError}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <FormLabel htmlFor="phone">Phone</FormLabel>
            <TextInput
              id="phone"
              name="phone"
              autoComplete="tel"
              defaultValue={profile.phoneNumber ?? ''}
              aria-invalid={phoneError ? true : undefined}
              aria-describedby={phoneError ? 'profile-phone-error' : undefined}
            />
            {phoneError ? (
              <p id="profile-phone-error" className="type-body-sm text-danger">
                {phoneError}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <p className="type-mono-meta text-ink-faint">Email</p>
            <p className="type-body-sm border-hairline bg-paper-2 text-ink min-h-12 rounded-sm border px-4 py-3.5">
              {profile.emailAddress ?? 'Unavailable'}
            </p>
            <p className="type-body-sm text-ink-soft">
              Email changes are managed through Shopify account sign-in.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button href="/account" variant="secondary">
            Return to account
          </Button>
          <Button
            type="submit"
            variant="brand"
            disabled={pending}
            isLoading={pending}
          >
            Update profile
          </Button>
        </div>
      </form>
    </Card>
  )
}
