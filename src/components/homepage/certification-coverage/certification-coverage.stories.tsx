import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { CertificationCoverage } from './certification-coverage'

const meta: Meta<typeof CertificationCoverage> = {
  title: 'Homepage/CertificationCoverage',
  component: CertificationCoverage,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof CertificationCoverage>

export const Default: Story = {
  args: {},
}
