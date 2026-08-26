import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/lib/cn';

const LINE_BOX_CHAR = '\u200B'; // Zero Width Space

const skeletonVariants = cva('inline-block bg-gray-300', {
  variants: {
    /** 스켈레톤 모양 */
    variant: {
      text: 'rounded-full align-middle',
      block: '',
      circular: 'rounded-full',
    },
    /** 애니메이션 */
    animation: {
      pulse: 'animate-skeleton-pulse motion-reduce:animate-none',
      wave: "relative overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:-translate-x-full after:animate-skeleton-wave after:bg-linear-to-r after:from-transparent after:via-white/60 after:to-transparent after:content-[''] motion-reduce:after:animate-none",
      none: '',
    },
    /** 텍스트 블록 스타일 */
    textSize: {
      display1: 'text-display1',
      display2: 'text-display2',
      title1: 'text-title1',
      title2: 'text-title2',
      title3: 'text-title3',
      heading1: 'text-heading1',
      heading2: 'text-heading2',
      headline1: 'text-headline1',
      headline2: 'text-headline2',
      body1Normal: 'text-body1-normal',
      body1Reading: 'text-body1-reading',
      body2Normal: 'text-body2-normal',
      body2Reading: 'text-body2-reading',
      label1: 'text-label1',
      label2: 'text-label2',
      caption1: 'text-caption1',
      caption2: 'text-caption2',
    },
  },
  defaultVariants: {
    variant: 'text',
    animation: 'wave',
  },
});

type SkeletonTextSize = NonNullable<VariantProps<typeof skeletonVariants>['textSize']>;
type SkeletonAnimation = NonNullable<VariantProps<typeof skeletonVariants>['animation']>;

type SkeletonBaseProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  animation?: SkeletonAnimation;
  width?: number | string;
  height?: number | string;
};

type TextSkeletonProps = {
  variant?: 'text';
  textSize?: SkeletonTextSize;
};

type ShapeSkeletonProps = {
  variant: 'block' | 'circular';
  textSize?: never; // textSize prop 금지
};

type SkeletonProps = SkeletonBaseProps & (TextSkeletonProps | ShapeSkeletonProps);

function toCssSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value;
}

export function Skeleton({
  variant = 'text',
  animation = 'wave',
  textSize,
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  const sizeStyle = {
    ...(width === undefined ? {} : { width: toCssSize(width) }),
    ...(height === undefined ? {} : { height: toCssSize(height) }),
    ...style,
  };

  if (variant === 'text') {
    return (
      <span
        {...props}
        aria-hidden
        data-slot="skeleton"
        data-variant={variant}
        data-animation={animation}
        className={cn(
          skeletonVariants({
            variant,
            animation,
            textSize: textSize ?? 'body1Normal',
          }),
          className,
        )}
        style={sizeStyle}
      >
        {LINE_BOX_CHAR}
      </span>
    );
  }

  return (
    <div
      {...props}
      aria-hidden
      data-slot="skeleton"
      data-variant={variant}
      data-animation={animation}
      className={cn(skeletonVariants({ variant, animation }), className)}
      style={sizeStyle}
    />
  );
}

export type { SkeletonProps };
