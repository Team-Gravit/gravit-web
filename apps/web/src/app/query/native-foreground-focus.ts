import { focusManager } from '@tanstack/react-query';

import { subscribeNativeEvent } from '@/shared/api';

/**
 * iOS WKWebView는 앱 복귀 때 `visibilitychange`가 빠질 수 있다.
 * `APP_FOREGROUND`가 오면 `onFocus()`로 현재 포커스 상태를 Query에 다시 알린다.
 * 포커스 상태 자체는 바꾸지 않아, 화면이 보일 때만 오래된 활성 조회가 갱신 대상이 된다.
 */
export function connectNativeForegroundToFocus(): () => void {
  return subscribeNativeEvent('APP_FOREGROUND', () => {
    focusManager.onFocus();
  });
}
