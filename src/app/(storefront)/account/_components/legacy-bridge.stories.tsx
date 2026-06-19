import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'

import { LegacyBridge } from './legacy-bridge'

const meta: Meta<typeof LegacyBridge> = {
  title: 'Account/LegacyBridge',
  component: LegacyBridge,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div className="bg-paper px-gutter py-section">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof LegacyBridge>

export const Register: Story = {
  args: {
    body: 'Classic account registration has moved to the modern Shopify customer account flow.',
    heading: 'Create your account with Shopify',
    primaryHref: '/account/login/start?returnTo=%2Faccount',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByText('Teavision now uses Shopify-hosted Customer Account sign-in.'),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('link', { name: 'Sign in with Shopify' }),
    ).toHaveAttribute('href', '/account/login/start?returnTo=%2Faccount')
  },
}

export const Recover: Story = {
  args: {
    body: 'Classic password recovery has moved. Start Shopify sign-in and use the hosted account recovery options when prompted.',
    heading: 'Recover your account with Shopify',
    primaryHref: '/account/login/start?returnTo=%2Faccount',
  },
}

export const VerificationFailed: Story = {
  args: {
    body: 'We could not verify that account link. Start sign-in again to continue through the secure Shopify account flow.',
    heading: 'Account link could not be verified',
    primaryHref: '/account/login/start?returnTo=%2Faccount',
  },
}

export const UnknownRoute: Story = {
  args: {
    body: 'This classic account link is no longer used by the headless storefront. Start Shopify sign-in or contact support if you need help finding an order.',
    heading: 'Account access has moved',
    primaryHref: '/account/login/start?returnTo=%2Faccount',
  },
}
