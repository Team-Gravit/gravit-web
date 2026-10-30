import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import backgroundImage from './assets/background.webp';
import starfieldAvif from './assets/starfield.webp?quality=75&format=avif';
import starfieldWebp from './assets/starfield.webp';

export type SpaceBackgroundVariant = 'default' | 'starfield';

export interface SpaceBackgroundProps {
  children: ReactNode;
  variant?: SpaceBackgroundVariant;
  className?: string;
}

/**
 * 배경 이미지만 제공하며 내부 정렬과 바탕색은 호출부가 정한다.
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
    <div
      data-slot="space-background"
      data-variant={variant}
      className={cn('min-h-svh w-full bg-cover bg-center bg-no-repeat', className)}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {children}
    </div>
  );
}
