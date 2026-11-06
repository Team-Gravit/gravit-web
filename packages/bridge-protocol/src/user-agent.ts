/**
 * 웹이 앱 안에서 실행 중인지 판별할 때 찾는 User-Agent 마커.
 *
 * 네이티브는 `applicationNameForUserAgent`로 기본 UA 뒤에 `{마커}/{앱 버전}`을 붙인다.
 * 기본 UA를 대체하면 WebKit 정보가 사라져 일부 소셜 로그인 제공자가 브라우저를 차단한다.
 */
export const NATIVE_USER_AGENT_MARKER = 'GravitNative';

export function isNativeUserAgent(userAgent: string): boolean {
  return userAgent.includes(`${NATIVE_USER_AGENT_MARKER}/`);
}
