import { cn } from '@/shared/lib/cn';

interface FieldLabelProps {
  label: string;
  id?: string;
  className?: string;
}

function FieldLabel({ label, id, className }: FieldLabelProps) {
  const Component = id ? 'label' : 'div';

  return (
    <Component
      {...(id ? { htmlFor: id } : {})}
      className={cn('text-caption1 text-text-4 mb-0.5 md:mb-1', className)}
    >
      {label}
    </Component>
  );
}

export default FieldLabel;
