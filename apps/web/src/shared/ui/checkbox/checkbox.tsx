import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

export type CheckboxProps = Omit<ComponentProps<'input'>, 'type' | 'size'>;

// Figma 아이콘 status/line/square-check(28×28)의 벡터. 해제 상태 shape/line/square 와 상자가 같은 비율이다.
const BOX_PATH =
  'M3.5 7.23356V20.7669C3.5 22.0737 3.5 22.7267 3.75432 23.2259C3.97802 23.6649 4.33472 24.0222 4.77376 24.2459C5.2724 24.5 5.92549 24.5 7.22973 24.5H20.7703C22.0745 24.5 22.7267 24.5 23.2253 24.2459C23.6643 24.0222 24.0222 23.6649 24.2459 23.2259C24.5 22.7272 24.5 22.0751 24.5 20.7708V7.22973C24.5 5.92549 24.5 5.2724 24.2459 4.77376C24.0222 4.33472 23.6643 3.97802 23.2253 3.75432C22.7262 3.5 22.0737 3.5 20.7669 3.5H7.23356C5.92677 3.5 5.27289 3.5 4.77376 3.75432C4.33472 3.97802 3.97802 4.33472 3.75432 4.77376C3.5 5.27289 3.5 5.92677 3.5 7.23356Z';
const CHECK_PATH = 'M18.667 10.5L12.4448 17.5L9.33333 14';

/** 기본 체크박스의 입력 동작을 유지하고, 선택 표시는 하나의 벡터를 상태에 따라 칠해 보여준다. */
export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <span
      data-slot="checkbox"
      className={cn('group relative inline-flex size-7 shrink-0', className)}
    >
      <input
        {...props}
        type="checkbox"
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />
      <svg
        viewBox="0 0 28 28"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="pointer-events-none size-full rounded-4 group-has-focus-visible:ring-3 group-has-focus-visible:ring-purple-200 group-has-disabled:opacity-40"
      >
        <path
          d={BOX_PATH}
          strokeWidth={1.75}
          className="stroke-text-3 group-has-checked:fill-cta group-has-checked:stroke-cta"
        />
        <path
          d={CHECK_PATH}
          strokeWidth={1.5}
          className="stroke-cta-text opacity-0 group-has-checked:opacity-100"
        />
      </svg>
    </span>
  );
}
