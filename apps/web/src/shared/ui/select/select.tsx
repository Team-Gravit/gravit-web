import type { ComponentProps, ReactNode } from 'react';
import { useRef, useState } from 'react';
import * as RadixSelect from '@radix-ui/react-select';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';

// 터치 기기에서 열린 트리거를 탭하면 dismiss(닫힘) 직후 click 이 다시 열어버린다.
// 닫힌 지 이 시간 안에 들어오는 재-open 은 그 버그로 보고 무시한다(사람은 이보다 빨리 못 연다).
const REOPEN_GUARD_MS = 300;

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * 단일 선택 Select. Radix Select(headless) 위에 프로젝트 토큰으로 스타일을 입힌 것으로,
 * 포커스·키보드·포탈·바깥 클릭은 Radix가 처리한다. 드롭 목록은 elevation-2(셀렉트 역할)를 쓴다.
 */
export function Select({
  options,
  value,
  onValueChange,
  placeholder = '선택하세요',
  disabled,
  className,
  'aria-label': ariaLabel,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const lastClosedAtRef = useRef(0);

  const handleOpenChange = (next: boolean) => {
    if (next && Date.now() - lastClosedAtRef.current < REOPEN_GUARD_MS) {
      return; // 닫자마자 튀어 오르는 재-open 무시
    }
    if (!next) {
      lastClosedAtRef.current = Date.now();
    }
    setOpen(next);
  };

  return (
    <RadixSelect.Root
      open={open}
      onOpenChange={handleOpenChange}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <RadixSelect.Trigger
        aria-label={ariaLabel}
        className={cn(
          'group flex w-[100px] md:w-[150px] items-center justify-between gap-2 rounded-4 border border-bg-3 px-3 py-2',
          'text-caption1 md:text-body1-normal text-text-1 outline-none',
          'focus-visible:ring-3 focus-visible:ring-purple-200',
          'disabled:cursor-default disabled:text-text-4 data-[placeholder]:text-text-4',
          className,
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          {/* 모바일은 legacy 기준 16px, 데스크톱은 Figma 기준 24px. CSS 크기가 svg 속성을 덮는다. */}
          <Icon
            name="chevron-down"
            size={24}
            className="size-4 text-text-3 transition-transform group-data-[state=open]:rotate-180 md:size-6"
          />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={8}
          className={cn(
            'z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden',
            'rounded-12 bg-white px-1.5 py-2 shadow-elevation-2',
          )}
        >
          <RadixSelect.Viewport>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

function SelectItem({
  children,
  ...props
}: ComponentProps<typeof RadixSelect.Item> & { children: ReactNode }) {
  return (
    <RadixSelect.Item
      className={cn(
        'flex cursor-pointer items-center justify-center p-2 md:p-4 outline-none',
        'border-b border-divider-1 last:border-0',
        'text-label1 md:text-body1-normal text-text-1',
        'data-[highlighted]:bg-bg-2 data-[disabled]:cursor-not-allowed data-[disabled]:text-text-4',
      )}
      {...props}
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
}
