import { createRouter } from '@tanstack/react-router';

import { queryClient } from '../query/query-client';
import { routeTree } from '../routeTree.gen';
import { SCROLL_TO_TOP_SELECTORS } from './scroll-restoration';

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  // 새 이동은 맨 위, 뒤로·앞으로는 떠날 때 위치로 복원한다 (sessionStorage 에 저장).
  scrollRestoration: true,
  // 라우터는 기본으로 window 만 맨 위로 올린다. 이 앱은 레이아웃의 상자가 스크롤하므로 함께 지정한다.
  scrollToTopSelectors: SCROLL_TO_TOP_SELECTORS,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }

  /** 라우트가 앱 셸에 전달하는 정적 메타. 셸 레이아웃이 `useMatches()`로 읽는다. */
  interface StaticDataRouteOption {
    /** 데스크톱 헤더 표면. 기본 `solid`. */
    headerVariant?: 'overlay' | 'solid';
    /** 좁은 화면에서 하단 탭 바와 콘텐츠 여백을 숨긴다. */
    hideBottomTabBar?: boolean;
  }
}

declare module '@tanstack/history' {
  /** 라우터 이동에 함께 전달하는 화면 흐름 정보. */
  interface HistoryState {
    /** 온보딩 제출 직후 완료 화면으로 이동했는지 여부. */
    fromOnboarding?: boolean;
    /** 레슨 제출 직후 결과 화면으로 이동했는지 여부. */
    fromLessonSubmission?: boolean;
  }
}
