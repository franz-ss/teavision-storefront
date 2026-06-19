import { LegacyBridge } from '../_components/legacy-bridge'
import {
  getLegacyAccountBridgeCopy,
  getLegacyAccountLoginStartHref,
  type LegacyAccountSearchParams,
} from '../_lib/legacy-routing'

type AccountRecoverPageProps = {
  searchParams: Promise<LegacyAccountSearchParams>
}

export default async function AccountRecoverPage({
  searchParams,
}: AccountRecoverPageProps) {
  const copy = getLegacyAccountBridgeCopy(['recover'])

  return (
    <LegacyBridge
      {...copy}
      primaryHref={getLegacyAccountLoginStartHref(await searchParams)}
    />
  )
}
