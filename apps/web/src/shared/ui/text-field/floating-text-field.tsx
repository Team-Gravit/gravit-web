import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

import { textFieldVariants, type TextFieldTone } from './text-field';

/** floating 필드 안쪽 입력 요소의 공통 타이포. input·textarea가 함께 쓴다. */
export const FLOATING_INPUT_CLASS =
  'w-full bg-transparent text-text-1  outline-none placeholder:text-label1 placeholder:text-text-4 md:placeholder:text-headline2';

/** floating 필드의 상단 라벨 스타일. 값이 있을 때만 노출한다. */
export const FLOATING_LABEL_CLASS = 'mb-0.5 text-caption1 text-text-4 md:mb-1';

interface FloatingTextFieldProps extends Omit<ComponentProps<'input'>, 'value' | 'size'> {
  /** 값이 있을 때 상단에 뜨는 필드명. */
  label: string;
  value: string;
  tone?: TextFieldTone;
}

/** 한 줄 입력 + floating label. 외형은 `textFieldVariants`의 `field` size를 공유한다. */
export function FloatingTextField({
  label,
  value,
  tone,
  className,
  ...props
}: FloatingTextFieldProps) {
  const hasValue = value.trim().length > 0;

  return (
    <div
      data-slot="floating-text-field"
      className={cn(
        textFieldVariants({ size: 'field', tone }),
        'flex flex-col justify-center focus-within:border-main-1',
        className,
      )}
    >
      {hasValue && <span className={FLOATING_LABEL_CLASS}>{label}</span>}
      <input
        value={value}
        className={cn('text-body1-normal font-semibold md:text-headline2', FLOATING_INPUT_CLASS)}
        {...props}
      />
    </div>
  );
}
