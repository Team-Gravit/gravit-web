import { afterEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  useParams,
} from '@tanstack/react-router';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, delay, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { Toaster } from '@/shared/ui/toast';
import { useUnitLessons } from '@/entities/learning';
import { ReviewQuizPage } from '@/pages/review-quiz';

import type { RouterContext } from '../../__root';
import { createReviewQuizLeaveHandler, parseReviewQuizUnitId } from './-review-quiz-route';

// 로딩 최소 시간은 훅 테스트가 검증한다. 여기서는 화면 흐름만 본다.
vi.mock('@/shared/lib/use-initial-minimum-duration', () => ({
  useInitialMinimumDuration: vi.fn((isActive: boolean) => isActive),
}));

const BOOKMARKS_URL = '*/api/v1/bookmarks/:unitId';
const SUBMISSION_URL = '*/api/v1/problems/results';
const LESSON_SUBMISSION_URL = '*/api/v1/lessons/results';
const BOOKMARK_URL = '*/api/v1/bookmarks';
const UNIT_LESSONS_URL = '*/api/v1/lessons/:unitId';
const WRONG_ANSWERS_URL = '*/api/v1/wrong-answered-notes/:unitId';
const WRONG_ANSWER_URL = '*/api/v1/wrong-answered-notes';

const UNIT_LESSONS = {
  chapterSummary: { chapterId: 3, title: '자료구조' },
  unitSummaryResponse: { unitId: 7, displayOrder: 1, title: '큐', description: '큐를 배워요.' },
  bookmarkAccessible: true,
  wrongAnsweredNoteAccessible: true,
  unitId: 7,
  lessonSummaries: [],
};

function objectiveProblem(problemId: number, isBookmarked = true) {
  return {
    problemId,
    problemType: 'OBJECTIVE',
    instruction: `${problemId}번 발문`,
    content: '선입선출 구조는?',
    isBookmarked,
    options: [
      {
        optionId: problemId * 10,
        content: 'Queue',
        explanation: '먼저 들어온 것이 먼저 나간다',
        isAnswer: true,
        problemId,
      },
      {
        optionId: problemId * 10 + 1,
        content: 'Stack',
        explanation: '나중에 들어온 것이 먼저 나간다',
        isAnswer: false,
        problemId,
      },
    ],
  };
}

const SUBJECTIVE_PROBLEM = {
  problemId: 202,
  problemType: 'SUBJECTIVE',
  instruction: '202번 발문',
  content: '빈칸에 들어갈 자료구조는?',
  isBookmarked: true,
  answerResponse: { contents: ['queue'], explanation: '큐다' },
};

const BOOKMARKED_PROBLEMS = {
  unitSummaryResponse: { unitId: 7, displayOrder: 1, title: '큐', description: '큐를 배워요.' },
  totalProblems: 3,
  problems: [objectiveProblem(201), SUBJECTIVE_PROBLEM, objectiveProblem(203)],
};

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

interface RequestLog {
  bookmarkLists: number;
  wrongAnswerLists: number;
  exclusions: unknown[];
  unitLessons: number;
  submissions: unknown[];
  lessonSubmissions: number;
}

/** 요청 횟수와 본문을 기록하는 기본 핸들러를 등록한다. */
function useHandlers({
  submissionStatus = 200,
  exclusionStatus = 200,
}: { submissionStatus?: number; exclusionStatus?: number } = {}) {
  const requestLog: RequestLog = {
    bookmarkLists: 0,
    wrongAnswerLists: 0,
    exclusions: [],
    unitLessons: 0,
    submissions: [],
    lessonSubmissions: 0,
  };

  server.use(
    http.get(BOOKMARKS_URL, () => {
      requestLog.bookmarkLists += 1;
      return HttpResponse.json(BOOKMARKED_PROBLEMS);
    }),
    http.post(SUBMISSION_URL, async ({ request }) => {
      requestLog.submissions.push(await request.json());
      return new HttpResponse(null, { status: submissionStatus });
    }),
    http.post(LESSON_SUBMISSION_URL, () => {
      requestLog.lessonSubmissions += 1;
      return HttpResponse.json({});
    }),
    http.delete(BOOKMARK_URL, () => new HttpResponse(null, { status: 200 })),
    http.get(WRONG_ANSWERS_URL, () => {
      requestLog.wrongAnswerLists += 1;
      return HttpResponse.json(BOOKMARKED_PROBLEMS);
    }),
    http.delete(WRONG_ANSWER_URL, async ({ request }) => {
      requestLog.exclusions.push(await request.json());
      return new HttpResponse(null, { status: exclusionStatus });
    }),
    http.get(UNIT_LESSONS_URL, () => {
      requestLog.unitLessons += 1;
      return HttpResponse.json(UNIT_LESSONS);
    }),
  );

  return requestLog;
}

