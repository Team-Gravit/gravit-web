import { type InputHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

import FieldLabel from './field-label';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  value?: string;
  label?: string;
  className?: string;
  id: string;
  inputClassName?: string;
  labelClassName?: string;
};

function Input(props: InputProps) {
  const { value, label, className, id, inputClassName, labelClassName, ...rest } = props;
  const shouldShowFieldLabel = label && value && value.trim().length > 0;

  return (
    <div
      className={cn(
        'bg-white h-[54px] md:h-[74px] flex flex-col justify-center rounded-lg px-4 md:px-6 py-2.5 border border-divider-1',
        className,
      )}
    >
      {shouldShowFieldLabel && <FieldLabel id={id} className={labelClassName} label={label} />}

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

export default Input;
