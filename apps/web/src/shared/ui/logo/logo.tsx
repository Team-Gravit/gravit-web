import type { SVGProps } from 'react';

import LogoGradientSvg from './assets/logo-gradient.svg?react';
import LogoMonoSvg from './assets/logo-mono.svg?react';

export interface GravitLogoProps extends SVGProps<SVGSVGElement> {
  /**
   * gradient — 브랜드 그라디언트가 들어간 기본 로고.
   * mono — `currentColor` 단색. 어두운 배경 위에 올릴 때 사용한다.
   */
  variant?: 'gradient' | 'mono';
}

// Icon 컴포넌트를 쓰지 않는 이유: Icon 은 width/height 를 size 하나로 묶어 정사각형을 강제한다.
// 로고는 가로로 긴 비율이고 gradient 변형은 다색이라 아이콘 의미론에 맞지 않는다.
export function GravitLogo({ variant = 'gradient', ...props }: GravitLogoProps) {
  const Svg = variant === 'gradient' ? LogoGradientSvg : LogoMonoSvg;

  return <Svg data-slot="logo" data-variant={variant} {...props} />;
}
