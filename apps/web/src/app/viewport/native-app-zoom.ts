/** native 셸(`apps/native`)이 WebView 기본 UA 뒤에 덧붙이는 앱 식별자. */
const NATIVE_USER_AGENT_MARKER = 'GravitNative/';

const ZOOM_LOCKED_VIEWPORT_CONTENT = 'width=device-width, initial-scale=1.0, maximum-scale=1.0';

/**
 * 앱(WebView)에서만 viewport 에 `maximum-scale=1` 을 더해 화면 확대를 막는다. 렌더링 전에 한 번 호출한다.
 * 브라우저에는 넣지 않는다 — Android 브라우저는 이 값이 있으면 손가락 확대가 막혀 저시력 사용자가 글자를
 * 키울 수 없다 (WCAG 1.4.4). 입력창 포커스 자동 확대는 입력 글자를 16px 이상으로 두어 피한다.
 */
export function lockNativeAppZoom(doc: Document, userAgent: string): void {
  if (!userAgent.includes(NATIVE_USER_AGENT_MARKER)) {
    return;
  }

  doc.querySelector('meta[name="viewport"]')?.setAttribute('content', ZOOM_LOCKED_VIEWPORT_CONTENT);
}
