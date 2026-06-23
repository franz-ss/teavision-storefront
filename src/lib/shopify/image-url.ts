type ShopifyImageTransform = {
  crop?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  height?: number
  width?: number
}

function appendImageParams(
  source: string,
  transform: ShopifyImageTransform,
): string {
  const params = new URLSearchParams()

  if (transform.crop) params.set('crop', transform.crop)
  if (transform.height) params.set('height', String(transform.height))
  if (transform.width) params.set('width', String(transform.width))

  const query = params.toString()
  if (!query) return source

  return `${source}${source.includes('?') ? '&' : '?'}${query}`
}

export function getShopifyImageUrl(
  source: string,
  transform: ShopifyImageTransform,
): string {
  const normalizedSource = source.startsWith('//') ? `https:${source}` : source

  try {
    const url = new URL(normalizedSource)

    if (transform.crop) url.searchParams.set('crop', transform.crop)
    if (transform.height) {
      url.searchParams.set('height', String(transform.height))
    }
    if (transform.width) url.searchParams.set('width', String(transform.width))

    return url.toString()
  } catch {
    return appendImageParams(normalizedSource, transform)
  }
}

export function getSizedShopifyImageUrl(source: string, width: number): string {
  if (source.startsWith('/')) return source

  return getShopifyImageUrl(source, { width })
}
