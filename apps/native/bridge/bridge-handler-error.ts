import type { BridgeErrorCode } from '@repo/bridge-protocol';

/**
 * 네이티브 핸들러가 의도한 실패 코드를 웹에 전달할 때 사용한다.
 * SDK마다 다른 취소 신호는 각 핸들러가 `CANCELLED`로 바꾼다.
 * 이 클래스가 아닌 예외는 브릿지가 `NATIVE_ERROR`로 응답한다.
 */
export class BridgeHandlerError extends Error {
  readonly code: BridgeErrorCode;

  constructor(code: BridgeErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'BridgeHandlerError';
    this.code = code;
  }
}
