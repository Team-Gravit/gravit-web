export const APP_SHELL_SCROLL_RESTORATION_ID = 'app-shell';
export const SETTINGS_SCROLL_RESTORATION_ID = 'settings';

/** 새 이동 때 라우터가 맨 위로 올릴 스크롤 상자들. */
export const SCROLL_TO_TOP_SELECTORS = [
  `[data-scroll-restoration-id="${APP_SHELL_SCROLL_RESTORATION_ID}"]`,
  `[data-scroll-restoration-id="${SETTINGS_SCROLL_RESTORATION_ID}"]`,
];
