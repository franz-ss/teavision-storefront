import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/nextjs-vite'
import type { AliasOptions } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

function withCartActionsAlias(alias: AliasOptions | undefined): AliasOptions {
  const cartActionsMock = path.resolve(dirname, 'mocks/cart-actions.ts')

  if (Array.isArray(alias)) {
    return [
      ...alias,
      { find: '@/lib/cart/actions', replacement: cartActionsMock },
    ]
  }

  return {
    ...(alias ?? {}),
    '@/lib/cart/actions': cartActionsMock,
  }
}

const config: StorybookConfig = {
  stories: [
    '../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/app/**/_components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
  viteFinal(config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: withCartActionsAlias(config.resolve?.alias),
      },
      build: {
        ...config.build,
        chunkSizeWarningLimit: 1400,
        rolldownOptions: {
          ...config.build?.rolldownOptions,
          checks: {
            ...config.build?.rolldownOptions?.checks,
            pluginTimings: false,
          },
        },
      },
    }
  },
}
export default config
