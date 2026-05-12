import Image from 'next/image'
import Link from 'next/link'

import { Button, Section } from '@/components/ui'

import { JOURNAL_ARTICLES } from '../content'

export function TeaJournal() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <div className="flex items-end justify-between gap-8">
          <Section.Intro
            align="left"
            variant="compact"
            title="Tea Journal"
            copy="Stay updated with insights, guides, and stories from the world of tea and spices. From the health benefits of herbal teas to sourcing bulk herbs and spices, our Tea Journal is here to inspire and educate."
          />

          <div className="shrink-0">
            <Button size="lg" href="/blogs/teavision-blogs">
              View All
            </Button>
          </div>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {JOURNAL_ARTICLES.map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className="border-default group focus-visible:ring-ring relative block overflow-hidden rounded-md border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <div className="relative aspect-video">
                <Image
                  src={article.image.src}
                  alt={article.image.alt}
                  fill
                  sizes="(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 48vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>

              <div className="border-default border-t p-5">
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
          ))}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
