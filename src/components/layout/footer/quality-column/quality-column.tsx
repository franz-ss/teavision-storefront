import Image from 'next/image'

import { QUALITY_IMAGE } from '../data'

// Quality pills are a design/mockup styling element kept per owner decision
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
      {/* Original site HACCP copy (restored from settings_data.json footer text block) */}
      <p className="max-w-[30ch] text-[0.95rem] text-paper/75 leading-normal">
        Teavision runs a HACCP Certified food &amp; safety program to provide
        consistent quality throughout its products.
      </p>
      {/* margin-top: 22px, gap: 10px per design .ft__quality */}
      <div className="flex flex-wrap" style={{ marginTop: '22px', gap: '10px' }}>
        {QUALITY_PILLS.map((pill) => (
          <span
            key={pill}
            className="rounded-full border border-paper/16 bg-paper/5 px-3 py-1.5 font-mono text-[9.5px] tracking-widest uppercase text-paper/80"
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
