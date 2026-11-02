import type { ComponentProps, CSSProperties } from 'react';

import { cn } from '@/shared/lib/cn';

export interface GradientCanvasDecoration {
  /** AVIF 이미지 후보 목록 */
  avifSrcSet?: string;
  /** WebP 이미지 후보 목록 */
  webpSrcSet?: string;
  /** 기본 화면의 img 또는 넓은 화면의 마지막 source에 사용할 이미지 */
  src: string;
  /** srcSet 후보를 고를 때 브라우저가 참고할 예상 표시 폭 */
  sizes?: string;
}

export interface GradientCanvasArt {
  /** 배경에 칠할 CSS 그라데이션 */
  gradient: string;
  /** 그라데이션 위에 표시할 투명 장식 이미지 */
  decoration: GradientCanvasDecoration;
}

export interface GradientCanvasProps extends ComponentProps<'div'>, GradientCanvasArt {
  /** 768px 이상에서 사용할 그라데이션과 장식 */
  wide?: GradientCanvasArt;
  /**
   * 그라데이션과 장식을 담는 내부 그림 상자의 위치 · 크기.
   * 기본 `absolute inset-0`으로 최상위 div와 같은 영역을 차지한다.
   * 시안 비율이 필요하면 `aspect-*`와 폭 · 위치 클래스로 조절한다.
   */
  artworkClassName?: string;
  /** 장식 이미지가 LCP 후보이면 `high`. 기본값은 `auto` */
  decorationPriority?: 'high' | 'auto';
}

// 최상위 div와 내부 그림 상자에 적용한다. 그림 상자가 덮지 않는 부분은 최상위 div가 채운다.
const GRADIENT_BACKGROUND_CLASSES =
  'bg-(image:--canvas-gradient) md:bg-(image:--canvas-gradient-wide)';

/**
 * 최상위 div와 내부 그림 상자에 그라데이션을 칠하고, 그림 상자에 투명 장식을 얹는다.
 * 장식 이미지가 늦게 도착해도 그라데이션은 즉시 보인다.
 */
export function GradientCanvas({
  gradient,
  decoration,
  wide,
  artworkClassName,
  decorationPriority = 'auto',
  className,
  style,
  children,
  ...props
}: GradientCanvasProps) {
  const gradientVariables = {
    '--canvas-gradient': gradient,
    '--canvas-gradient-wide': wide?.gradient ?? gradient,
  } as CSSProperties;

  return (
    <div
      data-slot="gradient-canvas"
      // isolate는 음수 z-index인 그림 상자를 최상위 div의 배경 위, 콘텐츠 아래에 둔다.
      className={cn('relative isolate', GRADIENT_BACKGROUND_CLASSES, className)}
      style={{ ...style, ...gradientVariables }}
      {...props}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 -z-10',
          GRADIENT_BACKGROUND_CLASSES,
          artworkClassName,
        )}
      >
        <picture className="contents">
          {wide && <DecorationSources decoration={wide.decoration} media="(min-width: 768px)" />}
          <DecorationSources decoration={decoration} />
          <img
            src={decoration.src}
            alt=""
            decoding="async"
            fetchPriority={decorationPriority}
            className="size-full object-cover object-top"
          />
        </picture>
      </div>
      {children}
    </div>
  );
}

function DecorationSources({
  decoration,
  media,
}: {
  decoration: GradientCanvasDecoration;
  media?: string;
}) {
  return (
    <>
      {decoration.avifSrcSet && (
        <source
          media={media}
          type="image/avif"
          srcSet={decoration.avifSrcSet}
          sizes={decoration.sizes}
        />
      )}
      {decoration.webpSrcSet && (
        <source
          media={media}
          type="image/webp"
          srcSet={decoration.webpSrcSet}
          sizes={decoration.sizes}
        />
      )}
      {/* 넓은 화면에서 형식별 후보를 고르지 못해도 기본 화면 이미지로 돌아가지 않는다. */}
      {media && <source media={media} srcSet={decoration.src} />}
    </>
  );
}
