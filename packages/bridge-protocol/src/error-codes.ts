/**
 * 웹과 네이티브가 공유하는 실패 코드.
 *
 * `TIMEOUT`과 `UNAVAILABLE`은 웹에서 판정한다. `CANCELLED`는 SDK 로그인 취소,
 * `UNSUPPORTED`는 앱에 요청 핸들러가 없다는 뜻이다. 알림이나 대체 경로는 호출부가 정한다.
 * 그 외 네이티브 오류는 `NATIVE_ERROR`이며, 세부 사유는 `message`에 담을 수 있다.
 */
export const BRIDGE_ERROR_CODES = [
  'TIMEOUT',
  'CANCELLED',
  'UNAVAILABLE',
  'UNSUPPORTED',
  'NATIVE_ERROR',
] as const;

export type BridgeErrorCode = (typeof BRIDGE_ERROR_CODES)[number];

export function isBridgeErrorCode(value: unknown): value is BridgeErrorCode {
  return BRIDGE_ERROR_CODES.some((code) => code === value);
}
