import type { PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { useProfileEditForm } from './use-profile-edit-form';

const UPDATE_ENDPOINT = '*/api/v1/users';
const NICKNAME_CHECK_DELAY_MS = 300;

const INITIAL = { initialNickname: '한준서', initialColorNumber: 3 };

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

function renderProfileEditForm(onSuccess = vi.fn()) {
  const view = renderHook(() => useProfileEditForm({ ...INITIAL, onSuccess }), {
    wrapper: createWrapper(),
  });

  return { ...view, onSuccess };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useProfileEditForm', () => {
  it('아무것도 바꾸지 않으면 닉네임은 안내 상태이고 제출할 수 없다', () => {
    const { result } = renderProfileEditForm();

    expect(result.current.nicknameStatus).toBe('default');
    expect(result.current.canSubmit).toBe(false);
  });

  it('색상만 바꿔도 제출할 수 있다', () => {
    const { result } = renderProfileEditForm();

    act(() => {
      result.current.setColorNumber(4);
    });

    expect(result.current.canSubmit).toBe(true);
  });

  it('닉네임을 규칙에 어긋나게만 바꾸면 제출할 수 없다', () => {
    const { result } = renderProfileEditForm();

    act(() => {
      result.current.setNickname('한');
    });
    act(() => {
      vi.advanceTimersByTime(NICKNAME_CHECK_DELAY_MS);
    });

    expect(result.current.nicknameStatus).toBe('invalid');
    expect(result.current.canSubmit).toBe(false);
  });

  it('색상을 바꿔도 닉네임을 무효로 바꾸면 제출할 수 없다', () => {
    const { result } = renderProfileEditForm();

    act(() => {
      result.current.setColorNumber(4);
      result.current.setNickname('한');
    });
    act(() => {
      vi.advanceTimersByTime(NICKNAME_CHECK_DELAY_MS);
    });

    expect(result.current.canSubmit).toBe(false);
  });

  it('닉네임과 색상을 바꿔 제출하면 profilePhotoNumber 로 바뀐 색 번호를 보낸다', async () => {
    let requestBody: unknown = null;
    server.use(
      http.patch(UPDATE_ENDPOINT, async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json({ userId: 1, nickname: '그래빗', profileImgNumber: 5 });
      }),
    );

    const { result } = renderProfileEditForm();

    act(() => {
      result.current.setNickname('그래빗');
      result.current.setColorNumber(5);
    });
    act(() => {
      vi.advanceTimersByTime(NICKNAME_CHECK_DELAY_MS);
    });

    expect(result.current.canSubmit).toBe(true);

    vi.useRealTimers();

    act(() => {
      result.current.submit();
    });

    await waitFor(() => {
      expect(requestBody).toEqual({ nickname: '그래빗', profilePhotoNumber: 5 });
    });
  });

  it('제출에 성공하면 onSuccess 를 한 번 호출한다', async () => {
    server.use(
      http.patch(UPDATE_ENDPOINT, () =>
        HttpResponse.json({ userId: 1, nickname: '한준서', profileImgNumber: 7 }),
      ),
    );

    const { result, onSuccess } = renderProfileEditForm();

    act(() => {
      result.current.setColorNumber(7);
    });

    vi.useRealTimers();

    act(() => {
      result.current.submit();
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
