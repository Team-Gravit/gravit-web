import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  useParams,
} from '@tanstack/react-router';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { ConceptNotePage } from '@/pages/concept-note';
import { UnitDetailPage } from '@/pages/unit-detail';

const NOTE_URL = '*/api/v1/cs-notes/units/:unitId';
const LESSONS_URL = '*/api/v1/lessons/:unitId';

const UNIT_LESSONS = {
  chapterSummary: { chapterId: 3, title: '자료구조' },
  unitSummaryResponse: { unitId: 7, displayOrder: 1, title: '배열', description: '배열을 배워요.' },
  bookmarkAccessible: true,
  wrongAnsweredNoteAccessible: true,
  unitId: 7,
  lessonSummaries: [],
};

const NOTE_MARKDOWN = '## 배열(Array)\n\n본문 문단';

const LINK_TARGET_PATHS = [
  '/learning',
  '/learning/chapters/$chapterId',
  '/learning/lessons/$lessonId',
  '/learning/units/$unitId/bookmarked-problems',
  '/learning/units/$unitId/incorrect-problems',
];

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

function UnitDetailRoute() {
  const { unitId = '' } = useParams({ strict: false });
  return <UnitDetailPage unitId={unitId} />;
}

function ConceptNoteRoute() {
  const { unitId = '' } = useParams({ strict: false });
  return <ConceptNotePage unitId={unitId} />;
}

function registerNoteHandler(respond: () => Response = () => new HttpResponse(NOTE_MARKDOWN)) {
  const noteRequests: string[] = [];
  server.use(
    http.get(LESSONS_URL, () => HttpResponse.json(UNIT_LESSONS)),
    http.get(NOTE_URL, ({ request }) => {
      noteRequests.push(new URL(request.url).pathname);
      return respond();
    }),
  );
  return noteRequests;
}

async function renderAt(initialPath: string, { isWide = false } = {}) {
  stubViewport(isWide);
  const rootRoute = createRootRoute();
  const router = createRouter({
    routeTree: rootRoute.addChildren([
      createRoute({
        getParentRoute: () => rootRoute,
        path: '/learning/units/$unitId',
        component: UnitDetailRoute,
      }),
      createRoute({
        getParentRoute: () => rootRoute,
        path: '/learning/units/$unitId/concept-note',
        component: ConceptNoteRoute,
      }),
      ...LINK_TARGET_PATHS.map((path) =>
        createRoute({ getParentRoute: () => rootRoute, path, component: () => null }),
      ),
    ]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  await router.load();
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router as never} />
    </QueryClientProvider>,
  );

  return router;
}

describe('개념노트 — 좁은 화면', () => {
  it('유닛 상세의 「개념노트」를 누르면 URL 이 바뀌고 노트를 한 번 요청한다 (AC-1)', async () => {
    const noteRequests = registerNoteHandler();
    const router = await renderAt('/learning/units/7');

    await userEvent.click(await screen.findByRole('link', { name: '개념노트' }));

    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/learning/units/7/concept-note'),
    );
    await screen.findByText('본문 문단');
    expect(noteRequests).toEqual(['/api/v1/cs-notes/units/7']);
  });

  it('제목 막대의 닫기는 유닛 상세를 가리키고, 회색 카드에 챕터 이름과 노트 첫 제목부터 원문을 그린다', async () => {
    registerNoteHandler();
    await renderAt('/learning/units/7/concept-note');

    const card = await screen.findByRole('region', { name: '개념노트' });
    expect(screen.getByRole('link', { name: '닫기' })).toHaveAttribute('href', '/learning/units/7');
    expect(await within(card).findByText('자료구조')).toBeInTheDocument();
    expect(
      await within(card).findByRole('heading', { level: 2, name: '배열(Array)' }),
    ).toBeInTheDocument();
    expect(within(card).getByText('본문 문단')).toBeInTheDocument();
  });
});

describe('개념노트 — 넓은 화면', () => {
  it('유닛 머리 아래 카드에 「개념노트」 제목과 노트 첫 제목을 포함한 원문을 보인다 (AC-6)', async () => {
    registerNoteHandler();
    await renderAt('/learning/units/7/concept-note', { isWide: true });

    const card = await screen.findByRole('region', { name: '개념노트' });
    expect(within(card).getByRole('heading', { name: '개념노트' })).toBeInTheDocument();
    expect(await within(card).findByRole('heading', { name: '배열(Array)' })).toBeInTheDocument();
    expect(within(card).getByText('본문 문단')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 1, name: 'Unit01' })).toBeInTheDocument();
    expect(screen.getByText('배열을 배워요.')).toBeInTheDocument();
  });

  it('노트 요청이 실패하면 실패 문구를 보이고 다시 시도하면 한 번 더 요청한다 (AC-10)', async () => {
    const noteRequests = registerNoteHandler(() => new HttpResponse(null, { status: 500 }));
    await renderAt('/learning/units/7/concept-note', { isWide: true });

    expect(await screen.findByText('개념노트를 불러오지 못했어요.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '다시 시도' }));

    await waitFor(() => expect(noteRequests).toHaveLength(2));
  });

  it('노트가 비어 있으면 빈 노트 문구를 보인다 (AC-11)', async () => {
    registerNoteHandler(() => new HttpResponse(''));
    await renderAt('/learning/units/7/concept-note', { isWide: true });

    expect(await screen.findByText('아직 개념노트가 없어요.')).toBeInTheDocument();
  });
});