/** 유닛 상세 대역. 유닛 상세 조회가 다시 일어나는지만 본다. */
function UnitDetailRoute() {
  const { unitId = '' } = useParams({ strict: false });
  const { data: unitLessons } = useUnitLessons(Number(unitId));

  return <p>{unitLessons ? '유닛 상세' : '유닛 상세 불러오는 중'}</p>;
}

function BookmarkQuizRoute() {
  const { unitId = '' } = useParams({ strict: false });
  return <ReviewQuizPage kind="bookmark" unitId={Number(unitId)} />;
}

function WrongAnswerQuizRoute() {
  const { unitId = '' } = useParams({ strict: false });
  return <ReviewQuizPage kind="wrongAnswer" unitId={Number(unitId)} />;
}

async function renderAt(initialPath: string, { isWide = true } = {}) {
  stubViewport(isWide);
  // 앱과 같은 staleTime 을 둬야 '돌아오면 어차피 다시 받는다'가 무효화를 가리지 않는다.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 60 * 1000 } },
  });
  const rootRoute = createRootRouteWithContext<RouterContext>()();
  const router = createRouter({
    routeTree: rootRoute.addChildren([
      createRoute({
        getParentRoute: () => rootRoute,
        path: '/learning/units/$unitId',
        component: UnitDetailRoute,
      }),
      createRoute({
        getParentRoute: () => rootRoute,
        path: '/learning/units/$unitId/bookmarked-problems',
        beforeLoad: parseReviewQuizUnitId,
        component: BookmarkQuizRoute,
        onLeave: createReviewQuizLeaveHandler('bookmark'),
      }),
      createRoute({
        getParentRoute: () => rootRoute,
        path: '/learning/units/$unitId/incorrect-problems',
        beforeLoad: parseReviewQuizUnitId,
        component: WrongAnswerQuizRoute,
        onLeave: createReviewQuizLeaveHandler('wrongAnswer'),
      }),
    ]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
    context: { queryClient },
  });

  await router.load();
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router as never} />
      <Toaster />
    </QueryClientProvider>,
  );

  return router;
}

