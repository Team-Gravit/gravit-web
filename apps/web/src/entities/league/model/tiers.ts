import type { FunctionComponent, SVGProps } from 'react';

import Bronze1 from './tier-icons/Bronze1.svg?react';
import Bronze2 from './tier-icons/Bronze2.svg?react';
import Bronze3 from './tier-icons/Bronze3.svg?react';
import Diamond1 from './tier-icons/Diamond1.svg?react';
import Diamond2 from './tier-icons/Diamond2.svg?react';
import Diamond3 from './tier-icons/Diamond3.svg?react';
import Gold1 from './tier-icons/Gold1.svg?react';
import Gold2 from './tier-icons/Gold2.svg?react';
import Gold3 from './tier-icons/Gold3.svg?react';
import Platinum1 from './tier-icons/Platinum1.svg?react';
import Platinum2 from './tier-icons/Platinum2.svg?react';
import Platinum3 from './tier-icons/Platinum3.svg?react';
import Silver1 from './tier-icons/Silver1.svg?react';
import Silver2 from './tier-icons/Silver2.svg?react';
import Silver3 from './tier-icons/Silver3.svg?react';

export interface Tier {
  id: number;
  name: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export const tiers: Tier[] = [
  { id: 1, name: '브론즈 3', icon: Bronze3 },
  { id: 2, name: '브론즈 2', icon: Bronze2 },
  { id: 3, name: '브론즈 1', icon: Bronze1 },
  { id: 4, name: '실버 3', icon: Silver3 },
  { id: 5, name: '실버 2', icon: Silver2 },
  { id: 6, name: '실버 1', icon: Silver1 },
  { id: 7, name: '골드 3', icon: Gold3 },
  { id: 8, name: '골드 2', icon: Gold2 },
  { id: 9, name: '골드 1', icon: Gold1 },
  { id: 10, name: '플래티넘 3', icon: Platinum3 },
  { id: 11, name: '플래티넘 2', icon: Platinum2 },
  { id: 12, name: '플래티넘 1', icon: Platinum1 },
  { id: 13, name: '다이아몬드 3', icon: Diamond3 },
  { id: 14, name: '다이아몬드 2', icon: Diamond2 },
  { id: 15, name: '다이아몬드 1', icon: Diamond1 },
];
