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
        neutral: 'border-transparent bg-bg-1 text-text-1',
        soft: 'border-transparent bg-purple-50 text-cta-hover',
      },
    },
    defaultVariants: {
      variant: 'filled',
    },
  },
);

type ChipSize = 'sm' | 'md' | 'lg';
type ChipTypography = 'default' | 'reading';
type ResponsiveProp<T> = T | { base: T; md: T };
type ChipSizeProp = ResponsiveProp<ChipSize>;

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

const chipTypographyVariants = cva('', {
  variants: {
    typography: { default: '', reading: 'text-body2-reading' },
  },
});

const chipTypographyVariantsMd = cva('', {
  variants: {
    typography: { default: '', reading: 'md:text-body2-reading' },
  },
});

const DEFAULT_CHIP_SIZE = { base: 'sm', md: 'lg' } as const;

function resolveChipClasses(
  size: ChipSizeProp,
  typography: ResponsiveProp<ChipTypography>,
): string {
  const baseTypography = typeof typography === 'string' ? typography : typography.base;
  const mdTypography = typeof typography === 'string' ? typography : typography.md;

  if (typeof size === 'string') {
    return cn(
      CHIP_SIZE_CLASS[size],
      chipTypographyVariants({ typography: baseTypography }),
      typeof typography !== 'string' && CHIP_SIZE_CLASS_MD[size],
      chipTypographyVariantsMd({ typography: mdTypography }),
    );
  }

  return cn(
    CHIP_SIZE_CLASS[size.base],
    chipTypographyVariants({ typography: baseTypography }),
    CHIP_SIZE_CLASS_MD[size.md],
    chipTypographyVariantsMd({ typography: mdTypography }),
  );
}

export interface ChipProps extends ComponentProps<'span'>, VariantProps<typeof chipVariants> {
  /** 고정 크기 또는 모바일·데스크톱 크기 조합. 기본은 모바일 `sm`, 데스크톱 `lg`. */
  size?: ChipSizeProp;
  /** 기본은 크기별 글자 스타일. reading은 15px 본문 스타일이며 반응형 지정도 가능하다. */
  typography?: ResponsiveProp<ChipTypography>;
}

/** 상태 표시용 작은 라벨. 클릭 동작이 필요하면 `Button`을 사용한다. */
export function Chip({
  variant,
  size = DEFAULT_CHIP_SIZE,
  typography = 'default',
  className,
  ...props
}: ChipProps) {
  const dataSize = typeof size === 'string' ? size : `${size.base}-${size.md}`;

  return (
    <span
      data-slot="chip"
      data-variant={variant ?? 'filled'}
      data-size={dataSize}
      className={cn(chipVariants({ variant }), resolveChipClasses(size, typography), className)}
      {...props}
    />
  );
}
