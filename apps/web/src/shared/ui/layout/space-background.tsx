import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import backgroundImage from './assets/background.webp';
import starfieldImage from './assets/starfield.webp';

export type SpaceBackgroundVariant = 'default' | 'starfield';

const BACKGROUND_IMAGE: Record<SpaceBackgroundVariant, string> = {
  default: backgroundImage,
  starfield: starfieldImage,
};

const VARIANT_CLASS: Record<SpaceBackgroundVariant, string> = {
  default: 'bg-cover bg-center',
  // 시안의 상단 구도를 유지하면서 긴 콘텐츠에서도 이미지 경계가 드러나지 않게 채운다.
  starfield: 'bg-cover bg-top',
};

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
  return (
    <div
      data-slot="space-background"
      data-variant={variant}
      className={cn('min-h-svh w-full bg-no-repeat', VARIANT_CLASS[variant], className)}
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE[variant]})` }}
    >
      {children}
    </div>
  );
}