async function chooseOption(name: string) {
  await userEvent.click(await screen.findByRole('button', { name: new RegExp(name) }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.sessionStorage.clear();
});

describe('북마크 풀이 — 공통 흐름', () => {
  it('들어오면 북마크 목록을 한 번 받고 1번 문제와 진행률 0/3 을 보인다 (AC-1)', async () => {
    const requestLog = useHandlers();
    await renderAt('/learning/units/7/bookmarked-problems');

    expect(await screen.findByText('201번 발문')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="progress-count"]')).toHaveTextContent('0/3');
    expect(requestLog.bookmarkLists).toBe(1);
  });

  it('객관식 선지를 고르면 selectedOptionId 를 담아 단건 제출을 한 번 보낸다 (AC-2)', async () => {
    const requestLog = useHandlers();
    await renderAt('/learning/units/7/bookmarked-problems');

    await chooseOption('Stack');

    await waitFor(() => expect(requestLog.submissions).toHaveLength(1));
    expect(requestLog.submissions[0]).toEqual({
      problemId: 201,
      isCorrect: false,
      selectedOptionId: 2011,
    });
  });

  it('주관식 답 queue 를 제출하면 submittedContent 를 담아 단건 제출을 보낸다 (AC-3)', async () => {
    const requestLog = useHandlers();
    await renderAt('/learning/units/7/bookmarked-problems');

    await chooseOption('Queue');
    await userEvent.click(await screen.findByRole('button', { name: '다음 문제' }));
    await userEvent.type(await screen.findByRole('textbox', { name: '답 입력' }), 'queue');
    await userEvent.click(screen.getByRole('button', { name: '다음 문제' }));

    await waitFor(() => expect(requestLog.submissions).toHaveLength(2));
    expect(requestLog.submissions[1]).toEqual({
      problemId: 202,
      isCorrect: true,
      submittedContent: 'queue',
    });
  });

  it('제출한 문제로 이전 문제를 눌러 돌아오면 해설이 보이고 단건 제출은 한 번뿐이다 (AC-4)', async () => {
    const requestLog = useHandlers();
    await renderAt('/learning/units/7/bookmarked-problems');

    await chooseOption('Queue');
    await waitFor(() =>
      expect(document.querySelector('[data-slot="option-result-list"]')).not.toBeNull(),
    );
    await userEvent.click(screen.getByRole('button', { name: '다음 문제' }));
    await userEvent.click(await screen.findByRole('button', { name: '이전 문제' }));

    await waitFor(() =>
      expect(document.querySelector('[data-slot="option-result-list"]')).not.toBeNull(),
    );
    expect(requestLog.submissions).toHaveLength(1);
  });

  it('마지막 문제의 완료를 누르면 유닛 상세로 가고 레슨 제출은 보내지 않는다 (AC-5)', async () => {
    const requestLog = useHandlers();
    const router = await renderAt('/learning/units/7/bookmarked-problems');

    await screen.findByText('201번 발문');
    await userEvent.click(screen.getByRole('button', { name: '다음 문제' }));
    await userEvent.click(await screen.findByRole('button', { name: '다음 문제' }));
    await userEvent.click(await screen.findByRole('button', { name: '완료' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/learning/units/7'));
    expect(requestLog.lessonSubmissions).toBe(0);
  });

  it('단건 제출이 실패하면 토스트를 보이고 해설 없이 다시 고를 수 있다 (AC-6)', async () => {
    useHandlers({ submissionStatus: 500 });
    await renderAt('/learning/units/7/bookmarked-problems');

    await chooseOption('Stack');

    expect(
      await screen.findByText('답안을 저장하지 못했어요. 다시 시도해 주세요.'),
    ).toBeInTheDocument();
    expect(document.querySelector('[data-slot="option-result-list"]')).toBeNull();
    expect(screen.getByRole('button', { name: /Queue/ })).toBeEnabled();
    expect(document.querySelector('[data-slot="progress-count"]')).toHaveTextContent('0/3');
  });

  it('단건 제출 응답을 기다리는 동안 해설이 없고 선지를 다시 고를 수 없다 (AC-6-1)', async () => {
    useHandlers();
    server.use(
      http.post(SUBMISSION_URL, async () => {
        await delay('infinite');
        return new HttpResponse(null);
      }),
    );
    await renderAt('/learning/units/7/bookmarked-problems');

    await chooseOption('Stack');

    await waitFor(() => expect(screen.getByRole('button', { name: /Queue/ })).toBeDisabled());
    expect(document.querySelector('[data-slot="option-result-list"]')).toBeNull();
  });

  it('닫기를 누르면 확인 없이 유닛 상세로 간다 (AC-7)', async () => {
    useHandlers();
    const router = await renderAt('/learning/units/7/bookmarked-problems');

    await userEvent.click(await screen.findByRole('link', { name: '풀이 닫기' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/learning/units/7'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('북마크 풀이 — 북마크 해제', () => {
  it('풀이 중 북마크를 해제해도 그 문제는 목록에 남는다 (AC-8)', async () => {
    useHandlers();
    await renderAt('/learning/units/7/bookmarked-problems');

    await userEvent.click(await screen.findByRole('button', { name: '북마크에서 삭제' }));
    await userEvent.click(screen.getByRole('button', { name: '다음 문제' }));
    await userEvent.click(await screen.findByRole('button', { name: '이전 문제' }));

    expect(await screen.findByText('201번 발문')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="progress-count"]')).toHaveTextContent('/3');
  });

  it('풀이를 떠나면 다음 진입 때 북마크 목록을 다시 받는다 (AC-9)', async () => {
    const requestLog = useHandlers();
    const router = await renderAt('/learning/units/7/bookmarked-problems');

    await userEvent.click(await screen.findByRole('button', { name: '북마크에서 삭제' }));
    await userEvent.click(screen.getByRole('link', { name: '풀이 닫기' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/learning/units/7'));

    await router.navigate({
      to: '/learning/units/$unitId/bookmarked-problems',
      params: { unitId: '7' },
    });

    await waitFor(() => expect(requestLog.bookmarkLists).toBe(2));
  });

  it('유닛 상세에서 들어와 북마크를 해제하고 나가면 유닛 상세를 다시 받는다 (AC-9-1)', async () => {
    const requestLog = useHandlers();
    const router = await renderAt('/learning/units/7');

    await screen.findByText('유닛 상세');
    expect(requestLog.unitLessons).toBe(1);

    await router.navigate({
      to: '/learning/units/$unitId/bookmarked-problems',
      params: { unitId: '7' },
    });
    await userEvent.click(await screen.findByRole('button', { name: '북마크에서 삭제' }));
    await screen.findByRole('button', { name: '북마크에 추가' });
    await userEvent.click(screen.getByRole('link', { name: '풀이 닫기' }));

    await screen.findByText('유닛 상세');
    await waitFor(() => expect(requestLog.unitLessons).toBe(2));
  });

  it('정답을 맞혀도 오답노트에서 제외 버튼이 없다 (AC-10)', async () => {
    useHandlers();
    await renderAt('/learning/units/7/bookmarked-problems');

    await chooseOption('Queue');

    await waitFor(() =>
      expect(document.querySelector('[data-slot="option-result-list"]')).not.toBeNull(),
    );
    expect(screen.queryByRole('button', { name: '오답노트에서 제외' })).not.toBeInTheDocument();
  });
});

describe('오답노트 풀이', () => {
  const WRONG_ANSWER_PATH = '/learning/units/7/incorrect-problems';
  const EXCLUDE_BUTTON = { name: '오답노트에서 제외' };

  it('넓은 화면에서 객관식을 맞히면 하단 이전 문제 왼쪽에 제외 버튼이 하나 보인다 (AC-11)', async () => {
    useHandlers();
    await renderAt(WRONG_ANSWER_PATH);

    await chooseOption('Queue');

    const excludeButton = await screen.findByRole('button', EXCLUDE_BUTTON);
    const footer = document.querySelector('[data-slot="quiz-footer"]');
    expect(screen.getAllByRole('button', EXCLUDE_BUTTON)).toHaveLength(1);
    expect(footer).toContainElement(excludeButton);
    expect(footer?.firstElementChild).toBe(excludeButton);
  });

  it('좁은 화면에서 객관식을 맞히면 정답 선지 해설 안에 제외 버튼이 하나 보인다 (AC-11)', async () => {
    useHandlers();
    await renderAt(WRONG_ANSWER_PATH, { isWide: false });

    await chooseOption('Queue');

    const excludeButton = await screen.findByRole('button', EXCLUDE_BUTTON);
    expect(screen.getAllByRole('button', EXCLUDE_BUTTON)).toHaveLength(1);
    expect(document.querySelector('[data-slot="option-result-list"]')).toContainElement(
      excludeButton,
    );
    expect(document.querySelector('[data-slot="quiz-footer"]')).not.toContainElement(excludeButton);
  });

  it('제외를 누르면 problemId 로 한 번 요청하고, 성공하면 토스트와 함께 버튼만 사라진다 (AC-12)', async () => {
    const requestLog = useHandlers();
    await renderAt(WRONG_ANSWER_PATH);

    await chooseOption('Queue');
    await userEvent.click(await screen.findByRole('button', EXCLUDE_BUTTON));

    expect(await screen.findByText('오답노트에서 제외했어요.')).toBeInTheDocument();
    expect(requestLog.exclusions).toEqual([{ problemId: 201 }]);
    expect(screen.queryByRole('button', EXCLUDE_BUTTON)).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="option-result-list"]')).not.toBeNull();
  });

  it('제외한 문제로 다시 돌아와도 버튼이 다시 생기지 않는다 (AC-12)', async () => {
    useHandlers();
    await renderAt(WRONG_ANSWER_PATH);

    await chooseOption('Queue');
    await userEvent.click(await screen.findByRole('button', EXCLUDE_BUTTON));
    await screen.findByText('오답노트에서 제외했어요.');
    await userEvent.click(screen.getByRole('button', { name: '다음 문제' }));
    await userEvent.click(await screen.findByRole('button', { name: '이전 문제' }));

    await waitFor(() =>
      expect(document.querySelector('[data-slot="option-result-list"]')).not.toBeNull(),
    );
    expect(screen.queryByRole('button', EXCLUDE_BUTTON)).not.toBeInTheDocument();
  });

  it('틀리면 제외 버튼이 없다 (AC-13)', async () => {
    useHandlers();
    await renderAt(WRONG_ANSWER_PATH);

    await chooseOption('Stack');

    await waitFor(() =>
      expect(document.querySelector('[data-slot="option-result-list"]')).not.toBeNull(),
    );
    expect(screen.queryByRole('button', EXCLUDE_BUTTON)).not.toBeInTheDocument();
  });

  it('주관식을 맞혀도 제외 버튼이 보인다 (AC-11)', async () => {
    useHandlers();
    await renderAt(WRONG_ANSWER_PATH);

    await chooseOption('Stack');
    await userEvent.click(await screen.findByRole('button', { name: '다음 문제' }));
    await userEvent.type(await screen.findByRole('textbox', { name: '답 입력' }), 'queue');
    await userEvent.click(screen.getByRole('button', { name: '다음 문제' }));

    expect(await screen.findByRole('button', EXCLUDE_BUTTON)).toBeInTheDocument();
  });

  it('제외 요청이 실패하면 토스트를 보이고 버튼이 남아 다시 누를 수 있다 (AC-14)', async () => {
    useHandlers({ exclusionStatus: 500 });
    await renderAt(WRONG_ANSWER_PATH);

    await chooseOption('Queue');
    await userEvent.click(await screen.findByRole('button', EXCLUDE_BUTTON));

    expect(await screen.findByText('오답노트에서 제외하지 못했어요.')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', EXCLUDE_BUTTON)).toBeEnabled());
  });

  it('제외하고 풀이를 떠나면 다음 진입 때 오답 목록과 유닛 상세를 다시 받는다 (AC-15)', async () => {
    const requestLog = useHandlers();
    const router = await renderAt('/learning/units/7');

    await screen.findByText('유닛 상세');
    await router.navigate({
      to: '/learning/units/$unitId/incorrect-problems',
      params: { unitId: '7' },
    });
    await chooseOption('Queue');
    await userEvent.click(await screen.findByRole('button', EXCLUDE_BUTTON));
    await screen.findByText('오답노트에서 제외했어요.');
    await userEvent.click(screen.getByRole('link', { name: '풀이 닫기' }));

    await screen.findByText('유닛 상세');
    await waitFor(() => expect(requestLog.unitLessons).toBe(2));
    await router.navigate({
      to: '/learning/units/$unitId/incorrect-problems',
      params: { unitId: '7' },
    });
    await waitFor(() => expect(requestLog.wrongAnswerLists).toBe(2));
  });
});
