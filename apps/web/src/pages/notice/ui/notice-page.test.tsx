import { waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { NoticePage } from './notice-page';

describe('NoticePage', () => {
  it('총 페이지 수를 넘는 page면 공지 목록 첫 페이지로 이동한다 (NOTC-04)', async () => {
    server.use(
      http.get('*/api/v1/notice/summaries/99', () =>
        HttpResponse.json({ contents: [], totalPages: 3 }),
      ),
    );

    const { router } = await renderWithProviders(
      () => <NoticePage page={99} onPageChange={() => {}} />,
      { extraPaths: ['/settings/notice'] },
    );

    await waitFor(() => expect(router.state.location.pathname).toBe('/settings/notice'));
    expect(router.state.location.search).toEqual({ page: 1 });
  });
});
