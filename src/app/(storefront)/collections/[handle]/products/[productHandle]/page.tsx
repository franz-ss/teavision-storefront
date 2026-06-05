import { permanentRedirect } from 'next/navigation'

type Props = {
  params: Promise<{ handle: string; productHandle: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function createSearchParamsString(
  searchParams: Record<string, string | string[] | undefined>,
): string {
  const params = new URLSearchParams()

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value === undefined) return

    if (Array.isArray(value)) {
      value.forEach((item) => {
        params.append(key, item)
      })
      return
    }

    params.set(key, value)
  })

  return params.toString()
}

export default async function Page({ params, searchParams }: Props) {
  const { productHandle } = await params
  const queryString = createSearchParamsString(await searchParams)
  const productPath = `/products/${encodeURIComponent(productHandle)}`

  permanentRedirect(queryString ? `${productPath}?${queryString}` : productPath)
}
