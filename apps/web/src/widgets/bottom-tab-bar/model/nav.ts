import type { FunctionComponent, SVGProps } from 'react';

import type { NavItem } from '@/shared/config';

import HomeIcon from '../ui/assets/home.svg?react';
import HomeFillIcon from '../ui/assets/home-fill.svg?react';
import LeagueIcon from '../ui/assets/league.svg?react';
import LeagueFillIcon from '../ui/assets/league-fill.svg?react';
import LearningIcon from '../ui/assets/learning.svg?react';
import LearningFillIcon from '../ui/assets/learning-fill.svg?react';
import MyIcon from '../ui/assets/my.svg?react';
import MyFillIcon from '../ui/assets/my-fill.svg?react';

type SvgIcon = FunctionComponent<SVGProps<SVGSVGElement>>;

interface TabIcons {
  idle: SvgIcon;

  active: SvgIcon;
}

// 경로와 레이블은 `NAV_ITEMS`에서 공유하고, 탭바는 아이콘만 연결한다.
export const TAB_ICONS: Record<NavItem['to'], TabIcons> = {
  '/main': { idle: HomeIcon, active: HomeFillIcon },
  '/learning': { idle: LearningIcon, active: LearningFillIcon },
  '/league': { idle: LeagueIcon, active: LeagueFillIcon },
  '/my': { idle: MyIcon, active: MyFillIcon },
};
