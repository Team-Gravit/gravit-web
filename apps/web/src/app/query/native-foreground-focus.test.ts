import { focusManager } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { resetBridgeForTest } from '@/shared/api/bridge/request-native';
import { dispatchNativeMessage } from '@/shared/api/mocks/native-bridge';

import { connectNativeForegroundToFocus } from './native-foreground-focus';

afterEach(() => {
  resetBridgeForTest();
});

describe('connectNativeForegroundToFocus', () => {
  it('APP_FOREGROUND 가 오면 Query 에 화면이 다시 보였다고 알리고, 다른 이벤트에는 알리지 않는다', () => {
    const handleFocus = vi.fn();
    const unsubscribeFocus = focusManager.subscribe(handleFocus);
    const disconnect = connectNativeForegroundToFocus();

    dispatchNativeMessage({ kind: 'event', type: 'OTHER', payload: {} });
    expect(handleFocus).not.toHaveBeenCalled();

    dispatchNativeMessage({ kind: 'event', type: 'APP_FOREGROUND', payload: {} });
    expect(handleFocus).toHaveBeenCalledTimes(1);

    disconnect();
    unsubscribeFocus();
  });
});
