import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useRefetchActiveQueries } from './use-refetch-active-queries';

function renderWithQuery(queryFn: () => Promise<string>) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(
    () => {
      const query = useQuery({ queryKey: ['active'], queryFn });
      return { query, refetchActiveQueries: useRefetchActiveQueries() };
    },
    { wrapper },
  );
}

describe('useRefetchActiveQueries', () => {
  it('화면에 붙은 쿼리를 다시 요청한다', async () => {
    const queryFn = vi.fn(() => Promise.resolve('목록'));
    const { result } = renderWithQuery(queryFn);
    await waitFor(() => expect(result.current.query.isSuccess).toBe(true));

    await result.current.refetchActiveQueries();

    expect(queryFn).toHaveBeenCalledTimes(2);
  });

  it('다시 요청한 쿼리가 실패하면 거부한다', async () => {
    const queryFn = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce('목록')
      .mockRejectedValueOnce(new Error('network'));
    const { result } = renderWithQuery(queryFn);
    await waitFor(() => expect(result.current.query.isSuccess).toBe(true));

    await expect(result.current.refetchActiveQueries()).rejects.toThrow('network');
  });
});
