import { createRouter } from '@tanstack/react-router';

import { queryClient } from '../query/query-client';
import { routeTree } from '../routeTree.gen';

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

declare module '@tanstack/history' {
  /** 라우터 이동에 함께 전달하는 화면 흐름 정보. */
  interface HistoryState {
    /** 온보딩 제출 직후 완료 화면으로 이동했는지 여부. */
    fromOnboarding?: boolean;
  }
}
