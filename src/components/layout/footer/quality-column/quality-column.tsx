import Image from 'next/image'

import { QUALITY_IMAGE } from '../data'

const QUALITY_PILLS = [
  'HACCP Certified',
  'ACO Organic',
  'USDA Organic',
  'Ethically Sourced',
]

export function QualityColumn() {
  return (
    <div>
      <h3 className="mb-4.5 font-mono text-[10.5px] tracking-[0.16em] uppercase text-gold">
        Quality
      </h3>
      <p className="max-w-[30ch] text-[0.95rem] text-paper/75 leading-normal">
        Australia&apos;s leading wholesale tea, herb &amp; spice house. Certified
        organic, award-winning, ethically sourced.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {QUALITY_PILLS.map((pill) => (
          <span
            key={pill}
            className="type-mono-meta rounded-full border border-paper/15 bg-paper/5 px-3 py-1.5 text-paper/80"
          >
            {pill}
          </span>
        ))}
      </div>
      <Image
        src={QUALITY_IMAGE.src}
        sizes="181px"
        width={QUALITY_IMAGE.width}
        height={QUALITY_IMAGE.height}
        alt={QUALITY_IMAGE.alt}
        className="mt-5 h-17.5 w-45.25 max-w-full object-contain opacity-80"
      />
    </div>
  )
}
