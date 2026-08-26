import { type TextareaHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

import FieldLabel from './field-label';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  value?: string;
  label?: string;
  className?: string;
  id: string;
  textareaClassName?: string;
  labelClassName?: string;
};

function TextArea(props: TextAreaProps) {
  const { value, label, className, textareaClassName, labelClassName, id, ...rest } = props;

  const shouldShowFieldLabel = label && value && value.trim().length > 0;

  return (
    <div
      className={cn(
        'bg-white flex flex-col  justify-start rounded-lg p-4 md:p-6 border border-divider-1 overflow-hidden',
        className,
      )}
    >
      {shouldShowFieldLabel && <FieldLabel id={id} className={labelClassName} label={label} />}

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

export default TextArea;
