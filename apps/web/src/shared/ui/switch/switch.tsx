import type { ComponentProps, MouseEvent } from 'react';

import { cn } from '@/shared/lib/cn';

export interface SwitchProps
  extends Omit<
    ComponentProps<'button'>,
    'onChange' | 'type' | 'role' | 'aria-checked' | 'children'
  > {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * 제어형 토글 스위치. `checked`/`onCheckedChange`로만 상태를 다룬다.
 * 치수는 반응형 고정이다 — 모바일 32×20(s), 데스크톱(md:) 42×24. 별도 size prop은 없다.
 * 접근 가능한 이름은 호출부에서 `aria-label` 또는 `aria-labelledby`로 제공한다.
 */
export function Switch({
  checked,
  onCheckedChange,
  disabled,
  className,
  onClick,
  ...props
}: SwitchProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }
    onCheckedChange?.(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-slot="switch"
      data-state={checked ? 'checked' : 'unchecked'}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        // 레이아웃·형태 (모바일 → md:)
        'inline-flex shrink-0 items-center rounded-full p-0.5 md:p-1',
        'h-5 w-[35px] md:h-6 md:w-[42px]',
        // 상호작용
        'cursor-pointer transition-colors',
        'outline-none focus-visible:ring-3 focus-visible:ring-purple-200',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // 상태 색
        checked ? 'bg-main' : 'bg-divider-1',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="switch-thumb"
        className={cn(
          'size-4 shrink-0 rounded-full bg-bg-0 transition-transform',
          checked ? 'translate-x-[15px] md:translate-x-[18px]' : 'translate-x-0',
        )}
      />
    </button>
  );
}
