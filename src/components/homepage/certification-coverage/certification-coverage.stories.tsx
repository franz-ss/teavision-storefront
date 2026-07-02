import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { CERTIFICATION_COVERAGE_FIXTURE } from '../content'
import { CertificationCoverage } from './certification-coverage'

const meta: Meta<typeof CertificationCoverage> = {
  title: 'Homepage/CertificationCoverage',
  component: CertificationCoverage,
  tags: ['autodocs'],
  args: CERTIFICATION_COVERAGE_FIXTURE,
}
export default meta

type Story = StoryObj<typeof CertificationCoverage>

export const Default: Story = {
  args: {},
}
