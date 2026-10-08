import type { SVGProps } from 'react';

import LogoRabbitSvg from './assets/logo-rabbit.svg?react';

export type GravitSymbolProps = SVGProps<SVGSVGElement>;

export function GravitSymbol(props: GravitSymbolProps) {
  return <LogoRabbitSvg data-slot="logo-symbol" {...props} />;
}
