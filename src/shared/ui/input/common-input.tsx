import { type InputHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

type CommonInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  className?: string;
  id: string;
  inputClassName?: string;
  labelClassName?: string;
};

function CommonInput(props: CommonInputProps) {
  const { value, label, className, id, inputClassName, labelClassName, ...rest } = props;

  return (
    <div
      className={cn(
        'bg-white h-[54px] md:h-[74px] flex flex-col justify-center rounded-lg px-4 md:px-6 py-2.5 border border-divider-1',
        className,
      )}
    >
      {value !== undefined && value !== '' && (
        <label
          className={cn('text-caption1 text-text-4 mb-0.5 md:mb-1', labelClassName)}
          htmlFor={id}
        >
          {label}
        </label>
      )}

      <input
        id={id}
        value={value ?? ''}
        {...rest}
        className={cn(
          'w-full outline-none text-label1 md:text-headline2',
          'placeholder:text-label1 md:placeholder:text-headline2 placeholder:text-text-4',
          inputClassName,
        )}
      />
    </div>
  );
}

export default CommonInput;
