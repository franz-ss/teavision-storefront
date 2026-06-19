import { LegacyBridge } from '../_components/legacy-bridge'
import {
  getLegacyAccountBridgeCopy,
  getLegacyAccountLoginStartHref,
  type LegacyAccountSearchParams,
} from '../_lib/legacy-routing'

type AccountRegisterPageProps = {
  searchParams: Promise<LegacyAccountSearchParams>
}

export default async function AccountRegisterPage({
  searchParams,
}: AccountRegisterPageProps) {
  const copy = getLegacyAccountBridgeCopy(['register'])

  return (
    <LegacyBridge
      {...copy}
      primaryHref={getLegacyAccountLoginStartHref(await searchParams)}
    />
  )
}
