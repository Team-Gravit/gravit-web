export interface HeaderNavItem {
  to: '/main' | '/learning' | '/league' | '/my';
  label: string;
}

export const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  { to: '/main', label: '홈' },
  { to: '/learning', label: '학습' },
  { to: '/league', label: '리그' },
  { to: '/my', label: '마이그래빗' },
];
