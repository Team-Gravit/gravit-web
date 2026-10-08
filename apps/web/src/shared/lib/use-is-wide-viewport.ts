import { useSyncExternalStore } from 'react';

/**
 * 넓은 화면으로 볼 최소 폭.
 * Tailwind `md` 브레이크포인트와 **같은 값** — 훅과 클래스가 다른 값을 보면
 * 경계에서 헤더는 좁은 화면인데 본문은 넓은 화면인 상태가 생길 수 있으니 유의
 */
export const WIDE_VIEWPORT_MIN_WIDTH_PX = 768;

const WIDE_VIEWPORT_QUERY = `(min-width: ${WIDE_VIEWPORT_MIN_WIDTH_PX}px)`;

// 모듈 스코프에 캐시하지 않는다. 테스트가 window.matchMedia 를 교체해도 그 교체본을 보게 해야 한다.
function getMediaQueryList(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }

  return window.matchMedia(WIDE_VIEWPORT_QUERY);
}

function subscribe(onStoreChange: () => void): () => void {
  const mediaQueryList = getMediaQueryList();

  if (!mediaQueryList) {
    return () => {};
  }

  mediaQueryList.addEventListener('change', onStoreChange);

  return () => mediaQueryList.removeEventListener('change', onStoreChange);
}

// matchMedia 를 쓸 수 없는 환경에서는 좁은 화면으로 본다. 좁은 화면 레이아웃이 넓은 쪽에서도
// 깨지지 않고 읽히므로, 반대 방향보다 실패했을 때의 결과가 낫다.
function getIsWideViewport(): boolean {
  return getMediaQueryList()?.matches ?? false;
}

/** 현재 뷰포트가 넓은 화면인지 구독한다. 화면 구조 자체가 갈리는 곳에서만 쓴다. */
export function useIsWideViewport(): boolean {
  return useSyncExternalStore(subscribe, getIsWideViewport);
}
