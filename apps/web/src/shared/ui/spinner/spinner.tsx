import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

const SIZE_CLASS = {
  sm: 'size-5',
  md: 'size-8',
  lg: 'size-12',
} as const;

const BORDER_CLASS = {
  sm: 'border-2',
  md: 'border-4',
  lg: 'border-[6px]',
} as const;

export interface SpinnerProps extends Omit<
  ComponentProps<'span'>,
  'children' | 'role' | 'aria-label'
> {
  /** 회전 링의 크기. */
  size?: keyof typeof SIZE_CLASS;
  /**
   * 스크린 리더가 안내할 로딩 상태 이름.
   *
   * 버튼처럼 이미 `aria-busy` 등으로 로딩을 알리는 요소 안에서는 `null` 을 넘겨
   * 안내가 두 번 읽히지 않게 합니다.
   */
  label?: string | null;
}

/**
 * 완료 시점을 알 수 없는 짧은 대기에 사용하는 로딩 표시입니다.
 *
 * 화면 구조를 미리 그릴 수 있는 페이지 로딩에는 Spinner 보다 Skeleton 을 우선합니다.
 *
 * 링 색은 `currentColor` 를 따르므로 부모의 글자색을 그대로 상속합니다.
 * 버튼 안에서는 별도 지정 없이 버튼 글자색과 같은 색으로 그려집니다.
 *
 * 크기와 여백 등 바깥 스타일은 `className` 으로 조정합니다.
 * 테두리 두께는 `size` 를 따르므로, `className` 으로 크기만 크게 바꾸면 두께는 그대로 남습니다.
 */
export function Spinner({ size = 'md', label = '불러오는 중', className, ...props }: SpinnerProps) {
  return (
    <span
      role={label === null ? undefined : 'status'}
      data-slot="spinner"
      className={cn('inline-flex shrink-0', SIZE_CLASS[size], className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-full animate-spin rounded-full border-current/25 border-t-current',
          // 회전 자체가 로딩이라는 정보이므로 멈추지 않고 느리게 돌린다.
          'motion-reduce:[animation-duration:2s]',
          BORDER_CLASS[size]
        )}
      />
      {label !== null && <span className="sr-only">{label}</span>}
    </span>
  );
}
