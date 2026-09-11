import type { FunctionComponent, SVGProps } from 'react';

import Sparkle from './sparkle.svg?react';

export interface ModalTierBadgeProps {
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export function ModalTierBadge({ icon: TierIcon }: ModalTierBadgeProps) {
  return (
    <div className="relative mx-auto w-40 text-main">
      <TierIcon className="h-auto w-full" />

      <div aria-hidden className="absolute -top-2 -right-8">
        <div className="relative size-10 inline-flex items-center justify-center rotate-10">
          <Sparkle className="size-6.5" />
          <span className="absolute bottom-0 right-0 size-1.5 rounded-full bg-current" />
          <span className="absolute bottom-0 left-0 size-1 rounded-full bg-current" />
        </div>
      </div>

      <div aria-hidden className="absolute top-10 -left-12">
        <div className="relative size-10 inline-flex items-center justify-center -rotate-20">
          <Sparkle className="size-6.5" />
          <span className="absolute -bottom-4 left-2.5 size-1.5 rounded-full bg-current" />
        </div>
      </div>

      <div aria-hidden className="absolute -bottom-4 -right-11">
        <div className="relative size-10 inline-flex items-center justify-center rotate-20">
          <Sparkle className="size-4" />
          <span className="absolute -left-1 size-1.5 rounded-full bg-current" />
        </div>
      </div>
    </div>
  );
}
