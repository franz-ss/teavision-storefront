import { LegacyBridge } from '../../_components/legacy-bridge'
import {
  getLegacyAccountBridgeCopy,
  getLegacyAccountLoginStartHref,
  type LegacyAccountSearchParams,
} from '../../_lib/legacy-routing'

type AccountActivatePageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<LegacyAccountSearchParams>
}

export default async function AccountActivatePage({
  params,
  searchParams,
}: AccountActivatePageProps) {
  void (await params).id
  const copy = getLegacyAccountBridgeCopy(['activate'])

  return (
    <LegacyBridge
      {...copy}
      primaryHref={getLegacyAccountLoginStartHref(await searchParams)}
    />
  )
}
