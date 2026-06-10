type SectionHeadingProps = {
  copy?: string
  eyebrow?: string
  highlight?: string
  title: string
}

export function SectionHeading({
  copy,
  eyebrow,
  highlight,
  title,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      {eyebrow ? (
        <p className="type-eyebrow text-brand mb-4 inline-flex items-center justify-center gap-2.5 before:h-px before:w-5.5 before:bg-current before:opacity-60">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="type-heading-02 text-ink">
        {title}
        {highlight ? (
          <span className="text-gold-deep"> {highlight}</span>
        ) : null}
      </h2>
      {copy ? (
        <p className="type-body text-ink-soft mx-auto mt-5 max-w-3xl">{copy}</p>
      ) : null}
    </div>
  )
}
