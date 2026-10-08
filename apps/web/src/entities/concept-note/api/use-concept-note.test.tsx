import type { PropsWithChildren } from 'react';
import { describe, expect, it } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { useConceptNote } from './use-concept-note';

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useConceptNote', () => {
  it('text/markdown 응답을 제목과 본문으로 나눈다', async () => {
    const requestedUrls: string[] = [];
    server.use(
      http.get('*/api/v1/cs-notes/units/:unitId', ({ request }) => {
        requestedUrls.push(new URL(request.url).pathname);
        return new HttpResponse('## 배열(Array)\n\n본문', {
          headers: { 'Content-Type': 'text/markdown' },
        });
      }),
    );

    const { result } = renderHook(() => useConceptNote(7), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      title: '배열(Array)',
      body: '\n본문',
      markdown: '## 배열(Array)\n\n본문',
    });
    expect(requestedUrls).toEqual(['/api/v1/cs-notes/units/7']);
  });
});
