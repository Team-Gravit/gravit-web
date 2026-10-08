import type { PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { useOnboardingForm } from './use-onboarding-form';

const ONBOARDING_ENDPOINT = '*/api/v1/users/onboarding';
const NICKNAME_CHECK_DELAY_MS = 300;

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

function renderOnboardingForm(onSuccess = vi.fn()) {
  const view = renderHook(() => useOnboardingForm({ onSuccess }), { wrapper: createWrapper() });

  return { ...view, onSuccess };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useOnboardingForm', () => {
  it('입력 전에는 안내 상태이고 제출할 수 없다', () => {
    const { result } = renderOnboardingForm();

    expect(result.current.nicknameStatus).toBe('default');
    expect(result.current.canSubmit).toBe(false);
  });

  it('입력 직후에는 판정을 미루고 아무 문구도 보여주지 않는다', () => {
    const { result } = renderOnboardingForm();

    act(() => {
      result.current.setNickname('그래빗');
    });

    expect(result.current.nicknameStatus).toBe('checking');
  });

  it('300ms 가 지나면 규칙에 맞는 닉네임을 사용 가능으로 판정한다', () => {
    const { result } = renderOnboardingForm();

    act(() => {
      result.current.setNickname('그래빗');
    });
    act(() => {
      vi.advanceTimersByTime(NICKNAME_CHECK_DELAY_MS);
    });

    expect(result.current.nicknameStatus).toBe('valid');
    expect(result.current.canSubmit).toBe(true);
  });

  it('300ms 가 지나면 규칙에 어긋난 닉네임을 사용 불가로 판정한다', () => {
    const { result } = renderOnboardingForm();

    act(() => {
      result.current.setNickname('!!!');
    });
    act(() => {
      vi.advanceTimersByTime(NICKNAME_CHECK_DELAY_MS);
    });

    expect(result.current.nicknameStatus).toBe('invalid');
    expect(result.current.canSubmit).toBe(false);
  });

  it('값을 지우면 다시 안내 상태로 돌아간다', () => {
    const { result } = renderOnboardingForm();

    act(() => {
      result.current.setNickname('그래빗');
    });
    act(() => {
      vi.advanceTimersByTime(NICKNAME_CHECK_DELAY_MS);
    });
    act(() => {
      result.current.setNickname('');
    });

    expect(result.current.nicknameStatus).toBe('default');
  });

  it('색만 바꾸고 닉네임을 넣지 않으면 제출할 수 없다', () => {
    const { result } = renderOnboardingForm();

    act(() => {
      result.current.setColorNumber(5);
    });

    expect(result.current.colorNumber).toBe(5);
    expect(result.current.canSubmit).toBe(false);
  });

  it('첫 색을 그대로 두고 제출하면 profilePhotoNumber 로 1을 보낸다', async () => {
    let requestBody: unknown = null;
    server.use(
      http.post(ONBOARDING_ENDPOINT, async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json({ userId: 1, isOnboarded: true });
      }),
    );

    const { result } = renderOnboardingForm();

    act(() => {
      result.current.setNickname('  그래빗  ');
    });
    act(() => {
      vi.advanceTimersByTime(NICKNAME_CHECK_DELAY_MS);
    });

    // 공백이 포함된 값은 검증을 통과하지 못한다.
    expect(result.current.canSubmit).toBe(false);

    act(() => {
      result.current.setNickname('그래빗');
    });
    act(() => {
      vi.advanceTimersByTime(NICKNAME_CHECK_DELAY_MS);
    });

    // API 응답은 실제 타이머로 기다린다.
    vi.useRealTimers();

    act(() => {
      result.current.submit();
    });

    await waitFor(() => {
      expect(requestBody).toEqual({ nickname: '그래빗', profilePhotoNumber: 1 });
    });
  });

  it('제출에 성공하면 onSuccess 를 한 번 호출한다', async () => {
    let requestCount = 0;
    server.use(
      http.post(ONBOARDING_ENDPOINT, () => {
        requestCount += 1;
        return HttpResponse.json({ userId: 1, isOnboarded: true });
      }),
    );

    const { result, onSuccess } = renderOnboardingForm();

    act(() => {
      result.current.setNickname('그래빗');
    });
    act(() => {
      vi.advanceTimersByTime(NICKNAME_CHECK_DELAY_MS);
    });

    vi.useRealTimers();

    act(() => {
      result.current.submit();
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
    expect(requestCount).toBe(1);
  });
});
