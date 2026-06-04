import type { StorybookConfig } from '@storybook/nextjs-vite'

import baseConfig from '../.storybook/main.ts'

const config: StorybookConfig = {
  ...baseConfig,
  stories: [
    '../src/app/**/_components/cart-line-actions.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/app/**/_components/cart-view.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/components/collection/product-card/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/components/product/product-form/product-form.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/components/product/product-quick-view/product-quick-view.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/components/ui/quantity-stepper/quantity-stepper.stories.@(js|jsx|mjs|ts|tsx)',
  ],
}

export default config
