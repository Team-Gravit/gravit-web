import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import backgroundImage from './assets/background.webp';

export interface SpaceBackgroundProps {
  children: ReactNode;
  className?: string;
}

/**
 * 우주 일러스트를 화면 전체에 까는 배경면. 로그인·온보딩·리그가 함께 쓴다.
 *
 * 안쪽 배치는 정하지 않는다 — 가운데 모달을 놓는 화면과 콘텐츠를 위에서부터 쌓는 화면이
 * 함께 쓰므로, 정렬은 `className`으로 화면이 정한다.
 */
export function SpaceBackground({ children, className }: SpaceBackgroundProps) {
  return (
    <div
      data-slot="space-background"
      className={cn('min-h-svh w-full bg-cover bg-center bg-no-repeat', className)}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {children}
    </div>
  );
}
