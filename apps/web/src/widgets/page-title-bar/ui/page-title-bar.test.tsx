import { describe, expect, it, vi } from 'vitest';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@/shared/lib/testing';

import { PageTitleBar } from './page-title-bar';

describe('PageTitleBar', () => {
  it('backTo를 넘기면 해당 경로로 가는 「뒤로 가기」 링크를 표시한다', async () => {
    await renderWithProviders(
      () => <PageTitleBar title="자료구조" backTo={{ to: '/learning' }} />,
      {
        extraPaths: ['/learning'],
      },
    );

    expect(screen.getByRole('link', { name: '뒤로 가기' })).toHaveAttribute('href', '/learning');
  });

  it('앱 안에 이전 화면이 있으면 「뒤로 가기」가 backTo 대신 이전 화면으로 돌아간다', async () => {
    const user = userEvent.setup();
    const { router } = await renderWithProviders(
      () => <PageTitleBar title="알림" backTo={{ to: '/my' }} />,
      { path: '/notifications', extraPaths: ['/main', '/my'] },
    );
    await router.navigate({ to: '/main' });
    await router.navigate({ to: '/notifications' });

    await user.click(await screen.findByRole('link', { name: '뒤로 가기' }));

    await vi.waitFor(() => expect(router.state.location.pathname).toBe('/main'));
  });

  it('이전 화면이 없으면(직접 진입) 「뒤로 가기」가 backTo 로 이동한다', async () => {
    const user = userEvent.setup();
    const { router } = await renderWithProviders(
      () => <PageTitleBar title="알림" backTo={{ to: '/my' }} />,
      { path: '/notifications', extraPaths: ['/my'] },
    );

    await user.click(screen.getByRole('link', { name: '뒤로 가기' }));

    await vi.waitFor(() => expect(router.state.location.pathname).toBe('/my'));
  });

  it('backTo가 없으면 링크를 표시하지 않는다', async () => {
    await renderWithProviders(() => <PageTitleBar title="학습" />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '학습' })).toBeInTheDocument();
  });

  it('backIcon이 close이면 탐색 링크를 「닫기」로 알린다', async () => {
    await renderWithProviders(
      () => <PageTitleBar title="개념노트" backTo={{ to: '/learning' }} backIcon="close" />,
      { extraPaths: ['/learning'] },
    );

    expect(screen.getByRole('link', { name: '닫기' })).toHaveAttribute('href', '/learning');
    expect(screen.queryByRole('link', { name: '뒤로 가기' })).not.toBeInTheDocument();
  });

  it('backTo와 rightSlot을 함께 넘기면 두 액션을 모두 표시한다', async () => {
    await renderWithProviders(
      () => (
        <PageTitleBar
          title="자료구조"
          backTo={{ to: '/learning' }}
          rightSlot={<button type="button">알림</button>}
        />
      ),
      { extraPaths: ['/learning'] },
    );

    expect(screen.getByRole('link', { name: '뒤로 가기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '알림' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '자료구조' })).toBeInTheDocument();
  });
});
