import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { WithdrawEmailSentPage } from './withdraw-email-sent';

beforeEach(() => {
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
  server.use(http.post('*/api/v1/auth/logout', () => new HttpResponse(null, { status: 204 })));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('WithdrawEmailSentPage', () => {
  it('메일에서 탈퇴를 확정하고 돌아오면 탈퇴 완료 화면과 로그인 화면으로 가는 확인 링크를 보여 준다', async () => {
    server.use(
      http.get('*/api/v1/users', () =>
        HttpResponse.json({ error: 'USER_423', message: 'kakao_1' }, { status: 423 }),
      ),
    );
    await renderWithProviders(WithdrawEmailSentPage, { path: '/withdraw-email-sent' });

    expect(screen.getByRole('heading', { name: '메일을 보냈어요.' })).toBeInTheDocument();

    document.dispatchEvent(new Event('visibilitychange'));

    expect(
      await screen.findByRole('heading', { name: '탈퇴가 완료되었어요.' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '확인' })).toHaveAttribute('href', '/');
  });
});
