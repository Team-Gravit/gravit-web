import * as React from 'react';

import { cn } from '@/shared/lib/cn';

type IconComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

type IconRotate = 0 | 90 | 180 | 270;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  // 이름 문자열이 아니라 컴포넌트를 받아야 빌드가 쓰는 아이콘만 번들에 남긴다.
  icon: IconComponent;
  size?: number;
  rotate?: IconRotate;
}

function Icon({
  icon: Component,
  size = 24,
  rotate = 0,
  className,
  style,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = ariaLabel ? undefined : true,
  role = ariaLabel ? 'img' : undefined,
  ...props
}: IconProps) {
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

export { Icon, type IconComponent };
