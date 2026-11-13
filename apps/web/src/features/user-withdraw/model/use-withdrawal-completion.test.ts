import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { useWithdrawalCompletion } from './use-withdrawal-completion';

const USERS_URL = '*/api/v1/users';

function returnToScreen() {
  document.dispatchEvent(new Event('visibilitychange'));
}

beforeEach(() => {
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
});

afterEach(() => {
  vi.restoreAllMocks();
});

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
});
