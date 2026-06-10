import Image from 'next/image'

import { cn } from '@/lib/utils'

export type StampProps = {
  top: string
  bottom: string
  id?: string
  className?: string
}

export function Stamp({ top, bottom, id = 'stamp', className }: StampProps) {
  const tArcId = `${id}-arcT`
  const bArcId = `${id}-arcB`
  const R = 64

  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-st-float motion-reduce:animate-none',
        'relative w-[clamp(140px,14vw,200px)]',
        className,
      )}
    >
      <Image
        src="/images/stamp-ring.png"
        alt=""
        width={200}
        height={200}
        className="h-auto w-full object-contain"
        sizes="(min-width: 1024px) 14vw, 200px"
      />
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full font-script"
      >
        <defs>
          {/* top arc: left to right over the top (text upright) */}
          <path
            id={tArcId}
            d={`M ${100 - R} 100 A ${R} ${R} 0 0 1 ${100 + R} 100`}
            fill="none"
          />
          {/* bottom arc: left to right under the bottom (text upright) */}
          <path
            id={bArcId}
            d={`M ${100 - R} 103 A ${R} ${R} 0 0 0 ${100 + R} 103`}
            fill="none"
          />
        </defs>
        <text
          textAnchor="middle"
          className="fill-paper"
          style={{ fontSize: 26 }}
        >
          <textPath href={`#${tArcId}`} startOffset="50%">
            {top}
          </textPath>
        </text>
        <text
          textAnchor="middle"
          className="fill-paper"
          style={{ fontSize: 32 }}
        >
          <textPath href={`#${bArcId}`} startOffset="50%">
            {bottom}
          </textPath>
        </text>
      </svg>
    </div>
  )
}
