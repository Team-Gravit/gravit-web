import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface SkeletonReserveProps {
  /** true 면 자리(높이)만 유지하고 보이지 않게 한다. delay 구간에서 사용한다. */
  isHidden?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * 스켈레톤 묶음을 감싸는 자리지기. 내용은 시각적 placeholder 라 항상 `aria-hidden` 으로
 * 보조기기에서 숨긴다(로딩 상태 자체는 셸의 `aria-busy` 가 알린다).
 * `isHidden` 이면 `visibility` 만 숨겨 높이를 유지하므로 delay→로딩→데이터 전환에 시프트가 없다.
 */
export function SkeletonReserve({ isHidden = false, className, children }: SkeletonReserveProps) {
  return (
    <div aria-hidden className={cn(className, isHidden && 'invisible')}>
      {children}
    </div>
  );
}
