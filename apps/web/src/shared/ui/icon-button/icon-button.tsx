import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { Icon, type IconComponent } from '@/shared/ui/icon';

// asChild 는 받지 않는다. 이 컴포넌트는 children 을 Icon 으로 고정하므로
// Slot 에 넘길 대상 엘리먼트가 호출부에 없다.
export interface IconButtonProps
  extends Omit<React.ComponentProps<typeof Button>, 'children' | 'size' | 'asChild'> {
  icon: IconComponent;
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
      <Icon icon={icon} size={iconSize} />
    </Button>
  );
}
