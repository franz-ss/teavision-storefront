import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const cardVariants = cva('border text-ink', {
  variants: {
    tone: {
      surface: 'border-hairline-2 bg-card',
      sunken: 'border-hairline-2 bg-paper-2',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-5 sm:p-6',
    },
    radius: {
      md: 'rounded-md',
      lg: 'rounded-lg',
    },
    overflow: {
      visible: '',
      hidden: 'overflow-hidden',
    },
    interactive: {
      true: 'transition-colors hover:border-brand focus-within:border-brand focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      false: '',
    },
  },
  defaultVariants: {
    tone: 'surface',
    padding: 'none',
    radius: 'lg',
    overflow: 'visible',
    interactive: false,
  },
})

type CardVariantProps = VariantProps<typeof cardVariants>

type CardOwnProps = CardVariantProps & {
  className?: string
}

type CardAsDivProps = CardOwnProps &
  Omit<React.ComponentPropsWithoutRef<'div'>, keyof CardOwnProps | 'as'> & {
    as?: 'div'
  }

type CardAsArticleProps = CardOwnProps &
  Omit<React.ComponentPropsWithoutRef<'article'>, keyof CardOwnProps | 'as'> & {
    as: 'article'
  }

type CardAsAsideProps = CardOwnProps &
  Omit<React.ComponentPropsWithoutRef<'aside'>, keyof CardOwnProps | 'as'> & {
    as: 'aside'
  }

type CardAsLiProps = CardOwnProps &
  Omit<React.ComponentPropsWithoutRef<'li'>, keyof CardOwnProps | 'as'> & {
    as: 'li'
  }

type CardAsAnchorProps = CardOwnProps &
  Omit<React.ComponentPropsWithoutRef<'a'>, keyof CardOwnProps | 'as'> & {
    as: 'a'
  }

export type CardProps =
  | CardAsDivProps
  | CardAsArticleProps
  | CardAsAsideProps
  | CardAsLiProps
  | CardAsAnchorProps

function getCardClassName({
  className,
  interactive,
  overflow,
  padding,
  radius,
  tone,
}: CardOwnProps) {
  return cn(
    cardVariants({ interactive, overflow, padding, radius, tone }),
    className,
  )
}

export function Card(props: CardProps) {
  if (props.as === 'a') {
    const {
      as,
      className,
      interactive,
      overflow,
      padding,
      radius,
      tone,
      ...anchorProps
    } = props
    void as

    return (
      <a
        className={getCardClassName({
          className,
          interactive,
          overflow,
          padding,
          radius,
          tone,
        })}
        {...anchorProps}
      />
    )
  }

  if (props.as === 'article') {
    const {
      as,
      className,
      interactive,
      overflow,
      padding,
      radius,
      tone,
      ...articleProps
    } = props
    void as

    return (
      <article
        className={getCardClassName({
          className,
          interactive,
          overflow,
          padding,
          radius,
          tone,
        })}
        {...articleProps}
      />
    )
  }

  if (props.as === 'aside') {
    const {
      as,
      className,
      interactive,
      overflow,
      padding,
      radius,
      tone,
      ...asideProps
    } = props
    void as

    return (
      <aside
        className={getCardClassName({
          className,
          interactive,
          overflow,
          padding,
          radius,
          tone,
        })}
        {...asideProps}
      />
    )
  }

  if (props.as === 'li') {
    const {
      as,
      className,
      interactive,
      overflow,
      padding,
      radius,
      tone,
      ...liProps
    } = props
    void as

    return (
      <li
        className={getCardClassName({
          className,
          interactive,
          overflow,
          padding,
          radius,
          tone,
        })}
        {...liProps}
      />
    )
  }

  const {
    as,
    className,
    interactive,
    overflow,
    padding,
    radius,
    tone,
    ...divProps
  } = props
  void as

  return (
    <div
      className={getCardClassName({
        className,
        interactive,
        overflow,
        padding,
        radius,
        tone,
      })}
      {...divProps}
    />
  )
}
