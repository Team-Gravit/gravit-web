import type { FunctionComponent, SVGProps } from 'react';

import HomeIcon from '../ui/assets/home.svg?react';
import HomeFillIcon from '../ui/assets/home-fill.svg?react';
import LeagueIcon from '../ui/assets/league.svg?react';
import LeagueFillIcon from '../ui/assets/league-fill.svg?react';
import LearningIcon from '../ui/assets/learning.svg?react';
import LearningFillIcon from '../ui/assets/learning-fill.svg?react';
import MyIcon from '../ui/assets/my.svg?react';
import MyFillIcon from '../ui/assets/my-fill.svg?react';

type SvgIcon = FunctionComponent<SVGProps<SVGSVGElement>>;

export interface BottomTabItem {
  label: string;
  to: '/main' | '/learning' | '/league' | '/my';
  icon: SvgIcon;
  /** 활성 상태 아이콘(채움). */
  activeIcon: SvgIcon;
}

export const BOTTOM_TAB_ITEMS: BottomTabItem[] = [
  { label: '홈', to: '/main', icon: HomeIcon, activeIcon: HomeFillIcon },
  { label: '학습', to: '/learning', icon: LearningIcon, activeIcon: LearningFillIcon },
  { label: '리그', to: '/league', icon: LeagueIcon, activeIcon: LeagueFillIcon },
  { label: '마이그래빗', to: '/my', icon: MyIcon, activeIcon: MyFillIcon },
];
