import { waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';
import { toast } from '@/shared/ui/toast';

import { NoticeDetailPage } from './notice-detail-page';

// 리다이렉트로 페이지가 언마운트되면 Toaster 도 사라져 DOM 단언에 레이스가 생긴다.
// 토스트는 호출 자체를 모킹으로 검증한다.
vi.mock('@/shared/ui/toast', () => ({ toast: vi.fn(), Toaster: () => null }));

const NOTICE_URL = '*/api/v1/notice/999';

describe('NoticeDetailPage', () => {
  it('없는 공지(NOTICE_4041)면 안내 토스트를 띄우고 공지 목록으로 이동한다', async () => {
    server.use(
      http.get(NOTICE_URL, () =>
        HttpResponse.json(
          { error: 'NOTICE_4041', message: '존재하지 않는 공지입니다.' },
          { status: 404 },
        ),
      ),
    );

    const { router } = await renderWithProviders(() => <NoticeDetailPage noticeId={999} />, {
      extraPaths: ['/settings/notice'],
    });

    await waitFor(() => expect(router.state.location.pathname).toBe('/settings/notice'));
    expect(toast).toHaveBeenCalledWith('존재하지 않는 공지입니다.');
  });
});
