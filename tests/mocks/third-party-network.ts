import type { Page } from '@playwright/test'

const ALLOWED_BROWSER_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '[::1]',
  'checkout.test',
])

function isAllowedBrowserRequest(url: string): boolean {
  try {
    return ALLOWED_BROWSER_HOSTS.has(new URL(url).hostname)
  } catch {
    return false
  }
}

export async function blockThirdPartyRequests(page: Page) {
  await page.route('**/*', async (route) => {
    const url = route.request().url()

    if (!isAllowedBrowserRequest(url)) {
      await route.abort()
      return
    }

    await route.continue()
  })
}
