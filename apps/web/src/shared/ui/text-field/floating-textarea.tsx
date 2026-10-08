import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

import { FLOATING_INPUT_CLASS, FLOATING_LABEL_CLASS } from './floating-text-field';
import { textFieldVariants, type TextFieldTone } from './text-field';

interface FloatingTextAreaProps extends Omit<ComponentProps<'textarea'>, 'value'> {
  /** 값이 있을 때 상단에 뜨는 필드명. */
  label: string;
  value: string;
  tone?: TextFieldTone;
}

/** 여러 줄 입력 + floating label. 외형은 `textFieldVariants`의 `area` size를 공유한다. */
export function FloatingTextArea({
  label,
  value,
  tone,
  className,
  ...props
}: FloatingTextAreaProps) {
  const hasValue = value.trim().length > 0;

  return (
    <div
      data-slot="floating-textarea"
      className={cn(
        textFieldVariants({ size: 'area', tone }),
        'flex flex-col focus-within:border-main-1',
        className,
      )}
    >
      {hasValue && <span className={FLOATING_LABEL_CLASS}>{label}</span>}
      <textarea
        value={value}
        className={cn('h-full flex-1 resize-none text-body1-normal', FLOATING_INPUT_CLASS)}
        {...props}
      />
    </div>
  );
}
