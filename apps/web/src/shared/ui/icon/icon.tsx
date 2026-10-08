import * as React from 'react';

import { cn } from '@/shared/lib/cn';

import { ICONS, type IconName } from './icons.generated';

export type { IconName } from './icons.generated';

type IconRotate = 0 | 90 | 180 | 270;

type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName;
  size?: number;
  rotate?: IconRotate;
};

function Icon({
  name,
  size = 24,
  rotate = 0,
  className,
  style,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = ariaLabel ? undefined : true,
  role = ariaLabel ? 'img' : undefined,
  ...props
}: IconProps) {
  const Component = ICONS[name];

  return (
    <Component
      data-slot="icon"
      width={size}
      height={size}
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      className={cn('shrink-0', className)}
      style={rotate ? { transform: `rotate(${rotate}deg)`, ...style } : style}
      {...props}
    />
  );
}

export { Icon, ICONS };
