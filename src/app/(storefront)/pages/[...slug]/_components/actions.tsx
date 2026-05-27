import { Button } from '@/components/ui'

import type { PageProfile } from '../_lib/page-profile'

export function Actions({ profile }: { profile: PageProfile }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button href={profile.primaryAction.href} className="w-full sm:w-auto">
        {profile.primaryAction.label}
      </Button>
      <Button
        href={profile.secondaryAction.href}
        variant="secondary"
        className="w-full sm:w-auto"
      >
        {profile.secondaryAction.label}
      </Button>
    </div>
  )
}
