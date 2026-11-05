import {
  isAllowedBridgeOrigin,
  parseBridgeMessage,
  type BridgeEvent,
  type BridgeEventPayload,
  type BridgeEventType,
  type BridgeFailure,
  type BridgeRequest,
  type BridgeRequestPayload,
  type BridgeRequestType,
  type BridgeResponse,
  type BridgeResult,
} from '@repo/bridge-protocol';

import { BridgeHandlerError } from './bridge-handler-error';

/** 요청 종류 하나를 처리한다. 값을 반환하면 성공 응답, 던지면 실패 응답이 된다. */
export type BridgeHandlers = {
  [T in BridgeRequestType]?: (
    payload: BridgeRequestPayload<T>,
  ) => Promise<BridgeResult<T>> | BridgeResult<T>;
};

export interface CreateBridgeOptions {
  handlers: BridgeHandlers;
  /** 요청을 처리할 웹 주소. origin 이 다른 페이지의 요청은 처리하지 않고 응답도 보내지 않는다. */
  allowedUrl: string;
  /** WebView의 `postMessage`로 응답과 이벤트를 전달한다. */
  postMessage: (json: string) => void;
  /** 브릿지 봉투로 해석할 수 없는 메시지를 기존 처리 경로로 넘긴다. */
  onUnhandled?: (raw: string) => void;
}

export interface Bridge {
  /** `<WebView onMessage>` 에 그대로 연결한다. */
  handleMessage: (event: { nativeEvent: { data: string; url: string } }) => void;
  /** 요청 없이 웹에 이벤트를 보낸다. */
  emit: <T extends BridgeEventType>(type: T, payload: BridgeEventPayload<T>) => void;
}

function toFailure(error: unknown): BridgeFailure {
  if (error instanceof BridgeHandlerError) {
    return { code: error.code, message: error.message };
  }

  const message = error instanceof Error ? error.message : String(error);

  return { code: 'NATIVE_ERROR', message };
}

/**
 * 웹 요청을 해당 핸들러에 전달하고 같은 `id`로 결과를 돌려준다.
 * 등록되지 않은 요청은 `UNSUPPORTED`, 예상하지 못한 핸들러 오류는 `NATIVE_ERROR`로 응답한다.
 */
export function createBridge({
  handlers,
  allowedUrl,
  postMessage,
  onUnhandled,
}: CreateBridgeOptions): Bridge {
  const respond = (response: BridgeResponse) => {
    postMessage(JSON.stringify(response));
  };

  const handleRequest = async (request: BridgeRequest) => {
    const handler = handlers[request.type] as
      | ((payload: unknown) => Promise<unknown> | unknown)
      | undefined;

    if (!handler) {
      respond({
        kind: 'response',
        id: request.id,
        ok: false,
        error: { code: 'UNSUPPORTED', message: `지원하지 않는 요청: ${request.type}` },
      });
      return;
    }

    try {
      const result = await handler(request.payload);
      respond({ kind: 'response', id: request.id, ok: true, result });
    } catch (error) {
      const failure = toFailure(error);

      // 개발 중 SDK 오류를 확인하되 요청·응답 원문은 토큰이 포함될 수 있어 기록하지 않는다.
      if (__DEV__) {
        console.warn(`[bridge] ${request.type} 실패: ${failure.code} ${failure.message ?? ''}`);
      }

      respond({ kind: 'response', id: request.id, ok: false, error: failure });
    }
  };

  return {
    handleMessage: ({ nativeEvent }) => {
      const message = parseBridgeMessage(nativeEvent.data);

      if (!message) {
        onUnhandled?.(nativeEvent.data);
        return;
      }

      if (message.kind === 'request') {
        if (!isAllowedBridgeOrigin(nativeEvent.url, allowedUrl)) {
          // 주소에 인가 코드 같은 값이 있을 수 있어 경고에 주소와 메시지 원문을 남기지 않는다.
          console.warn('[bridge] 허용되지 않은 페이지의 요청을 무시했다');
          return;
        }

        void handleRequest(message);
        return;
      }

      console.warn(`[bridge] 웹이 보낸 ${message.kind} 는 지원하지 않는다`);
    },
    emit: (type, payload) => {
      const event: BridgeEvent = { kind: 'event', type, payload };
      postMessage(JSON.stringify(event));
    },
  };
}
