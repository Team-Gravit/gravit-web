// 이 패키지는 DOM 타입을 쓰지 않으므로 URL 객체 대신 문자열에서 origin을 읽는다.
const ORIGIN_PATTERN = /^(https?):\/\/([^/?#]+)/i;

function readOrigin(url: string): string | null {
  const match = ORIGIN_PATTERN.exec(url);

  return match ? `${match[1]}://${match[2]}`.toLowerCase() : null;
}

/**
 * 브릿지 요청을 보낸 페이지가 앱이 불러온 웹과 같은 origin 인지 판별한다.
 *
 * 응답에 SDK 토큰이 실리므로 WebView 가 외부 페이지로 이동한 상태의 요청을 처리하면 안 된다.
 * 읽을 수 없는 주소는 허용하지 않는다.
 */
export function isAllowedBridgeOrigin(messageUrl: string, allowedUrl: string): boolean {
  const messageOrigin = readOrigin(messageUrl);

  return messageOrigin !== null && messageOrigin === readOrigin(allowedUrl);
}
