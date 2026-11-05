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
