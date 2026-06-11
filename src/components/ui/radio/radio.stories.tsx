import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Radio } from './radio'

const meta: Meta<typeof Radio> = {
  title: 'UI/Radio',
  component: Radio,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Radio>

export const Default: Story = {
  args: {
    defaultChecked: false,
    name: 'certifiedOrganic',
    value: 'YES',
  },
  render: (args) => (
    <label className="type-body-sm text-ink flex items-center gap-3">
      <Radio {...args} />
      <span>Yes</span>
    </label>
  ),
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
    name: 'certifiedOrganic',
    value: 'YES',
  },
  render: (args) => (
    <label className="type-body-sm text-ink flex items-center gap-3">
      <Radio {...args} />
      <span>Yes (checked)</span>
    </label>
  ),
}

export const Group: Story = {
  render: () => (
    <fieldset className="flex items-center gap-6">
      <legend className="type-mono-meta text-ink-faint mb-3">
        Certified organic
      </legend>
      <label className="type-body-sm text-ink flex items-center gap-3">
        <Radio name="organic-group" value="YES" defaultChecked />
        <span>Yes</span>
      </label>
      <label className="type-body-sm text-ink flex items-center gap-3">
        <Radio name="organic-group" value="NO" />
        <span>No</span>
      </label>
    </fieldset>
  ),
}

export const Disabled: Story = {
  args: {
    defaultChecked: false,
    disabled: true,
    name: 'certifiedOrganic',
    value: 'NO',
  },
  render: (args) => (
    <label className="type-body-sm text-ink-faint flex items-center gap-3">
      <Radio {...args} />
      <span>No (disabled)</span>
    </label>
  ),
}
