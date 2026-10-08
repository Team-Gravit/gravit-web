import { cn } from '@/shared/lib/cn';

import { TierIcon } from './tier-icon';

export interface TierBadgeProps {
  leagueId: number;
  /** 서버가 주는 이름을 표시하며, 아이콘만 `leagueId`로 고른다. */
  leagueName: string;
  className?: string;
}

export function TierBadge({ leagueId, leagueName, className }: TierBadgeProps) {
  return (
    <span data-slot="tier-badge" className={cn('inline-flex items-center gap-2', className)}>
      <TierIcon tierId={leagueId} aria-hidden className="size-8 shrink-0" />
      <span className="text-heading2 text-text-1">{leagueName}</span>
    </span>
  );
}
