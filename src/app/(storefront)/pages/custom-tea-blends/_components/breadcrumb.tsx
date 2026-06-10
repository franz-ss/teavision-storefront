import Link from 'next/link'

export function Breadcrumb() {
  return (
    <nav className="type-mono-meta text-paper/65 mb-8" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2" role="list">
        <li>
          <Link
            href="/"
            className="hover:text-paper focus-visible:ring-ring rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-gold" aria-current="page">
          Custom tea blending
        </li>
      </ol>
    </nav>
  )
}
