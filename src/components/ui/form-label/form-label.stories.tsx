import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { FormLabel } from './form-label'
import { TextInput } from '../text-input'

const meta: Meta<typeof FormLabel> = {
  title: 'UI/FormLabel',
  component: FormLabel,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof FormLabel>

export const Default: Story = {
  args: {
    children: 'Email address',
    htmlFor: 'storybook-form-label-email',
  },
  render: (args) => (
    <div className="grid max-w-sm gap-2">
      <FormLabel {...args} />
      <TextInput
        id="storybook-form-label-email"
        type="email"
        placeholder="you@brand.com"
      />
    </div>
  ),
}
