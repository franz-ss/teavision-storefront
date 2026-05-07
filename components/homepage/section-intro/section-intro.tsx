import { cn } from '@/lib/utils'

type SectionIntroProps = {
  title: string
  copy: string
  align?: 'center' | 'left'
}

export function SectionIntro({
  title,
  copy,
  align = 'center',
}: SectionIntroProps) {
  return (
    <div
      className={cn('max-w-prose', align === 'center' && 'mx-auto text-center')}
    >
      <h2 className="type-heading-02 text-strong">{title}</h2>
      <p className="type-body text-muted mt-4">{copy}</p>
    </div>
  )
}
