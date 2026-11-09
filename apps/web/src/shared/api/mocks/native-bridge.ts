import type { BridgeErrorCode, BridgeRequest, BridgeResult } from '@repo/bridge-protocol';
import { vi, type Mock } from 'vitest';

import { resetBridgeForTest } from '../bridge';

const NATIVE_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 GravitNative/1.0';

const originalUserAgent = navigator.userAgent;

function stubUserAgent(userAgent: string) {
  Object.defineProperty(navigator, 'userAgent', { configurable: true, value: userAgent });
}

export interface NativeBridgeStubOptions {
  /** 주면 `APP_INFO` 요청에 이 플랫폼으로 바로 응답한다. 그 요청은 `postMessage`에 기록하지 않는다. */
  platform?: BridgeResult<'APP_INFO'>['platform'];
}

export interface NativeBridgeStub {
  /** 스텁이 자동 응답한 `APP_INFO`를 뺀, 테스트가 직접 응답할 요청만 기록한다. */
  postMessage: Mock<(message: string) => void>;
  /** 아직 요청을 보내지 않았다면 예외를 던진다. */
  readLastRequest: () => BridgeRequest;
  readAppInfoRequestCount: () => number;
}

/**
 * 테스트용 UA와 `ReactNativeWebView`를 설치한다.
 * 테스트가 끝나면 `uninstallNativeBridgeStub()`로 둘 다 되돌린다.
 */
export function installNativeBridgeStub({
  platform,
}: NativeBridgeStubOptions = {}): NativeBridgeStub {
  const postMessage = vi.fn<(message: string) => void>();
  let appInfoRequestCount = 0;

  stubUserAgent(NATIVE_USER_AGENT);
  window.ReactNativeWebView = {
    postMessage: (message) => {
      const request = JSON.parse(message) as BridgeRequest;

      if (platform && request.type === 'APP_INFO') {
        appInfoRequestCount += 1;
        // 실제 네이티브처럼 비동기로 응답한다.
        queueMicrotask(() => respondFromNative(request.id, { platform, appVersion: '1.0.0' }));
        return;
      }

      postMessage(message);
    },
  };

  return {
    postMessage,
    readAppInfoRequestCount: () => appInfoRequestCount,
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
