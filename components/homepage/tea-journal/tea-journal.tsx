import Image from 'next/image'
import Link from 'next/link'

import { Section } from '@/components/ui'

import { JOURNAL_ARTICLES } from '../content'
import { SectionIntro } from '../section-intro'

export function TeaJournal() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionIntro
            align="left"
            title="Tea Journal"
            copy="Stay updated with insights, guides, and stories from the world of tea and spices. From the health benefits of herbal teas to sourcing bulk herbs and spices, our Tea Journal is here to inspire and educate."
          />
          <Link
            href="/blogs/teavision-blogs"
            className="type-label text-brand hover:text-link-hover focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            View All
          </Link>
        </div>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {JOURNAL_ARTICLES.map((article) => (
            <li key={article.href}>
              <Link
                href={article.href}
                className="group focus-visible:ring-ring bg-surface shadow-1 block overflow-hidden rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Image
                  src={article.image.src}
                  alt={article.image.alt}
                  width={article.image.width}
                  height={article.image.height}
                  sizes="(min-width: 768px) 31vw, 100vw"
                  className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="border-default border-x border-b p-5">
                  <p className="type-caption text-muted">{article.date}</p>
                  <h3 className="type-heading-05 text-strong group-hover:text-brand mt-3 transition-colors">
                    {article.title}
                  </h3>
                  <p className="type-body-sm text-muted mt-3">
                    {article.excerpt}
                  </p>
                  <span className="type-label text-brand mt-5 inline-flex">
                    Read More
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
