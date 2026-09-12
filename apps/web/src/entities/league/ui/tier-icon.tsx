import type { FunctionComponent, SVGProps } from 'react';

import { tiers } from '../model/tiers';
import Bronze1 from './assets/tier-icons/bronze-1.svg?react';
import Bronze2 from './assets/tier-icons/bronze-2.svg?react';
import Bronze3 from './assets/tier-icons/bronze-3.svg?react';
import Diamond1 from './assets/tier-icons/diamond-1.svg?react';
import Diamond2 from './assets/tier-icons/diamond-2.svg?react';
import Diamond3 from './assets/tier-icons/diamond-3.svg?react';
import Gold1 from './assets/tier-icons/gold-1.svg?react';
import Gold2 from './assets/tier-icons/gold-2.svg?react';
import Gold3 from './assets/tier-icons/gold-3.svg?react';
import Platinum1 from './assets/tier-icons/platinum-1.svg?react';
import Platinum2 from './assets/tier-icons/platinum-2.svg?react';
import Platinum3 from './assets/tier-icons/platinum-3.svg?react';
import Silver1 from './assets/tier-icons/silver-1.svg?react';
import Silver2 from './assets/tier-icons/silver-2.svg?react';
import Silver3 from './assets/tier-icons/silver-3.svg?react';

type SvgIcon = FunctionComponent<SVGProps<SVGSVGElement>>;

// 티어 id → 아이콘. 키는 tiers의 id와 같은 1~15 체계다(브론즈 3부터 다이아 1까지).
const ICON_BY_ID: Record<number, SvgIcon> = {
  1: Bronze3,
  2: Bronze2,
  3: Bronze1,
  4: Silver3,
  5: Silver2,
  6: Silver1,
  7: Gold3,
  8: Gold2,
  9: Gold1,
  10: Platinum3,
  11: Platinum2,
  12: Platinum1,
  13: Diamond3,
  14: Diamond2,
  15: Diamond1,
};

export interface TierIconProps extends SVGProps<SVGSVGElement> {
  /** 티어 id(1~15). tierName보다 우선한다. */
  tierId?: number;
  /** 티어 이름(`브론즈 3` 등). id가 없을 때 이름으로 찾는다. */
  tierName?: string;
}

/** 티어 id 또는 이름으로 해당 티어 아이콘을 그린다. 둘 다 없거나 매칭 실패 시 브론즈 3 아이콘. */
export function TierIcon({ tierId, tierName, ...props }: TierIconProps) {
  const id = tierId ?? tiers.find((tier) => tier.name === tierName)?.id ?? 1;
  // 매핑에 없으면 최하위 티어(브론즈 3, id 1) 아이콘으로 대체한다.
  const Icon = ICON_BY_ID[id] ?? ICON_BY_ID[1];
  return <Icon {...props} />;
}
