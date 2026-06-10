import Image from 'next/image'

import { cn } from '@/lib/utils'

const ILLO_MAP = {
  handshake: {
    src: '/images/illo-handshake.png',
    width: 268,
    height: 268,
    className: 'w-[clamp(188px,23.5vw,252px)]',
  },
  cup: {
    src: '/images/illo-cup.png',
    width: 268,
    height: 268,
    className: 'w-[clamp(184px,23vw,248px)]',
  },
  teapot: {
    src: '/images/illo-teapot.png',
    width: 268,
    height: 268,
    className: 'w-[clamp(200px,25vw,268px)]',
  },
} as const

export type BrushCircleIllo = keyof typeof ILLO_MAP

export type BrushCircleProps = {
  illo: BrushCircleIllo
  className?: string
}

export function BrushCircle({ illo, className }: BrushCircleProps) {
  const asset = ILLO_MAP[illo]

  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-bc-float motion-reduce:animate-none',
        asset.className,
        className,
      )}
    >
      <Image
        src={asset.src}
        alt=""
        width={asset.width}
        height={asset.height}
        className="h-auto w-full object-contain"
        sizes="(min-width: 1024px) 18vw, 268px"
      />
    </div>
  )
}
