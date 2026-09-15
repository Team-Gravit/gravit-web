import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, screen, waitFor, within } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { useAuthStore } from '@/entities/auth';

import { MainPage } from './main-page';

const PROFILE_URL = '*/api/v1/main-pages/profile';
const LEAGUE_URL = '*/api/v1/main-pages/league';
const USERS_URL = '*/api/v1/users';
const WEEKLY_RECORD_URL = '*/api/v1/main-pages/weekly-record';
const MISSION_URL = '*/api/v1/main-pages/mission';
const LEARNING_URL = '*/api/v1/main-pages/learning';
const UNITS_URL = '*/api/v1/main-pages/units';

const PROFILE = {
  nickname: '땅콩',
  profileImgNumber: 3,
  userLevelDetailResponse: { level: 1, currentXp: 31, maxXp: 99, levelRate: 0.31 },
};
const LEAGUE = { leagueId: 4, leagueName: '실버 3', currentLP: 31, minLP: 0, maxLP: 99 };
const USER = {
  userId: 1,
  nickname: '땅콩',
  profileImgNumber: 3,
  providerId: 'p',
  isOnboarded: true,
};
const WEEKLY_RECORD = {
  consecutiveSolvedDays: 1,
  MONDAY: false,
  TUESDAY: false,
  WEDNESDAY: false,
  THURSDAY: false,
  FRIDAY: false,
  SATURDAY: false,
  SUNDAY: false,
};
const MISSION = {
  missionType: 'COMPLETE_LESSON_ONE',
  missionDescription: '레슨 1개 완료하기',
  awardXp: 5,
  progressRate: 0,
  isCompleted: false,
};
const LEARNING = {
  recentSolvedChapterId: 7,
  recentSolvedChapterTitle: '자료구조',
  recentSolvedChapterProgressRate: 10,
  units: [{ unitId: 11, title: '배열', status: 'IN_PROGRESS' }],
};
const UNITS = [{ unitId: 21, unitTitle: '스택', chapterId: 3, chapterTitle: '자료구조' }];

// 이 테스트가 직접 검증하지 않는 요청도 MSW에서 처리해 미처리 요청 오류를 막는다.
function sectionHandlers() {
  return [
    http.get(WEEKLY_RECORD_URL, () => HttpResponse.json(WEEKLY_RECORD)),
    http.get(MISSION_URL, () => HttpResponse.json(MISSION)),
    http.get(LEARNING_URL, () => HttpResponse.json(LEARNING)),
    http.get(UNITS_URL, () => HttpResponse.json(UNITS)),
  ];
}

// jsdom은 matchMedia를 제공하지 않으므로 넓은 화면 여부를 직접 고정한다.
function stubViewport(isWide: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      media: query,
      matches: isWide,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
}

function useSuccessHandlers() {
  const requestCounts = {
    profile: 0,
    league: 0,
    users: 0,
    weeklyRecord: 0,
    mission: 0,
    learning: 0,
    units: 0,
  };

  server.use(
    http.get(PROFILE_URL, () => {
      requestCounts.profile += 1;
      return HttpResponse.json(PROFILE);
    }),
    http.get(LEAGUE_URL, () => {
      requestCounts.league += 1;
      return HttpResponse.json(LEAGUE);
    }),
    http.get(USERS_URL, () => {
      requestCounts.users += 1;
      return HttpResponse.json(USER);
    }),
    http.get(WEEKLY_RECORD_URL, () => {
      requestCounts.weeklyRecord += 1;
      return HttpResponse.json(WEEKLY_RECORD);
    }),
    http.get(MISSION_URL, () => {
      requestCounts.mission += 1;
      return HttpResponse.json(MISSION);
    }),
    http.get(LEARNING_URL, () => {
      requestCounts.learning += 1;
      return HttpResponse.json(LEARNING);
    }),
    http.get(UNITS_URL, () => {
      requestCounts.units += 1;
      return HttpResponse.json(UNITS);
    }),
  );

  return requestCounts;
}

