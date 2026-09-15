import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

// Figma `chip` · `chip/nav`: filled/outlined는 brand/main/2(=cta), muted는 divider/2를 쓴다.
const chipVariants = cva(
  'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border',
  {
    variants: {
      variant: {
        filled: 'border-transparent bg-cta text-cta-text',
        outlined: 'border-cta bg-white text-cta',
        muted: 'border-divider-2 bg-white text-text-4',
      },
    },
    defaultVariants: {
      variant: 'filled',
    },
  },
);

type ChipSize = 'sm' | 'md' | 'lg';
type ChipSizeProp = ChipSize | { base: ChipSize; md: ChipSize };

const CHIP_SIZE_CLASS: Record<ChipSize, string> = {
  sm: 'h-6 px-2 text-caption1',
  md: 'h-7 px-3 text-label2',
  lg: 'h-8 px-4 text-body1-normal',
};

// Tailwind가 정적 분석할 수 있도록 반응형 크기 클래스를 완성된 문자열로 둔다.
const CHIP_SIZE_CLASS_MD: Record<ChipSize, string> = {
  sm: 'md:h-6 md:px-2 md:text-caption1',
  md: 'md:h-7 md:px-3 md:text-label2',
  lg: 'md:h-8 md:px-4 md:text-body1-normal',
};

const DEFAULT_CHIP_SIZE = { base: 'sm', md: 'lg' } as const;

function resolveChipSize(size: ChipSizeProp): string {
  if (typeof size === 'string') {
    return CHIP_SIZE_CLASS[size];
  }

  return cn(CHIP_SIZE_CLASS[size.base], CHIP_SIZE_CLASS_MD[size.md]);
}

export interface ChipProps extends ComponentProps<'span'>, VariantProps<typeof chipVariants> {
  /** 고정 크기 또는 모바일·데스크톱 크기 조합. 기본은 모바일 `sm`, 데스크톱 `lg`. */
  size?: ChipSizeProp;
}

/** 상태 표시용 작은 라벨. 클릭 동작이 필요하면 `Button`을 사용한다. */
export function Chip({ variant, size = DEFAULT_CHIP_SIZE, className, ...props }: ChipProps) {
  const dataSize = typeof size === 'string' ? size : `${size.base}-${size.md}`;

  return (
    <span
      data-slot="chip"
      data-variant={variant ?? 'filled'}
      data-size={dataSize}
      className={cn(chipVariants({ variant }), resolveChipSize(size), className)}
      {...props}
    />
  );
}
