import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';
import { useAuthStore } from '@/entities/auth';

import { Header } from './header';

const USERS_URL = '*/api/v1/users';
const USER = {
  userId: 1,
  nickname: '땅콩',
  profileImgNumber: 3,
  providerId: 'p',
  isOnboarded: true,
};

const NAV_PATHS = ['/', '/learning', '/league', '/my'];

function renderHeader() {
  return renderWithProviders(Header, { path: '/main', extraPaths: NAV_PATHS });
}

beforeEach(() => {
  localStorage.setItem('accessToken', 't1');
  useAuthStore.setState({ accessToken: 't1', isRestored: true });
  server.use(http.get(USERS_URL, () => HttpResponse.json(USER)));
});

afterEach(() => {
  localStorage.clear();
});

describe('Header', () => {
  it('로고 · 네비 4개 · 로그아웃이 있다 (AC-2)', async () => {
    await renderHeader();

    const nav = await screen.findByRole('navigation', { name: '주요 메뉴' });
    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(['/main', '/learning', '/league', '/my']);
    expect(screen.getByRole('img', { name: 'Gravit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });

  it('/main 에서는 「홈」만 aria-current="page" 다 (AC-4)', async () => {
    await renderHeader();

    const nav = await screen.findByRole('navigation', { name: '주요 메뉴' });
    const currentLinks = within(nav)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('aria-current') === 'page');
    expect(currentLinks.map((link) => link.textContent)).toEqual(['홈']);
  });

  it('users 조회가 실패해도 「로그아웃」 버튼은 있다 (AC-5)', async () => {
    server.use(http.get(USERS_URL, () => new HttpResponse(null, { status: 500 })));
    await renderHeader();

    expect(await screen.findByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });

  it('「로그아웃」을 누르면 세션이 지워지고 / 로 이동한다 (AC-6)', async () => {
    const { router } = await renderHeader();

    await userEvent.click(await screen.findByRole('button', { name: '로그아웃' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});
