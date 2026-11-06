import type { BridgeRequestPayload, BridgeRequestType } from './contracts';
import { isBridgeErrorCode, type BridgeErrorCode } from './error-codes';

/** 요청마다 고유한 `id`를 붙여 응답과 짝짓는다. */
export interface BridgeRequest<T extends BridgeRequestType = BridgeRequestType> {
  kind: 'request';
  id: string;
  type: T;
  payload: BridgeRequestPayload<T>;
}

export interface BridgeFailure {
  code: BridgeErrorCode;
  message?: string;
}

/** 네이티브는 요청의 `id`를 되돌려 준다. `result`의 형태는 여기서 검증하지 않는다. */
export type BridgeResponse =
  | { kind: 'response'; id: string; ok: true; result: unknown }
  | { kind: 'response'; id: string; ok: false; error: BridgeFailure };

/** 요청과 관계없이 네이티브가 먼저 보내므로 `id`가 없다. */
export interface BridgeEvent {
  kind: 'event';
  type: string;
  payload: unknown;
}

export type BridgeMessage = BridgeRequest | BridgeResponse | BridgeEvent;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFailure(value: unknown): value is BridgeFailure {
  return (
    isRecord(value) &&
    isBridgeErrorCode(value.code) &&
    (value.message === undefined || typeof value.message === 'string')
  );
}

/**
 * `postMessage`로 받은 문자열에서 브릿지 봉투의 필수 필드만 확인한다.
 *
 * 요청 `type`별 payload와 성공 result의 내용은 검증하지 않는다. 깨진 JSON, 필수 필드가
 * 빠진 봉투, 기존 WebView 에러 리포트처럼 `kind`가 없는 메시지는 `null`로 반환한다.
 */
export function parseBridgeMessage(raw: string): BridgeMessage | null {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(parsed)) {
    return null;
  }

  if (parsed.kind === 'request') {
    if (typeof parsed.id !== 'string' || typeof parsed.type !== 'string') {
      return null;
    }

    return {
      kind: 'request',
      id: parsed.id,
      type: parsed.type as BridgeRequestType,
      payload: parsed.payload as BridgeRequestPayload<BridgeRequestType>,
    };
  }

  if (parsed.kind === 'response') {
    if (typeof parsed.id !== 'string') {
      return null;
    }

    if (parsed.ok === true) {
      return { kind: 'response', id: parsed.id, ok: true, result: parsed.result };
    }

    if (parsed.ok === false && isFailure(parsed.error)) {
      return { kind: 'response', id: parsed.id, ok: false, error: parsed.error };
    }

    return null;
  }

  if (parsed.kind === 'event') {
    if (typeof parsed.type !== 'string') {
      return null;
    }

    return { kind: 'event', type: parsed.type, payload: parsed.payload };
  }

  return null;
}
