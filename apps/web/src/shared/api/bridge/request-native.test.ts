import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  dispatchNativeMessage,
  failFromNative,
  installNativeBridgeStub,
  respondFromNative,
  uninstallNativeBridgeStub,
  type NativeBridgeStub,
} from '../mocks/native-bridge';
import { BridgeError } from './bridge-error';
import { requestNative } from './request-native';

let bridge: NativeBridgeStub;

beforeEach(() => {
  bridge = installNativeBridgeStub();
});

afterEach(() => {
  uninstallNativeBridgeStub();
  vi.useRealTimers();
});

describe('requestNative', () => {
  it('APP_INFO 를 요청하면 request 봉투를 postMessage 하고, 같은 id 의 응답으로 resolve 된다', async () => {
    const promise = requestNative('APP_INFO', {});

    expect(bridge.postMessage).toHaveBeenCalledTimes(1);
    const request = bridge.readLastRequest();
    expect(request).toMatchObject({ kind: 'request', type: 'APP_INFO', payload: {} });
    expect(typeof request.id).toBe('string');

    respondFromNative(request.id, { platform: 'ios', appVersion: '1.0.0' });

    await expect(promise).resolves.toEqual({ platform: 'ios', appVersion: '1.0.0' });
  });

  it('crypto.randomUUID 가 없는 HTTP 환경에서도 요청마다 다른 id 로 postMessage 한다', () => {
    vi.stubGlobal('crypto', {});

    try {
      void requestNative('APP_INFO', {}).catch(() => {});
      const firstId = bridge.readLastRequest().id;
      void requestNative('APP_INFO', {}).catch(() => {});
      const secondId = bridge.readLastRequest().id;

      expect(bridge.postMessage).toHaveBeenCalledTimes(2);
      expect(firstId).not.toBe(secondId);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('timeoutMs 안에 응답이 없으면 TIMEOUT 으로 reject 되고, 늦은 응답은 무시된다', async () => {
    vi.useFakeTimers();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const promise = requestNative('APP_INFO', {}, { timeoutMs: 50 });
    const { id } = bridge.readLastRequest();

    vi.advanceTimersByTime(50);

    await expect(promise).rejects.toMatchObject({ name: 'BridgeError', code: 'TIMEOUT' });

    respondFromNative(id, { platform: 'ios', appVersion: '1.0.0' });
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('앱 환경이 아니면 UNAVAILABLE 로 즉시 reject 되고 postMessage 는 호출되지 않는다', async () => {
    uninstallNativeBridgeStub();

    await expect(requestNative('APP_INFO', {})).rejects.toMatchObject({ code: 'UNAVAILABLE' });
    expect(bridge.postMessage).not.toHaveBeenCalled();
  });

  it('실패 봉투를 받으면 그 code 와 message 를 가진 BridgeError 로 reject 된다', async () => {
    const promise = requestNative('APP_INFO', {});
    const { id } = bridge.readLastRequest();

    failFromNative(id, 'UNSUPPORTED', 'unknown type');

    const error = await promise.catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(BridgeError);
    expect(error).toMatchObject({ code: 'UNSUPPORTED', message: 'unknown type' });
  });

  it('두 요청의 응답이 뒤바뀐 순서로 와도 각자의 id 로 짝지어진다', async () => {
    const first = requestNative('APP_INFO', {});
    const firstId = bridge.readLastRequest().id;
    const second = requestNative('APP_INFO', {});
    const secondId = bridge.readLastRequest().id;

    expect(firstId).not.toBe(secondId);

    respondFromNative(secondId, { platform: 'ios', appVersion: '2' });
    respondFromNative(firstId, { platform: 'ios', appVersion: '1' });

    await expect(first).resolves.toMatchObject({ appVersion: '1' });
    await expect(second).resolves.toMatchObject({ appVersion: '2' });
  });

  it('깨진 JSON · 봉투 아님 · 모르는 id 는 경고만 남기고 대기 중인 요청에 영향을 주지 않는다', async () => {
    vi.useFakeTimers();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const settled = vi.fn();

    const promise = requestNative('APP_INFO', {});
    promise.then(settled, settled);
    const { id } = bridge.readLastRequest();

    dispatchNativeMessage('not json');
    dispatchNativeMessage('{"foo":1}');
    respondFromNative('unknown', {});

    await vi.advanceTimersByTimeAsync(0);

    expect(warn).toHaveBeenCalledTimes(3);
    expect(settled).not.toHaveBeenCalled();

    respondFromNative(id, { platform: 'ios', appVersion: '1.0.0' });
    await expect(promise).resolves.toMatchObject({ platform: 'ios' });
  });
});