async function renderMainPage() {
  const rootRoute = createRootRoute();
  const rootRouteChildren = [
    createRoute({ getParentRoute: () => rootRoute, path: '/main', component: MainPage }),
    ...['/', '/learning', '/league', '/my'].map((path) =>
      createRoute({ getParentRoute: () => rootRoute, path, component: () => null }),
    ),
  ];
  const router = createRouter({
    routeTree: rootRoute.addChildren(rootRouteChildren),
    history: createMemoryHistory({ initialEntries: ['/main'] }),
  });
  // 실패 응답 테스트가 React Query의 재시도 대기 때문에 지연되지 않도록 비활성화한다.
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  await router.load();

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router as never} />
    </QueryClientProvider>,
  );

  return { router };
}

beforeEach(() => {
  localStorage.setItem('accessToken', 't1');
  useAuthStore.setState({ accessToken: 't1', isRestored: true });
});

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('MainPage — 넓은 화면', () => {
  beforeEach(() => stubViewport(true));

  it('진입 시 main-pages 6종이 각 1회만 나간다 — learning · profile 중복 없음 (AC-1)', async () => {
    const requestCounts = useSuccessHandlers();
    await renderMainPage();

    // 마지막 섹션까지 렌더링된 뒤 모든 요청 횟수를 확인한다.
    await screen.findByRole('link', { name: '자료구조 학습하러 가기' });
    await screen.findByText('실버 3');
    // 페이지 단위 테스트에는 앱 셸 헤더가 없으므로 users 요청은 발생하지 않는다.
    expect(requestCounts).toEqual({
      profile: 1,
      league: 1,
      users: 0,
      weeklyRecord: 1,
      mission: 1,
      learning: 1,
      units: 1,
    });
  });

  it('닉네임이 오면 「어서오세요, 땅콩님!」과 부제를 보인다 (AC-7)', async () => {
    useSuccessHandlers();
    await renderMainPage();

    expect(await screen.findByText('땅콩님!')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('어서오세요, 땅콩님!');
    expect(screen.getByText('그래빗과 함께 CS 지식을 마스터해요!')).toBeInTheDocument();
  });

  it('profile 조회가 실패하면 「어서오세요, 」만 남고 에러 UI 는 없다 (AC-8)', async () => {
    server.use(
      http.get(PROFILE_URL, () => new HttpResponse(null, { status: 500 })),
      http.get(LEAGUE_URL, () => HttpResponse.json(LEAGUE)),
      http.get(USERS_URL, () => HttpResponse.json(USER)),
      ...sectionHandlers(),
    );
    await renderMainPage();

    const heading = screen.getByRole('heading', { level: 1 });
    // 로딩 자리표시자가 사라진 뒤 최종 문구를 확인한다.
    await waitFor(() => expect(heading.querySelector('[aria-busy="true"]')).toBeNull());
    expect(heading).toHaveTextContent(/^어서오세요,\s*$/);
    // 같은 프로필 오류를 사용하는 성장 현황은 오류 UI를 표시하므로 히어로 범위만 확인한다.
    const hero = document.querySelector('[data-slot="hero-greeting"]');
    expect(hero).not.toBeNull();
    expect(within(hero as HTMLElement).queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('MainPage — 좁은 화면', () => {
  beforeEach(() => stubViewport(false));

  it('히어로 위에 LV · 티어 이름 헤더가 있다 (AC-3)', async () => {
    useSuccessHandlers();
    await renderMainPage();

    expect(await screen.findByText('LV 1')).toBeInTheDocument();
    expect(await screen.findByText('실버 3')).toBeInTheDocument();
    const hero = document.querySelector('[data-slot="hero-greeting"]');
    expect(hero).not.toBeNull();
    expect(within(hero as HTMLElement).getByText('LV 1')).toBeInTheDocument();
  });

  it('좁은 화면은 users · units 를 부르지 않고 learning 은 두 카드가 공유해 1회다 (AC-1 · H1)', async () => {
    const requestCounts = useSuccessHandlers();
    await renderMainPage();

    await screen.findByText('LV 1');
    // 쿼리를 공유하는 두 카드가 모두 렌더링된 뒤 요청 횟수를 확인한다.
    await screen.findByRole('link', { name: '배열 학습하러 가기' });
    await screen.findByRole('link', { name: '1강 이어서 학습하기' });
    expect(requestCounts).toEqual({
      profile: 1,
      league: 1,
      users: 0,
      weeklyRecord: 1,
      mission: 1,
      learning: 1,
      units: 0,
    });
  });
});
