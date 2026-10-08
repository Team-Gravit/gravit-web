import type { ComponentProps, ReactNode } from 'react';
import { useRef, useState } from 'react';
import * as RadixSelect from '@radix-ui/react-select';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';
import { FLOATING_LABEL_CLASS, textFieldVariants } from '@/shared/ui/text-field';

// 터치 기기에서 닫자마자 다시 열리는 버그 방지(shared/ui/select와 동일).
const REOPEN_GUARD_MS = 300;

export interface FloatingSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FloatingSelectProps {
  /** 값이 선택되면 상단에 뜨는 필드명. */
  label: string;
  options: FloatingSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * floating label을 가진 단일 선택 드롭다운. Radix Select(headless)로 포커스·키보드·포탈을
 * 처리하고, 트리거 외형은 `textFieldVariants`의 `field` size를 공유한다. 옵션 수치는 Figma 기준.
 */
export function FloatingSelect({
  label,
  options,
  value,
  onValueChange,
  placeholder,
  className,
}: FloatingSelectProps) {
  const [open, setOpen] = useState(false);
  const lastClosedAtRef = useRef(0);

  const handleOpenChange = (next: boolean) => {
    if (next && Date.now() - lastClosedAtRef.current < REOPEN_GUARD_MS) {
      return;
    }
    if (!next) {
      lastClosedAtRef.current = Date.now();
    }
    setOpen(next);
  };

  const selected = options.find((option) => option.value === value);

  return (
    <RadixSelect.Root
      open={open}
      onOpenChange={handleOpenChange}
      value={value}
      onValueChange={onValueChange}
    >
      <RadixSelect.Trigger
        className={cn(
          textFieldVariants({ size: 'field' }),
          'group flex items-center justify-between gap-2 outline-none focus-visible:border-main-1',
          className,
        )}
      >
        {selected ? (
          <span className="flex min-w-px flex-1 flex-col items-start text-left">
            <span className={FLOATING_LABEL_CLASS}>{label}</span>
            <span className="truncate text-label1 md:text-headline2">{selected.label}</span>
          </span>
        ) : (
          <span className="flex-1 truncate text-left text-label1 text-text-4 md:text-headline2">
            {placeholder}
          </span>
        )}
        <RadixSelect.Icon asChild>
          <Icon
            name="chevron-down"
            className="size-4 shrink-0 text-text-3 transition-transform group-data-[state=open]:rotate-180 md:size-8"
          />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={8}
          className={cn(
            'z-50 max-h-[216px] w-(--radix-select-trigger-width) overflow-y-auto md:max-h-[296px]',
            'rounded-8 bg-white shadow-elevation-2 md:rounded-12',
          )}
        >
          <RadixSelect.Viewport>
            {options.map((option) => (
              <FloatingSelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </FloatingSelectItem>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

function FloatingSelectItem({
  children,
  ...props
}: ComponentProps<typeof RadixSelect.Item> & { children: ReactNode }) {
  return (
    <RadixSelect.Item
      className={cn(
        'flex h-[54px] cursor-pointer items-center px-5 outline-none md:h-[74px] md:px-6',
        'text-body2-normal text-text-1 md:text-body1-normal',
        'data-[highlighted]:bg-bg-3 data-[disabled]:cursor-not-allowed data-[disabled]:text-text-4',
      )}
      {...props}
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
}
