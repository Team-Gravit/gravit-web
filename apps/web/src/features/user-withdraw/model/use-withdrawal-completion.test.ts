import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import { dispatchNativeMessage } from '@/shared/api/mocks/native-bridge';
import { server } from '@/shared/api/mocks/server';
import { resetBridgeForTest } from '@/shared/api/bridge';

import { useWithdrawalCompletion } from './use-withdrawal-completion';

const USERS_URL = '*/api/v1/users';

function returnToScreen() {
  document.dispatchEvent(new Event('visibilitychange'));
}

beforeEach(() => {
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
});

afterEach(() => {
  resetBridgeForTest();
  vi.restoreAllMocks();
});

function returnToApp() {
  dispatchNativeMessage({ kind: 'event', type: 'APP_FOREGROUND', payload: {} });
}

function respondWithdrawn() {
  return HttpResponse.json({ error: 'USER_423', message: 'kakao_1' }, { status: 423 });
}

describe('useWithdrawalCompletion', () => {
  it('화면으로 돌아왔을 때 사용자 조회가 USER_423 이면 onWithdrawn 을 호출한다', async () => {
    server.use(
      http.get(USERS_URL, () =>
        HttpResponse.json({ error: 'USER_423', message: 'kakao_1' }, { status: 423 }),
      ),
    );
    const onWithdrawn = vi.fn();
    renderHook(() => useWithdrawalCompletion({ onWithdrawn }));

    returnToScreen();

    await vi.waitFor(() => expect(onWithdrawn).toHaveBeenCalledTimes(1));
  });

  it('사용자 조회가 성공하면(아직 확정 전) onWithdrawn 을 호출하지 않는다', async () => {
    const requested = vi.fn();
    server.use(
      http.get(USERS_URL, () => {
        requested();
        return HttpResponse.json({ userId: 1, nickname: '땅콩' });
      }),
    );
    const onWithdrawn = vi.fn();
    renderHook(() => useWithdrawalCompletion({ onWithdrawn }));

    returnToScreen();

    await vi.waitFor(() => expect(requested).toHaveBeenCalled());
    expect(onWithdrawn).not.toHaveBeenCalled();
  });

  it('화면이 숨겨질 때는 확인하지 않는다', async () => {
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    const requested = vi.fn();
    server.use(
      http.get(USERS_URL, () => {
        requested();
        return HttpResponse.json({ userId: 1 });
      }),
    );
    renderHook(() => useWithdrawalCompletion({ onWithdrawn: vi.fn() }));

    returnToScreen();

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(requested).not.toHaveBeenCalled();
  });

  it('앱이 APP_FOREGROUND 를 보내면 visibilitychange 없이도 확인한다', async () => {
    server.use(http.get(USERS_URL, respondWithdrawn));
    const onWithdrawn = vi.fn();
    renderHook(() => useWithdrawalCompletion({ onWithdrawn }));

    returnToApp();

    await vi.waitFor(() => expect(onWithdrawn).toHaveBeenCalledTimes(1));
  });

  it('두 복귀 신호가 함께 와도 확인 요청은 한 번만 보낸다', async () => {
    const requested = vi.fn();
    server.use(
      http.get(USERS_URL, () => {
        requested();
        return respondWithdrawn();
      }),
    );
    const onWithdrawn = vi.fn();
    renderHook(() => useWithdrawalCompletion({ onWithdrawn }));

    returnToScreen();
    returnToApp();

    await vi.waitFor(() => expect(onWithdrawn).toHaveBeenCalledTimes(1));
    expect(requested).toHaveBeenCalledTimes(1);
  });

  it('checkNow 는 확인 결과를 돌려준다 — 확정 전이면 active, 판단할 수 없으면 unknown', async () => {
    server.use(http.get(USERS_URL, () => HttpResponse.json({ userId: 1 })));
    const { result } = renderHook(() => useWithdrawalCompletion({ onWithdrawn: vi.fn() }));

    let checked: string | undefined;
    await act(async () => {
      checked = await result.current.checkNow();
    });
    expect(checked).toBe('active');

    server.use(http.get(USERS_URL, () => HttpResponse.error()));
    await act(async () => {
      checked = await result.current.checkNow();
    });
    expect(checked).toBe('unknown');
  });
});
