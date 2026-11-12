import { describe, expect, it } from 'vitest';

import { parseBridgeMessage } from './envelope';
import { isNativeUserAgent } from './user-agent';

describe('parseBridgeMessage', () => {
  it('event 봉투를 넘기면 kind · type · payload 를 그대로 반환한다', () => {
    const message = parseBridgeMessage(
      '{"kind":"event","type":"AUTH_TOKEN","payload":{"token":"t"}}',
    );

    expect(message).toEqual({ kind: 'event', type: 'AUTH_TOKEN', payload: { token: 't' } });
  });

  it('성공 response 봉투를 넘기면 ok: true 와 result 를 반환한다', () => {
    const message = parseBridgeMessage(
      '{"kind":"response","id":"r1","ok":true,"result":{"platform":"ios"}}',
    );

    expect(message).toEqual({
      kind: 'response',
      id: 'r1',
      ok: true,
      result: { platform: 'ios' },
    });
  });

  it('실패 response 봉투는 code 가 알려진 것일 때만 반환한다', () => {
    expect(
      parseBridgeMessage('{"kind":"response","id":"r1","ok":false,"error":{"code":"CANCELLED"}}'),
    ).toEqual({ kind: 'response', id: 'r1', ok: false, error: { code: 'CANCELLED' } });

    expect(
      parseBridgeMessage('{"kind":"response","id":"r1","ok":false,"error":{"code":"NOPE"}}'),
    ).toBeNull();
  });

  it('request 봉투를 넘기면 id · type · payload 를 반환한다', () => {
    expect(
      parseBridgeMessage('{"kind":"request","id":"r1","type":"APP_INFO","payload":{}}'),
    ).toEqual({ kind: 'request', id: 'r1', type: 'APP_INFO', payload: {} });
  });

  it('기존 에러 리포트 형식 {"type":"window.error"} 은 null 을 반환한다', () => {
    expect(parseBridgeMessage('{"type":"window.error"}')).toBeNull();
  });

  it.each(['not json', '"string"', 'null', '{"kind":"response"}', '{"kind":"other","id":"x"}'])(
    '봉투가 아닌 %s 는 null 을 반환한다',
    (raw) => {
      expect(parseBridgeMessage(raw)).toBeNull();
    },
  );
});

describe('isNativeUserAgent', () => {
  it('GravitNative/ 가 들어 있으면 true 를 반환한다', () => {
    expect(
      isNativeUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) GravitNative/1.0'),
    ).toBe(true);
  });

  it('브라우저 UA 면 false 를 반환한다', () => {
    expect(isNativeUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/604.1')).toBe(false);
  });
});
