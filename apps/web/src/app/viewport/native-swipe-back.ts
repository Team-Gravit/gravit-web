import type { StaticDataRouteOption } from '@tanstack/react-router';

import type { router as appRouter } from '../router/router';

/** native 셸(`apps/native/app/index.tsx`)이 같은 값으로 메시지를 구분한다. 바꾸면 양쪽을 함께 고친다. */
export const SWIPE_BACK_MESSAGE_TYPE = 'swipeBack';

/** 자식 라우트의 명시값을 우선한다. 지정된 값이 없으면 스와이프를 허용한다. */
export function resolveSwipeBackEnabled(
  matches: ReadonlyArray<{ staticData: StaticDataRouteOption }>,
): boolean {
  return (
    [...matches].reverse().find((match) => match.staticData.swipeBack !== undefined)?.staticData
      .swipeBack ?? true
  );
}

/**
 * 앱 시작 시 연결해 화면 이동이 끝날 때마다 현재 라우트의 설정을 native 셸에 보낸다.
 * 브라우저에는 받을 셸이 없고, 이 메시지를 모르는 구버전 앱은 무시한다.
 */
export function syncNativeSwipeBack(router: typeof appRouter): void {
  const bridge = window.ReactNativeWebView;
  if (!bridge) {
    return;
  }

  // 첫 화면의 기본값도 보내고, 이후에는 값이 달라졌을 때만 보낸다.
  let sentEnabled: boolean | undefined;

  router.subscribe('onResolved', () => {
    const enabled = resolveSwipeBackEnabled(router.state.matches);
    if (enabled === sentEnabled) {
      return;
    }

    sentEnabled = enabled;
    bridge.postMessage(JSON.stringify({ type: SWIPE_BACK_MESSAGE_TYPE, enabled }));
  });
}
