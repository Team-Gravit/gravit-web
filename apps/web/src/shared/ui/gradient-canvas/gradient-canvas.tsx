import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

export interface GradientCanvasDecoration {
  avifSrcSet: string;
  webpSrcSet: string;
  /** srcset을 모르는 브라우저가 받는 한 장 */
  src: string;
  sizes: string;
}

/** 장식을 상자에 맞추는 방식. `cover`: 비율을 지키며 상자를 꽉 채우고 넘친 쪽을 자른다 */
export type GradientCanvasFit = 'cover';

export interface GradientCanvasProps extends ComponentProps<'div'> {
  /** CSS 그라데이션. 색은 `--color-space-*` 토큰을 쓴다 */
  gradient: string;
  /** 투명 장식 이미지. 그라데이션 위에 깔린다 */
  decoration: GradientCanvasDecoration;
  fit?: GradientCanvasFit;
  /** 장식이 LCP 후보일 때 `high` */
  decorationPriority?: 'high' | 'auto';
}

const FIT_CLASS: Record<GradientCanvasFit, string> = {
  cover: 'inset-0 size-full object-cover',
};

/**
 * 그라데이션을 상자 바탕에 바로 칠하고 투명 장식을 그 위에 얹는다.
 * 그라데이션은 이미지가 아니라서 장식이 늦게 와도 빈 화면이 없다.
 */
export function GradientCanvas({
  gradient,
  decoration,
  fit = 'cover',
  decorationPriority = 'auto',
  className,
  style,
  children,
  ...props
}: GradientCanvasProps) {
  return (
    <div
      data-slot="gradient-canvas"
      // isolate: 장식을 콘텐츠 뒤(-z)에 두되 상자 바탕(그라데이션)보다는 위에 그린다.
      className={cn('relative isolate', className)}
      style={{ ...style, backgroundImage: gradient }}
      {...props}
    >
      {/* contents: 호출부가 flex 정렬을 줘도 이미지 묶음이 자식 칸을 차지하지 않는다. */}
      <picture className="contents">
        <source type="image/avif" srcSet={decoration.avifSrcSet} sizes={decoration.sizes} />
        <source type="image/webp" srcSet={decoration.webpSrcSet} sizes={decoration.sizes} />
        <img
          src={decoration.src}
          alt=""
          decoding="async"
          fetchPriority={decorationPriority}
          className={cn('pointer-events-none absolute -z-10', FIT_CLASS[fit])}
        />
      </picture>
      {children}
    </div>
  );
}
