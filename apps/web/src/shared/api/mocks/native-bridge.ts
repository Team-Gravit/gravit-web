import type { BridgeErrorCode, BridgeRequest } from '@repo/bridge-protocol';
import { vi, type Mock } from 'vitest';

import { resetBridgeForTest } from '../bridge';

const NATIVE_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 GravitNative/1.0';

const originalUserAgent = navigator.userAgent;

function stubUserAgent(userAgent: string) {
  Object.defineProperty(navigator, 'userAgent', { configurable: true, value: userAgent });
}

export interface NativeBridgeStub {
  postMessage: Mock<(message: string) => void>;
  /** 아직 요청을 보내지 않았다면 예외를 던진다. */
  readLastRequest: () => BridgeRequest;
}

/**
 * 테스트용 UA와 `ReactNativeWebView`를 설치한다.
 * 테스트가 끝나면 `uninstallNativeBridgeStub()`로 둘 다 되돌린다.
 */
export function installNativeBridgeStub(): NativeBridgeStub {
  const postMessage = vi.fn<(message: string) => void>();

  stubUserAgent(NATIVE_USER_AGENT);
  window.ReactNativeWebView = { postMessage };

  return {
    postMessage,
    readLastRequest: () => {
      const raw = postMessage.mock.lastCall?.[0];

      if (raw === undefined) {
        throw new Error('postMessage 가 아직 호출되지 않았다');
      }

      return JSON.parse(raw) as BridgeRequest;
    },
  };
}

export function uninstallNativeBridgeStub(): void {
  resetBridgeForTest();
  delete window.ReactNativeWebView;
  stubUserAgent(originalUserAgent);
}

/** 객체는 JSON 문자열로 바꿔 네이티브 응답처럼 `message` 이벤트로 보낸다. */
export function dispatchNativeMessage(message: string | object): void {
  const data = typeof message === 'string' ? message : JSON.stringify(message);

  window.dispatchEvent(new MessageEvent('message', { data }));
}

export function respondFromNative(id: string, result: unknown): void {
  dispatchNativeMessage({ kind: 'response', id, ok: true, result });
}

export function failFromNative(id: string, code: BridgeErrorCode, message?: string): void {
  dispatchNativeMessage({ kind: 'response', id, ok: false, error: { code, message } });
}
