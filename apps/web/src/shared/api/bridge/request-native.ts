import type {
  BridgeRequest,
  BridgeRequestPayload,
  BridgeRequestType,
  BridgeResponse,
  BridgeResult,
} from '@repo/bridge-protocol';

import { BridgeError } from './bridge-error';
import { isNativeApp } from './native-environment';
import { onNativeResponse, resetNativeMessageChannelForTest } from './native-message-channel';

/** 짧은 요청의 기본 대기 시간. 로그인처럼 오래 걸리는 요청은 호출부에서 늘린다. */
const DEFAULT_BRIDGE_TIMEOUT_MS = 10_000;

interface PendingRequest {
  resolve: (result: unknown) => void;
  reject: (error: BridgeError) => void;
  timer: ReturnType<typeof setTimeout>;
}

const pendingRequests = new Map<string, PendingRequest>();
let unsubscribeResponses: (() => void) | null = null;
let requestCount = 0;

/**
 * 요청과 응답을 짝짓는 ID를 만든다. 같은 문서 수명 안에서 겹치지 않으면 된다.
 *
 * 개발용 WebView의 `http://{LAN IP}`에서는 `crypto.randomUUID`가 없을 수 있다.
 * 시각을 포함해 새로고침 전 요청의 늦은 응답과도 ID가 겹치지 않게 한다.
 */
function createRequestId(): string {
  requestCount += 1;

  return `${Date.now()}-${requestCount}`;
}

/** 응답과 타임아웃 중 먼저 끝난 쪽만 대기 요청을 가져간다. */
function takePending(id: string): PendingRequest | undefined {
  const pending = pendingRequests.get(id);

  if (pending) {
    clearTimeout(pending.timer);
    pendingRequests.delete(id);
  }

  return pending;
}

function handleResponse(response: BridgeResponse) {
  const pending = takePending(response.id);

  if (!pending) {
    console.warn(`[bridge] 대기 중이지 않은 응답을 무시한다: id=${response.id}`);
    return;
  }

  if (response.ok) {
    pending.resolve(response.result);
    return;
  }

  pending.reject(new BridgeError(response.error.code, response.error.message));
}

function ensureSubscribed() {
  unsubscribeResponses ??= onNativeResponse(handleResponse);
}

export interface RequestNativeOptions {
  timeoutMs?: number;
}

/**
 * 네이티브에 요청을 보내고 같은 `id`의 응답을 기다린다.
 *
 * 앱 환경이나 전송 객체가 없으면 `UNAVAILABLE`, 응답이 없으면 `TIMEOUT`으로 실패한다.
 * 네이티브가 실패를 보내면 그 코드를 보존한다. 실패는 모두 `BridgeError`로 전달하며,
 * 성공 결과의 내용은 런타임에서 검증하지 않는다.
 */
export function requestNative<T extends BridgeRequestType>(
  type: T,
  payload: BridgeRequestPayload<T>,
  { timeoutMs = DEFAULT_BRIDGE_TIMEOUT_MS }: RequestNativeOptions = {},
): Promise<BridgeResult<T>> {
  const nativeWebView = window.ReactNativeWebView;

  if (!isNativeApp() || !nativeWebView) {
    return Promise.reject(new BridgeError('UNAVAILABLE'));
  }

  ensureSubscribed();

  return new Promise<BridgeResult<T>>((resolve, reject) => {
    const id = createRequestId();
    const timer = setTimeout(() => {
      if (takePending(id)) {
        reject(new BridgeError('TIMEOUT'));
      }
    }, timeoutMs);

    pendingRequests.set(id, {
      resolve: (result) => resolve(result as BridgeResult<T>),
      reject,
      timer,
    });

    const request: BridgeRequest<T> = { kind: 'request', id, type, payload };
    nativeWebView.postMessage(JSON.stringify(request));
  });
}

/** 테스트 사이에 남은 타이머와 메시지 구독을 비운다. */
export function resetBridgeForTest(): void {
  pendingRequests.forEach((pending) => clearTimeout(pending.timer));
  pendingRequests.clear();
  unsubscribeResponses?.();
  unsubscribeResponses = null;
  resetNativeMessageChannelForTest();
}
