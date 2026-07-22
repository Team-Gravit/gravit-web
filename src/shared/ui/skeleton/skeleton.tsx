import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/lib/cn';

const skeletonVariants = cva(['inline-block w-20 bg-gray-300', "before:content-['']"], {
  variants: {
    variant: {
      text: 'h-[1em] align-middle rounded-full',
      rectangular: 'h-4 rounded-none',
      rounded: 'h-4 rounded-[12px]',
      circular: 'h-4 rounded-full',
    },
    animation: {
      pulse: 'animate-skeleton-pulse',
      wave: 'relative overflow-hidden before:absolute before:top-0 before:left-[-150%] before:h-full before:w-[150%] before:animate-skeleton-wave before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,255,255,0.6)] before:to-transparent',
      none: '',
    },
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

type SkeletonBaseProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  animation?: SkeletonAnimation;
  width?: number | string;
  height?: number | string;
};

/**
 * textSize는 variant가 'text'일 때만 의미가 있습니다(h-[1em] 높이를 타이포 토큰으로 맞춤).
 * 그래서 나머지 variant에서는 타입 수준에서 textSize 전달을 막습니다.
 */
type SkeletonProps = SkeletonBaseProps &
  (
    | { variant?: 'text'; textSize?: SkeletonTextSize }
    | { variant: 'rectangular' | 'rounded' | 'circular'; textSize?: never }
  );

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
  const textSizeClass = variant === 'text' ? (textSize ?? 'body1Normal') : undefined;

  return (
    <div
      data-slot="skeleton"
      data-variant={variant}
      data-animation={animation}
      className={cn(skeletonVariants({ variant, animation, textSize: textSizeClass, className }))}
      style={{
        ...(width === undefined ? {} : { width: toCssSize(width) }),
        ...(height === undefined ? {} : { height: toCssSize(height) }),
        ...style,
      }}
      {...props}
    />
  );
}

export type { SkeletonProps };
