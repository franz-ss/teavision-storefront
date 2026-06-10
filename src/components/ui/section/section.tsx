import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

import { Eyebrow } from '../eyebrow'

const sectionVariants = cva('', {
  variants: {
    tone: {
      surface: 'bg-paper text-ink',
      sunken: 'bg-paper-2 text-ink',
      brand: 'bg-brand-deep text-paper',
      brandStrong: 'bg-brand-deep text-paper',
      inverse: 'bg-ink text-paper',
      transparent: '',
    },
    spacing: {
      default: 'py-section',
      compact: 'py-8 md:py-12',
      none: '',
    },
  },
  defaultVariants: {
    tone: 'surface',
    spacing: 'default',
  },
})

const containerVariants = cva('mx-auto px-gutter', {
  variants: {
    variant: {
      default: 'max-w-wide',
      compact: 'max-w-prose',
      base: 'max-w-base',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface SectionRootProps
  extends
    React.ComponentPropsWithoutRef<'section'>,
    VariantProps<typeof sectionVariants> {}

function Root({
  children,
  className,
  spacing,
  tone,
  ...props
}: SectionRootProps) {
  return (
    <section
      className={cn(sectionVariants({ spacing, tone, className }))}
      {...props}
    >
      {children}
    </section>
  )
}

export interface SectionContainerProps
  extends
    React.ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof containerVariants> {}

function Container({
  children,
  className,
  variant,
  ...props
}: SectionContainerProps) {
  return (
    <div className={cn(containerVariants({ variant, className }))} {...props}>
      {children}
    </div>
  )
}

export interface SectionIntroProps extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'title'
> {
  variant?: 'default' | 'compact'
  align?: 'center' | 'left'
  eyebrow?: string
  copy?: React.ReactNode
  title: React.ReactNode
}

function Intro({
  align = 'center',
  className,
  eyebrow,
  copy,
  title,
  ...props
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        'max-w-prose',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
      {...props}
    >
      {eyebrow ? (
        <Eyebrow className={cn('mb-4', align === 'center' && 'justify-center')}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2 className="type-heading-01 text-current">{title}</h2>
      {copy ? (
        <p className="type-lede mt-4 text-ink-soft">{copy}</p>
      ) : null}
    </div>
  )
}

export const Section = { Root, Container, Intro }
