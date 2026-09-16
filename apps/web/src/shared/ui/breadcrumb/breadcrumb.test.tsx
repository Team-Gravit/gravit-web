import { describe, expect, it } from 'vitest';

import { screen } from '@testing-library/react';

import { renderWithProviders } from '@/shared/lib/testing';

import { Breadcrumb } from './breadcrumb';

describe('Breadcrumb', () => {
  it('link가 있는 항목만 링크로 표시한다', async () => {
    await renderWithProviders(
      () => (
        <Breadcrumb
          items={[
            { label: '홈', link: { to: '/main' } },
            { label: '자료구조', link: { to: '/learning' } },
            { label: 'Unit01' },
          ]}
        />
      ),
      { extraPaths: ['/main', '/learning'] },
    );

    expect(screen.getByRole('link', { name: '홈' })).toHaveAttribute('href', '/main');
    expect(screen.getByRole('link', { name: '자료구조' })).toHaveAttribute('href', '/learning');
    expect(screen.queryByRole('link', { name: 'Unit01' })).not.toBeInTheDocument();
  });

  it('link가 없는 항목을 현재 위치로 알린다', async () => {
    await renderWithProviders(
      () => <Breadcrumb items={[{ label: '홈', link: { to: '/main' } }, { label: '자료구조' }]} />,
      { extraPaths: ['/main'] },
    );

    expect(screen.getByText('자료구조')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '홈' })).not.toHaveAttribute('aria-current');
  });

  it('탐색 영역에 「현재 위치」라는 이름을 준다', async () => {
    await renderWithProviders(() => <Breadcrumb items={[{ label: '자료구조' }]} />);

    expect(screen.getByRole('navigation', { name: '현재 위치' })).toBeInTheDocument();
  });
});
