import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import backgroundImage from './assets/background.webp';
import starfieldImage from './assets/starfield.webp';

/**
 * `default`는 화면 전체를 채우는 불투명 일러스트, `starfield`는 바탕색 위에 얹는 별·행성
 * 레이어다. 후자는 배경색을 스스로 정하지 않으므로 사용하는 쪽이 `className`으로 지정한다.
 */
export type SpaceBackgroundVariant = 'default' | 'starfield';

const BACKGROUND_IMAGE: Record<SpaceBackgroundVariant, string> = {
  default: backgroundImage,
  starfield: starfieldImage,
};

export interface SpaceBackgroundProps {
  children: ReactNode;
  variant?: SpaceBackgroundVariant;
  className?: string;
}

/**
 * 우주 일러스트를 화면 전체에 까는 배경면. 로그인·온보딩·리그·학습이 함께 쓴다.
 *
 * 안쪽 배치는 정하지 않는다 — 가운데 모달을 놓는 화면과 콘텐츠를 위에서부터 쌓는 화면이
 * 함께 쓰므로, 정렬은 `className`으로 화면이 정한다.
 */
export function SpaceBackground({
  children,
  variant = 'default',
  className,
}: SpaceBackgroundProps) {
  return (
    <div
      data-slot="space-background"
      data-variant={variant}
      className={cn('min-h-svh w-full bg-cover bg-center bg-no-repeat', className)}
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE[variant]})` }}
    >
      {children}
    </div>
  );
}
