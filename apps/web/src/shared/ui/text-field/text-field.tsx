import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

/**
 * 입력 필드의 공통 외형(테두리·배경·radius·크기·상태 색). **외형 정의의 single source**로,
 * `TextField`뿐 아니라 `FloatingTextField`·`FloatingTextArea`·문의 dropdown이 함께 참조한다.
 * 여기서 크기·radius를 바꾸면 모든 필드에 반영된다.
 *
 * - `default` : 기본 한 줄 입력 (rounded-8 / px-4 / py-15)
 * - `field`   : floating 라인 필드 (모바일 h-54/px-16/rounded-8 → 데스크톱 h-72/px-24/rounded-12)
 * - `area`    : floating 여러 줄 필드 (모바일 min-h-130/p-16 → 데스크톱 h-400/p-24)
 */
export const textFieldVariants = cva('w-full border bg-white', {
  variants: {
    size: {
      default: 'rounded-8 px-4 py-[15px]',
      field: 'h-[54px] rounded-8 px-4 md:h-[72px] md:rounded-12 md:px-6',
      area: 'min-h-[130px] rounded-8 p-4 md:h-[400px] md:rounded-12 md:p-6',
    },
    tone: {
      default: 'border-divider-1 text-text-1',
      success: 'border-semantic-success text-semantic-success',
      error: 'border-semantic-error text-semantic-error',
    },
  },
  defaultVariants: { size: 'default', tone: 'default' },
});

export type TextFieldTone = NonNullable<VariantProps<typeof textFieldVariants>['tone']>;

export interface TextFieldProps
  extends Omit<ComponentProps<'input'>, 'children' | 'type' | 'size'> {
  tone?: TextFieldTone;
}

/** 한 줄 입력(기본형). floating label이 필요하면 `FloatingTextField`를 쓴다. */
export function TextField({ tone, className, ref, ...props }: TextFieldProps) {
  return (
    <input
      ref={ref}
      type="text"
      data-slot="text-field"
      data-tone={tone ?? 'default'}
      aria-invalid={tone === 'error' || undefined}
      className={cn(
        textFieldVariants({ size: 'default', tone }),
        'text-body1-normal outline-none placeholder:text-text-4 md:text-body2-reading',
        'focus-visible:border-main-1 disabled:cursor-not-allowed read-only:cursor-default',
        className,
      )}
      {...props}
    />
  );
}
