import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';
import { Toaster } from '@/shared/ui/toast';

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

  it('「탈퇴를 확정했어요」를 눌렀을 때 확정됐으면 탈퇴 완료 화면을 보여 준다', async () => {
    server.use(
      http.get('*/api/v1/users', () =>
        HttpResponse.json({ error: 'USER_423', message: 'kakao_1' }, { status: 423 }),
      ),
    );
    await renderWithProviders(WithdrawEmailSentPage, { path: '/withdraw-email-sent' });

    await userEvent.click(screen.getByRole('button', { name: '탈퇴를 확정했어요' }));

    expect(
      await screen.findByRole('heading', { name: '탈퇴가 완료되었어요.' }),
    ).toBeInTheDocument();
  });

  it('「탈퇴를 확정했어요」를 눌렀는데 아직 확정 전이면 안내 토스트를 보여 주고 화면은 그대로 둔다', async () => {
    server.use(http.get('*/api/v1/users', () => HttpResponse.json({ userId: 1 })));
    function PageWithToaster() {
      return (
        <>
          <WithdrawEmailSentPage />
          <Toaster />
        </>
      );
    }
    await renderWithProviders(PageWithToaster, { path: '/withdraw-email-sent' });

    await userEvent.click(screen.getByRole('button', { name: '탈퇴를 확정했어요' }));

    expect(await screen.findByText(/아직 탈퇴가 확정되지 않았어요/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '메일을 보냈어요.' })).toBeInTheDocument();
  });
});
