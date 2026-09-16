import { describe, expect, it } from 'vitest';

import { screen } from '@testing-library/react';

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

  it('backTo가 없으면 링크를 표시하지 않는다', async () => {
    await renderWithProviders(() => <PageTitleBar title="학습" />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '학습' })).toBeInTheDocument();
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
