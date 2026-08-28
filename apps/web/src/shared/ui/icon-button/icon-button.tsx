import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { Icon, type IconName } from '@/shared/ui/icon';

export interface IconButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  'children' | 'size'
> {
  icon: IconName;
  'aria-label': string;
  shape?: 'rounded' | 'circle';
  iconSize?: number;
}

export function IconButton({
  icon,
  variant = 'ghost',
  shape = 'rounded',
  iconSize = 24,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      size="icon"
      variant={variant}
      className={cn(shape === 'circle' ? 'rounded-full' : 'rounded-6', className)}
      {...props}
    >
      <Icon name={icon} size={iconSize} />
    </Button>
  );
}
