import { type TextareaHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

type CommonTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  className?: string;
  id: string;
  textareaClassName?: string;
  labelClassName?: string;
};

function CommonTextarea(props: CommonTextareaProps) {
  const { value, label, className, textareaClassName, labelClassName, id, ...rest } = props;

  return (
    <div
      className={cn(
        'bg-white flex flex-col  justify-start rounded-lg p-4 md:p-6 border border-divider-1 overflow-hidden',
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

      <textarea
        id={id}
        value={value ?? ''}
        {...rest}
        className={cn(
          'h-full w-full outline-none resize-none text-label1 md:text-headline2 ',
          'placeholder:text-label1 md:placeholder:text-headline2 placeholder:text-text-4',
          textareaClassName,
        )}
      />
    </div>
  );
}

export default CommonTextarea;
