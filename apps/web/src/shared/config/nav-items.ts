/** 헤더와 하단 탭바가 공유하는 경로와 레이블. */
export interface NavItem {
  to: '/main' | '/learning' | '/league' | '/my';
  label: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/main', label: '홈' },
  { to: '/learning', label: '학습' },
  { to: '/league', label: '리그' },
  { to: '/my', label: '마이그래빗' },
];

/** 공통 메뉴에 헤더 전용 경로를 추가할 때 사용하는 항목. */
export interface HeaderNavItem {
  to: NavItem['to'] | '/interview';
  label: string;
}

// AI면접의 하단 탭 시안이 정해지면 NAV_ITEMS로 옮긴다. 현재는 헤더에서만 진입한다.
export const HEADER_NAV_ITEMS: readonly HeaderNavItem[] = [
  ...NAV_ITEMS,
  { to: '/interview', label: 'AI면접' },
];
