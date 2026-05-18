const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teavision.com.au'

export function getSiteUrl(path = '/'): string {
  return new URL(path, SITE_URL).toString()
}
