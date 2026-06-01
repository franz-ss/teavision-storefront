type SectionHeadingProps = {
  copy?: string
  highlight?: string
  title: string
}

export function SectionHeading({
  copy,
  highlight,
  title,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <h2 className="type-heading-02 text-strong">
        {title}
        {highlight ? <span className="text-brand"> {highlight}</span> : null}
      </h2>
      {copy ? (
        <p className="type-body text-muted mx-auto mt-5 max-w-3xl">{copy}</p>
      ) : null}
    </div>
  )
}
