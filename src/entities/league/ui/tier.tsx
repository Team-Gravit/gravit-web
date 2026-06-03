import { cva } from 'class-variance-authority';

import { getTierIconById } from '../lib/getTierIcon';

const sizeVariants = cva('shrink-0 aspect-square', {
  variants: {
    size: {
      xs: 'size-8 md:size-8',
      sm: 'md:size-11',
    },
  },
  defaultVariants: { size: 'sm' },
});

export default function Tier({ tierId, size }: { tierId: number; size: 'xs' | 'sm' }) {
  const TierIcon = getTierIconById(tierId);
  return <TierIcon className={sizeVariants({ size })} />;
}
