import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { makeCustomerAccountProfile } from '@/tests/fixtures/shopify/customer-account'
import type { CustomerAccountFormState } from '@/lib/shopify/customer-account/types'

import { ProfileForm } from './profile-form'

const meta: Meta<typeof ProfileForm> = {
  title: 'Account/ProfileForm',
  component: ProfileForm,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div className="bg-paper px-gutter py-section">
        <div className="mx-auto max-w-3xl">
          <Story />
        </div>
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof ProfileForm>

const successAction = async (previousState: CustomerAccountFormState) =>
  previousState

export const Loaded: Story = {
  args: {
    action: successAction,
    profile: makeCustomerAccountProfile(),
  },
}

export const FieldError: Story = {
  name: 'field-error',
  args: {
    ...Loaded.args,
    initialState: {
      fieldErrors: { phone: 'Enter a valid phone number.' },
      message: null,
      status: 'error',
    },
  },
}

export const FormLevelError: Story = {
  name: 'form-level-error',
  args: {
    ...Loaded.args,
    initialState: {
      fieldErrors: {},
      message: 'We could not update your profile. Please try again.',
      status: 'error',
    },
  },
}

export const PendingSubmit: Story = {
  name: 'pending-submit',
  args: {
    ...Loaded.args,
    isPendingOverride: true,
  },
}
