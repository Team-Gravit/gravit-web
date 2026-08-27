import { cva } from 'class-variance-authority';

import { getTierIconById, getTierIconByName } from '../lib/getTierIcon';

const sizeVariants = cva('shrink-0 aspect-square', {
  variants: {
    size: {
      xs: 'size-8 md:size-8',
      sm: 'md:size-11',
    },
  },
  defaultVariants: { size: 'sm' },
});

type TierProps =
  | { tierId: number; tierName?: never; size: 'xs' | 'sm' }
  | { tierId?: never; tierName: string; size: 'xs' | 'sm' };

export default function Tier({ tierId, tierName, size }: TierProps) {
  const TierIcon = tierId !== undefined ? getTierIconById(tierId) : getTierIconByName(tierName);
  return <TierIcon className={sizeVariants({ size })} />;
}
