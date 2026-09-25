import type { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { useSubmitLesson } from './use-submit-lesson';

const SUBMIT_URL = '*/api/v1/lessons/results';
const RESULT_URL = '*/api/v1/lessons/results/345';

function createWrapper() {
  const queryClient = new QueryClient();

  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useSubmitLesson', () => {
  it('onSuccess가 비동기 작업을 반환하면 끝날 때까지 isPending을 유지한다', async () => {
    server.use(
      http.post(SUBMIT_URL, () =>
        HttpResponse.json({ lessonSubmissionId: 345, isLevelUp: false, isLeaguePromoted: false }),
      ),
      http.get(RESULT_URL, () => HttpResponse.json({})),
    );

    let finishNavigation!: () => void;
    const navigationFinished = new Promise<void>((resolve) => {
      finishNavigation = resolve;
    });
    const onSuccess = vi.fn(() => navigationFinished);
    const { result } = renderHook(() => useSubmitLesson({ onSuccess }), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.submit({
        lessonId: 7,
        problems: [],
        answersByProblemId: {},
        learningTime: 10,
      });
    });

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(result.current.isPending).toBe(true);

    await act(async () => {
      finishNavigation();
      await navigationFinished;
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
  });
});
