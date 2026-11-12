import type { BridgeEventType } from '@repo/bridge-protocol';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { dispatchNativeMessage } from '../mocks/native-bridge';
import { subscribeNativeEvent } from './native-events';
import { resetBridgeForTest } from './request-native';

// 실제 이벤트가 아직 등록되지 않아 구독 동작을 확인할 이름만 임시로 쓴다.
// 첫 이벤트를 등록하면 계약의 이름을 사용하고 캐스트를 지운다.
const AUTH_TOKEN = 'AUTH_TOKEN' as BridgeEventType;

afterEach(() => {
  resetBridgeForTest();
});

describe('subscribeNativeEvent', () => {
  it('구독한 type 의 이벤트가 오면 payload 로 1회 호출되고, 해제 후에는 호출되지 않는다', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeNativeEvent(AUTH_TOKEN, listener);

    dispatchNativeMessage({ kind: 'event', type: 'AUTH_TOKEN', payload: { token: 't' } });
    unsubscribe();
    dispatchNativeMessage({ kind: 'event', type: 'AUTH_TOKEN', payload: { token: 't' } });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ token: 't' });
  });

  it('다른 type 의 이벤트는 리스너를 호출하지 않는다', () => {
    const listener = vi.fn();
    subscribeNativeEvent(AUTH_TOKEN, listener);

    dispatchNativeMessage({ kind: 'event', type: 'OTHER', payload: {} });

    expect(listener).not.toHaveBeenCalled();
  });

  describe('Android 처럼 document 로 이벤트를 보낼 때', () => {
    const data = JSON.stringify({ kind: 'event', type: 'AUTH_TOKEN', payload: { token: 't' } });

    it('document 를 대상으로 한 message 이벤트도 리스너를 1회 호출한다', () => {
      const listener = vi.fn();
      subscribeNativeEvent(AUTH_TOKEN, listener);

      document.dispatchEvent(new MessageEvent('message', { data }));

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({ token: 't' });
    });

    it('이벤트가 window 로 버블링돼도 리스너는 1회만 호출된다', () => {
      const listener = vi.fn();
      subscribeNativeEvent(AUTH_TOKEN, listener);

      document.dispatchEvent(new MessageEvent('message', { data, bubbles: true }));

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});
