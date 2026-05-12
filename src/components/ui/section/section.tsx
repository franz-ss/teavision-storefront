import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const sectionVariants = cva('', {
  variants: {
    tone: {
      surface: 'bg-surface text-default',
      sunken: 'bg-surface-sunken text-default',
      brand: 'bg-brand text-on-brand',
      brandStrong: 'bg-brand-strong text-on-brand',
      inverse: 'bg-inverse text-on-brand',
      transparent: '',
    },
    spacing: {
      default: 'py-10 md:py-24',
      compact: 'py-4 md:py-8',
      none: '',
    },
  },
  defaultVariants: {
    tone: 'surface',
    spacing: 'default',
  },
})

const containerVariants = cva('mx-auto px-4 md:px-6 lg:px-8', {
  variants: {
    variant: {
      default: 'max-w-wide',
      compact: 'max-w-prose',
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
  copy: React.ReactNode
  title: React.ReactNode
}

function Intro({
  align = 'center',
  variant = 'default',
  className,
  copy,
  title,
  ...props
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        variant === 'compact' && 'max-w-prose',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
      {...props}
    >
      <h2 className="type-heading-02 text-current">{title}</h2>
      <p className="type-body mt-4 text-current/70">{copy}</p>
    </div>
  )
}

export const Section = { Root, Container, Intro }
