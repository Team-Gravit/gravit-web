import type { StaticDataRouteOption } from '@tanstack/react-router';

import type { router as appRouter } from '../router/router';

/** 시계·배터리 글자색. `light`는 어두운 배경 위의 흰 글자다. */
export type StatusBarStyle = 'light' | 'dark';

/** native 셸(`apps/native/app/index.tsx`)이 같은 값으로 메시지를 구분한다. 바꾸면 양쪽을 함께 고친다. */
export const STATUS_BAR_STYLE_MESSAGE_TYPE = 'statusBarStyle';

declare global {
  interface Window {
    /** react-native-webview 가 앱 안에서만 주입한다. 브라우저에는 없다. */
    ReactNativeWebView?: { postMessage: (message: string) => void };
  }
}

/** 가장 깊은 라우트의 `statusBarStyle`을 쓰고, 없으면 부모 값을 상속한다. 아무도 지정하지 않으면 `dark`. */
export function resolveStatusBarStyle(
  matches: ReadonlyArray<{ staticData: StaticDataRouteOption }>,
): StatusBarStyle {
  return (
    [...matches].reverse().find((match) => match.staticData.statusBarStyle)?.staticData
      .statusBarStyle ?? 'dark'
  );
}

/**
 * 화면 이동이 끝날 때마다 시계 글자색을 native 셸에 알린다. 앱 부팅 시 한 번 호출한다.
 * 브라우저에서는 받을 곳이 없으므로 아무것도 하지 않는다.
 */
export function syncNativeStatusBarStyle(router: typeof appRouter): void {
  const bridge = window.ReactNativeWebView;
  if (!bridge) {
    return;
  }

  let sentStyle: StatusBarStyle | undefined;

  router.subscribe('onResolved', () => {
    const style = resolveStatusBarStyle(router.state.matches);
    if (style === sentStyle) {
      return;
    }

    sentStyle = style;
    bridge.postMessage(JSON.stringify({ type: STATUS_BAR_STYLE_MESSAGE_TYPE, style }));
  });
}
