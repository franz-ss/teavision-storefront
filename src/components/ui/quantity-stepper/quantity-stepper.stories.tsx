import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { QuantityStepper } from './quantity-stepper'

const meta: Meta<typeof QuantityStepper> = {
  title: 'Ui/QuantityStepper',
  component: QuantityStepper,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof QuantityStepper>

export const Default: Story = {
  args: {
    value: 2,
    min: 1,
    label: 'Quantity',
  },
  render: function QuantityStepperStory(args) {
    const [value, setValue] = useState(args.value ?? 1)

    return (
      <QuantityStepper
        {...args}
        value={value}
        onChange={(nextValue) => setValue(nextValue)}
      />
    )
  },
}

export const WithMaximum: Story = {
  args: {
    value: 4,
    min: 1,
    max: 6,
    label: 'Sample quantity',
  },
  render: function QuantityStepperStory(args) {
    const [value, setValue] = useState(args.value ?? 1)

    return (
      <QuantityStepper
        {...args}
        value={value}
        onChange={(nextValue) => setValue(nextValue)}
      />
    )
  },
}
