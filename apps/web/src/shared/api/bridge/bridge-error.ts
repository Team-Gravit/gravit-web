import type { BridgeErrorCode } from '@repo/bridge-protocol';

/**
 * 브릿지 요청의 실패를 호출부에 전달한다. 호출부는 `code`로 취소·미지원·오류를 구분한다.
 * `message`는 웹에서 만든 설명이거나 네이티브가 보낸 실패 사유다.
 */
export class BridgeError extends Error {
  readonly code: BridgeErrorCode;

  constructor(code: BridgeErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'BridgeError';
    this.code = code;
  }
}

export function isBridgeError(error: unknown, code?: BridgeErrorCode): error is BridgeError {
  if (!(error instanceof BridgeError)) {
    return false;
  }

  return code === undefined || error.code === code;
}
