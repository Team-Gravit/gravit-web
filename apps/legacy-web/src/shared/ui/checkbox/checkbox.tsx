import { type InputHTMLAttributes } from 'react';

import CheckIcon from '@/shared/assets/_icons/button/check-icon.svg?react';
import { cn } from '@/shared/lib/cn';

type CheckBoxProps = InputHTMLAttributes<HTMLInputElement> & {
  checked: boolean;
  onCheckedChange?: () => void;
  value: string;
  className?: string;
};

function CheckBox({ checked, onCheckedChange, className, value, ...rest }: CheckBoxProps) {
  return (
    <>
      <span
        role="checkbox"
        data-checked={checked}
        aria-checked={checked}
        tabIndex={0}
        onClick={onCheckedChange}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onCheckedChange?.();
          }
        }}
        className={cn(
          'size-5 border-[1.5px] rounded-sm transition-colors inline-flex items-center justify-center',
          'data-[checked=false]:border-text-3',
          'data-[checked=true]:border-cta data-[checked=true]:bg-cta',
          className,
        )}
      >
        {checked && <CheckIcon className="size-4" />}
      </span>

      <input
        type="checkbox"
        checked={checked}
        value={value}
        aria-hidden
        className="hidden"
        readOnly
        {...rest}
      />
    </>
  );
}

export default CheckBox;
