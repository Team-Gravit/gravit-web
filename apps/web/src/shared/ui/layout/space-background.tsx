import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { GradientCanvas } from '@/shared/ui/gradient-canvas';

import decorationAvif from './assets/space-decoration.webp?w=1920;2560&format=avif&quality=75&as=srcset';
import decorationWebp from './assets/space-decoration.webp?w=1920;2560&format=webp&as=srcset';
import decorationFallback from './assets/space-decoration.webp?w=1920&format=webp';
import starfieldAvif from './assets/starfield.webp?quality=75&format=avif';
import starfieldWebp from './assets/starfield.webp';

const SPACE_GRADIENT =
  'linear-gradient(292.58deg, var(--color-space-start) 3.59%, var(--color-space-end) 95.08%)';

// cover라 세로로 긴 화면에서는 높이에 맞춰 커진다. 158vh = 100vh × 원본 비율(4821/3060).
const SPACE_DECORATION = {
  avifSrcSet: decorationAvif,
  webpSrcSet: decorationWebp,
  src: decorationFallback,
  sizes: 'max(100vw, 158vh)',
};

export type SpaceBackgroundVariant = 'default' | 'starfield';

export interface SpaceBackgroundProps {
  children: ReactNode;
  variant?: SpaceBackgroundVariant;
  className?: string;
}

/**
 * 우주 배경을 깔고 내부 정렬은 호출부가 정한다.
 * 기본 변형은 그라데이션 바탕까지 칠하고, `starfield`는 바탕색을 호출부가 정한다.
 */
export function SpaceBackground({
  children,
  variant = 'default',
  className,
}: SpaceBackgroundProps) {
  if (variant === 'starfield') {
    return (
      <div
        data-slot="space-background"
        data-variant={variant}
        // isolate: 이미지를 콘텐츠 뒤(-z)에 두되 호출부가 준 바탕색보다는 위에 그린다.
        className={cn('relative isolate min-h-svh w-full', className)}
      >
        {/* contents: 호출부가 flex 정렬을 줘도 이미지 묶음이 자식 칸을 차지하지 않는다. */}
        <picture className="contents">
          <source type="image/avif" srcSet={starfieldAvif} />
          {/*
            콘텐츠가 길면 높이에 맞춰 커지므로 해상도는 원본(3840px) 그대로 두고 형식만 바꾼다.
            시안의 상단 구도를 유지하면서 긴 콘텐츠에서도 이미지 경계가 드러나지 않게 채운다.
          */}
          <img
            src={starfieldWebp}
            alt=""
            decoding="async"
            className="pointer-events-none absolute inset-0 -z-10 size-full object-cover object-top"
          />
        </picture>
        {children}
      </div>
    );
  }

  return (
    <GradientCanvas
      data-slot="space-background"
      data-variant={variant}
      gradient={SPACE_GRADIENT}
      decoration={SPACE_DECORATION}
      // 로그인 · 온보딩 넓은 화면에서 첫 화면의 가장 큰 그림이다.
      decorationPriority="high"
      className={cn('min-h-svh w-full', className)}
    >
      {children}
    </GradientCanvas>
  );
}
