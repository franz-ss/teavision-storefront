import Image from 'next/image'

import { QUALITY_IMAGE } from '../data'

export function QualityColumn() {
  return (
    <div>
      <h3 className="text-footer-muted mb-4 font-sans text-base leading-[1.4] font-semibold">
        Quality
      </h3>
      <p className="text-on-brand max-w-100 text-base leading-[1.4]">
        Teavision runs a HACCP Certified food &amp; safety program to provide
        consistent quality throughout its products.
      </p>
      <Image
        src={QUALITY_IMAGE.src}
        sizes="181px"
        width={QUALITY_IMAGE.width}
        height={QUALITY_IMAGE.height}
        alt={QUALITY_IMAGE.alt}
        className="mt-5 h-17.5 w-45.25 max-w-full object-contain"
      />
    </div>
  )
}
