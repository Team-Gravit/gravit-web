import { isNativeUserAgent } from '@repo/bridge-protocol';

/**
 * 앱(WebView)에서 열렸으면 `<html>`에 `data-native-app`을 단다. 렌더링 전에 한 번 호출한다.
 *
 * CSS가 이 표시로 앱에서만 다르게 동작할 곳을 고른다. 예: iOS WebView 에서 링크를 길게 누르면
 * 뜨는 미리보기 · 「열기 / 링크 복사 / 공유」 메뉴를 끈다 (`base.css`). 브라우저에서는 길게 눌러
 * 새 탭에서 열기가 그대로 동작해야 하므로 표시를 달지 않는다.
 */
export function markNativeApp(doc: Document, userAgent: string): void {
  if (!isNativeUserAgent(userAgent)) {
    return;
  }

  doc.documentElement.dataset.nativeApp = '';
}
