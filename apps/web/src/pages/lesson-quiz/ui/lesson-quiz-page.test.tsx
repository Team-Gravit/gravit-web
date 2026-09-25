import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';
import { useInitialMinimumDuration } from '@/shared/lib/use-initial-minimum-duration';
import { Toaster } from '@/shared/ui/toast';
import { clearStoredQuizSession } from '@/features/lesson-quiz';

import { LessonQuizPage } from './lesson-quiz-page';

// 시간 흐름은 훅 테스트에서 검증하고, 여기서는 페이지와 훅의 연결만 확인한다.
vi.mock('@/shared/lib/use-initial-minimum-duration', () => ({
  useInitialMinimumDuration: vi.fn((isActive: boolean) => isActive),
}));

const PROBLEMS_URL = '*/api/v1/problems/:lessonId';
const MINIMUM_LOADING_DURATION_MS = 2500;
const EXTRA_PATHS = ['/learning/units/$unitId'];

const LESSON_PROBLEMS = {
  unitSummaryResponse: {
    unitId: 3,
    displayOrder: 1,
    title: '연결리스트',
    description: '연결리스트를 학습합니다.',
  },
  totalProblems: 1,
  problems: [
    {
      problemId: 101,
      problemType: 'OBJECTIVE',
      instruction: '다음 중 옳은 것은?',
      content: '연결리스트 맨 앞 삽입의 시간복잡도는?',
      isBookmarked: false,
      options: [
        {
          optionId: 10,
          content: 'O(1)',
          explanation: '포인터만 바꾼다',
          isAnswer: true,
          problemId: 101,
        },
        {
          optionId: 11,
          content: 'O(n)',
          explanation: '탐색이 필요할 때다',
          isAnswer: false,
          problemId: 101,
        },
      ],
    },
  ],
};

// 기본은 넓은 화면으로 두고 반응형 동작을 검증하는 테스트에서만 값을 바꾼다.
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

async function renderLessonQuiz({ isWide = true, extraPaths = EXTRA_PATHS } = {}) {
  stubViewport(isWide);
  // 앱에서는 main.tsx가 렌더링하는 Toaster를 테스트 트리에 추가한다.
  const Target = () => (
    <>
      <LessonQuizPage lessonId={7} />
      <Toaster />
    </>
  );

  return renderWithProviders(Target, { extraPaths });
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  window.sessionStorage.clear();
});

describe('LessonQuizPage', () => {
  it('응답을 기다리는 동안 로딩중... 만 보이고 발문은 없다', async () => {
    server.use(http.get(PROBLEMS_URL, () => new Promise(() => {})));
    await renderLessonQuiz();

    expect(await screen.findByText('로딩중...')).toBeInTheDocument();
    expect(screen.queryByText('다음 중 옳은 것은?')).not.toBeInTheDocument();
  });

  it('응답이 도착하면 유닛 표기와 문제 번호·발문·본문을 보여준다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(LESSON_PROBLEMS)));
    await renderLessonQuiz();

    expect(await screen.findByRole('heading', { name: 'Unit01 - 연결리스트' })).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('다음 중 옳은 것은?')).toBeInTheDocument();
    expect(screen.getByText('연결리스트 맨 앞 삽입의 시간복잡도는?')).toBeInTheDocument();
  });

  it('7초가 지나면 타이머가 00:07이 된다', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(LESSON_PROBLEMS)));
    await renderLessonQuiz();

    const timer = await screen.findByRole('timer', { name: '경과 시간' });
    expect(timer).toHaveTextContent('00:00');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(7000);
    });

    expect(timer).toHaveTextContent('00:07');
  });

  it('65초가 지나면 타이머가 01:05가 된다', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(LESSON_PROBLEMS)));
    await renderLessonQuiz();

    const timer = await screen.findByRole('timer', { name: '경과 시간' });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(65_000);
    });

    expect(timer).toHaveTextContent('01:05');
  });

  it('닫기 링크가 응답의 unitId로 유닛 상세를 가리킨다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(LESSON_PROBLEMS)));
    await renderLessonQuiz();

    expect(await screen.findByRole('link', { name: '풀이 닫기' })).toHaveAttribute(
      'href',
      '/learning/units/3',
    );
  });

  it('닫기는 기록을 남기지 않아 뒤로가기해도 풀이 화면으로 돌아오지 않는다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(LESSON_PROBLEMS)));
    const { router } = await renderLessonQuiz();

    await userEvent.click(await screen.findByRole('link', { name: '풀이 닫기' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/learning/units/3'));

    router.history.back();

    // 테스트에서 풀이 화면은 `/`에 마운트된다. replace라 해당 기록으로 돌아가지 않는다.
    await waitFor(() => expect(router.state.location.pathname).not.toBe('/'));
  });

  it('초기 로딩 상태와 최소 표시 시간을 훅에 전달한다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(LESSON_PROBLEMS)));
    await renderLessonQuiz();

    expect(useInitialMinimumDuration).toHaveBeenCalledWith(true, MINIMUM_LOADING_DURATION_MS);
  });

  it('조회가 실패하면 문구와 다시 시도 버튼을 보여준다', async () => {
    server.use(http.get(PROBLEMS_URL, () => new HttpResponse(null, { status: 500 })));
    await renderLessonQuiz();

    expect(await screen.findByText('문제를 불러오지 못했어요.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
  });
});

const SUBJECTIVE_PROBLEMS = {
  ...LESSON_PROBLEMS,
  problems: [
    {
      problemId: 102,
      problemType: 'SUBJECTIVE',
      instruction: '빈칸을 채우세요.',
      content: '그래프를 깊이 우선으로 순회하는 알고리즘은?',
      isBookmarked: false,
      answerResponse: { contents: ['DFS'], explanation: '깊이를 우선한다' },
    },
  ],
};

const CONSECUTIVE_SUBJECTIVE_PROBLEMS = {
  ...SUBJECTIVE_PROBLEMS,
  totalProblems: 2,
  problems: [
    ...SUBJECTIVE_PROBLEMS.problems,
    {
      problemId: 103,
      problemType: 'SUBJECTIVE',
      instruction: '빈칸을 채우세요.',
      content: '그래프를 너비 우선으로 순회하는 알고리즘은?',
      isBookmarked: false,
      answerResponse: { contents: ['BFS'], explanation: '너비를 우선한다' },
    },
  ],
};

describe('LessonQuizPage 주관식 풀이', () => {
  async function renderAndAnswer(input: string) {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(SUBJECTIVE_PROBLEMS)));
    const view = await renderLessonQuiz();

    const field = await screen.findByRole('textbox', { name: '답 입력' });

    if (input) {
      await userEvent.type(field, input);
    }

    await userEvent.click(screen.getByRole('button', { name: '다음 문제' }));

    return view;
  }

  it('틀린 답을 제출하면 정답과 해설을 보여준다', async () => {
    await renderAndAnswer('BFS');

    expect(screen.getByText('❌ 정답: DFS')).toBeInTheDocument();
    expect(screen.getByText('깊이를 우선한다')).toBeInTheDocument();
  });

  it('대소문자만 다른 답을 제출하면 정답으로 본다', async () => {
    await renderAndAnswer('dfs');

    expect(screen.getByText('👏🏻 정답입니다!')).toBeInTheDocument();
    expect(screen.queryByText('❌ 정답: DFS')).not.toBeInTheDocument();
  });

  it('빈 입력에서 다음 문제를 누르면 답을 기록하지 않고 다음 문제로 이동한다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(CONSECUTIVE_SUBJECTIVE_PROBLEMS)));
    await renderLessonQuiz();

    await userEvent.click(await screen.findByRole('button', { name: '다음 문제' }));

    expect(screen.getByRole('textbox', { name: '답 입력' })).toBeInTheDocument();
    expect(screen.getByText('그래프를 너비 우선으로 순회하는 알고리즘은?')).toBeInTheDocument();
    expect(screen.queryByText('❌ 정답: DFS')).not.toBeInTheDocument();
    expect(screen.queryByText('👏🏻 정답입니다!')).not.toBeInTheDocument();
  });

  it('제출한 답은 읽기 전용으로 남는다', async () => {
    await renderAndAnswer('BFS');

    expect(screen.getByRole('textbox', { name: '제출한 답' })).toHaveAttribute('readonly');
  });

  it('주관식이 연속되어도 이전 문제의 입력을 다음 문제에 남기지 않는다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(CONSECUTIVE_SUBJECTIVE_PROBLEMS)));
    await renderLessonQuiz();

    await userEvent.type(await screen.findByRole('textbox', { name: '답 입력' }), 'DFS');
    await userEvent.click(screen.getByRole('button', { name: '다음 문제' }));
    await userEvent.click(screen.getByRole('button', { name: '다음 문제' }));

    expect(screen.getByRole('textbox', { name: '답 입력' })).toHaveValue('');
  });
});

describe('LessonQuizPage 객관식 풀이', () => {
  async function renderAndSubmit(optionName: RegExp) {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(LESSON_PROBLEMS)));
    const view = await renderLessonQuiz();

    await userEvent.click(await screen.findByRole('button', { name: optionName }));

    return view;
  }

  it('선지를 한 번 클릭하면 확인 없이 채점된다', async () => {
    await renderAndSubmit(/O\(n\)/);

    expect(screen.getByText('❌ 오답입니다!')).toBeInTheDocument();
  });

  it('오답을 고르면 정답 선지만 열리고 고른 오답의 해설은 보이지 않는다', async () => {
    await renderAndSubmit(/O\(n\)/);

    expect(screen.getByText('포인터만 바꾼다')).toBeInTheDocument();
    expect(screen.queryByText('탐색이 필요할 때다')).not.toBeInTheDocument();
  });

  it('오답을 고르면 고른 오답과 정답에 모두 색 표식이 붙는다', async () => {
    const { container } = await renderAndSubmit(/O\(n\)/);

    expect(container.querySelectorAll('[data-result="incorrect"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-result="correct"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-result="neutral"]')).toHaveLength(0);
  });

  it('정답을 고르면 정답 표식 하나만 붙고 오답 표식은 없다', async () => {
    const { container } = await renderAndSubmit(/O\(1\)/);

    expect(screen.getByText('👏🏻 정답입니다!')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-result="correct"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-result="incorrect"]')).toHaveLength(0);
    expect(screen.getByText('포인터만 바꾼다')).toBeInTheDocument();
  });

  it('접힌 오답 선지를 누르면 그 선지의 해설이 나타난다', async () => {
    await renderAndSubmit(/O\(n\)/);

    await userEvent.click(screen.getByRole('button', { name: /O\(n\)/ }));

    expect(screen.getByText('탐색이 필요할 때다')).toBeInTheDocument();
  });

  it('제출 후 다른 선지를 눌러도 판정이 바뀌지 않는다', async () => {
    const { container } = await renderAndSubmit(/O\(n\)/);

    await userEvent.click(screen.getByRole('button', { name: /O\(1\)/ }));

    expect(screen.getByText('❌ 오답입니다!')).toBeInTheDocument();
    expect(screen.queryByText('👏🏻 정답입니다!')).not.toBeInTheDocument();
    expect(container.querySelectorAll('[data-result="incorrect"]')).toHaveLength(1);
  });
});

function createObjectiveProblem(problemId: number, instruction: string) {
  return {
    problemId,
    problemType: 'OBJECTIVE',
    instruction,
    content: `본문 ${problemId}`,
    isBookmarked: false,
    options: [
      {
        optionId: problemId * 10,
        content: '정답',
        explanation: '정답 해설',
        isAnswer: true,
        problemId,
      },
      {
        optionId: problemId * 10 + 1,
        content: '오답',
        explanation: '오답 해설',
        isAnswer: false,
        problemId,
      },
    ],
  };
}

function createLesson(count: number) {
  const problems = Array.from({ length: count }, (_, index) =>
    createObjectiveProblem(101 + index, `${index + 1}번 발문`),
  );

  return { ...LESSON_PROBLEMS, totalProblems: count, problems };
}

describe('LessonQuizPage 이동과 진행 패널', () => {
  it('제출하지 않고 다음으로 가면 그 문제가 미완료로 남는다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(3))));
    const { container } = await renderLessonQuiz();

    await userEvent.click(await screen.findByRole('button', { name: '다음 문제' }));

    expect(screen.getByText('2번 발문')).toBeInTheDocument();
    expect(container.querySelector('[data-status="incomplete"]')).toHaveTextContent('1');
  });

  it('진행 패널에서 미완료 문제로 돌아가 다시 풀 수 있다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(3))));
    await renderLessonQuiz();

    await userEvent.click(await screen.findByRole('button', { name: '다음 문제' }));
    await userEvent.click(screen.getByRole('button', { name: '1' }));

    expect(screen.getByText('1번 발문')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /정답|오답/ })).toHaveLength(2);
  });

  it('10문제 중 2개를 제출하면 진행률이 2/10이다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(10))));
    const { container } = await renderLessonQuiz();

    await userEvent.click(await screen.findByRole('button', { name: /^정답/ }));
    await userEvent.click(screen.getByRole('button', { name: '다음 문제' }));
    await userEvent.click(screen.getByRole('button', { name: /^정답/ }));

    // 분자와 분모가 다른 요소에 있으므로 컨테이너의 합쳐진 텍스트를 확인한다.
    expect(container.querySelector('[data-slot="progress-count"]')).toHaveTextContent('2/10');
  });

  it('첫 문제에서는 이전 버튼을 누를 수 없다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(3))));
    await renderLessonQuiz();

    expect(await screen.findByRole('button', { name: '이전 문제' })).toBeDisabled();
  });

  it('좁은 화면에서는 진행 패널이 없고 이전·다음 버튼만 있다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(3))));
    const { container } = await renderLessonQuiz({ isWide: false });

    expect(await screen.findByText('1번 발문')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="quiz-progress-panel"]')).toBeNull();
    expect(screen.getAllByRole('button', { name: '이전' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: '다음' })).toHaveLength(1);
  });
});

const MIXED_PROBLEMS = {
  ...LESSON_PROBLEMS,
  totalProblems: 3,
  problems: [
    createObjectiveProblem(101, '1번 발문'),
    {
      problemId: 102,
      problemType: 'SUBJECTIVE',
      instruction: '2번 발문',
      content: '그래프를 깊이 우선으로 순회하는 알고리즘은?',
      isBookmarked: false,
      answerResponse: { contents: ['DFS'], explanation: '깊이를 우선한다' },
    },
    createObjectiveProblem(103, '3번 발문'),
  ],
};

describe('LessonQuizPage 문제 유형이 섞인 이동', () => {
  it('객관식을 제출하고 다음으로 가면 주관식 문제를 건너뛰지 않는다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(MIXED_PROBLEMS)));
    await renderLessonQuiz();

    await userEvent.click(await screen.findByRole('button', { name: /^정답/ }));
    await userEvent.click(screen.getByRole('button', { name: '다음 문제' }));

    expect(screen.getByText('2번 발문')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '답 입력' })).toBeInTheDocument();
  });

  // act가 리렌더를 클릭 처리 뒤로 미뤄 건너뛰기 자체는 jsdom에서 재현되지 않는다. 원인을 고정한다.
  it('다음 버튼은 문제 유형이 바뀌어도 폼 제출 버튼이 되지 않는다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(MIXED_PROBLEMS)));
    await renderLessonQuiz();

    const nextOnObjective = await screen.findByRole('button', { name: '다음 문제' });
    expect(nextOnObjective).toHaveAttribute('type', 'button');
    expect(nextOnObjective).not.toHaveAttribute('form');

    await userEvent.click(screen.getByRole('button', { name: /^정답/ }));
    await userEvent.click(screen.getByRole('button', { name: '다음 문제' }));

    const nextOnSubjective = screen.getByRole('button', { name: '다음 문제' });
    expect(nextOnSubjective).toHaveAttribute('type', 'button');
    expect(nextOnSubjective).not.toHaveAttribute('form');
  });

  it('제출하지 않고 다음으로 가도 주관식 문제를 건너뛰지 않는다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(MIXED_PROBLEMS)));
    await renderLessonQuiz();

    await userEvent.click(await screen.findByRole('button', { name: '다음 문제' }));

    expect(screen.getByText('2번 발문')).toBeInTheDocument();
  });
});

const SUBMIT_URL = '*/api/v1/lessons/results';
const RESULT_PATH = '/learning/lessons/$lessonId/result/$submissionId';
const RESULT_URL = '*/api/v1/lessons/results/:lessonSubmissionId';

async function solveAllProblems(count: number) {
  for (let index = 0; index < count; index += 1) {
    await userEvent.click(await screen.findByRole('button', { name: /^정답/ }));

    if (index < count - 1) {
      await userEvent.click(screen.getByRole('button', { name: '다음 문제' }));
    }
  }
}

describe('LessonQuizPage 레슨 제출', () => {
  it('마지막 문제의 답을 확인하면 다음 버튼이 제출하기로 바뀐다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(2))));
    await renderLessonQuiz();
    await solveAllProblems(2);

    expect(screen.getByRole('button', { name: '제출하기' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '다음 문제' })).not.toBeInTheDocument();
  });

  it('제출 중에는 덮개가 화면을 가리고 뒤쪽 조작을 막는다', async () => {
    server.use(
      http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(2))),
      http.post(SUBMIT_URL, () => new Promise(() => {})),
    );
    const { container } = await renderLessonQuiz();
    await solveAllProblems(2);

    await userEvent.click(screen.getByRole('button', { name: '제출하기' }));

    // 숨긴 라벨로 화면 낭독기에도 제출 상태를 전달한다.
    expect(await screen.findByText('제출하고 있어요')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="submitting-overlay"]')).not.toBeNull();
    // 푼 자리는 유지하지만 inert로 뒤쪽 상호작용을 막는다.
    expect(screen.getByText('2번 발문')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="quiz-surface"]')).toHaveAttribute('inert');
  });

  it('결과를 받아올 때까지 덮개가 유지되어 로딩이 한 번만 보인다', async () => {
    server.use(
      http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(2))),
      http.post(SUBMIT_URL, () =>
        HttpResponse.json({ lessonSubmissionId: 345, isLevelUp: false, isLeaguePromoted: false }),
      ),
      // 제출은 끝났지만 결과 조회가 아직이다. 여기서 덮개가 걷히면 결과 화면에서 또 로딩이 뜬다.
      http.get(RESULT_URL, () => new Promise(() => {})),
    );
    const { container, router } = await renderLessonQuiz({
      extraPaths: [...EXTRA_PATHS, RESULT_PATH],
    });
    await solveAllProblems(2);

    await userEvent.click(screen.getByRole('button', { name: '제출하기' }));

    await waitFor(() =>
      expect(container.querySelector('[data-slot="submitting-overlay"]')).not.toBeNull(),
    );
    // 결과가 오기 전에는 이동하지 않는다.
    expect(router.state.location.pathname).not.toContain('/result/');
    expect(container.querySelector('[data-slot="submitting-overlay"]')).not.toBeNull();
  });

  it('제출에 실패하면 덮개만 걷히고 화면은 그대로다', async () => {
    server.use(
      http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(2))),
      http.post(SUBMIT_URL, () => new HttpResponse(null, { status: 500 })),
    );
    const { container } = await renderLessonQuiz();
    await solveAllProblems(2);

    await userEvent.click(screen.getByRole('button', { name: '제출하기' }));

    await waitFor(() =>
      expect(container.querySelector('[data-slot="submitting-overlay"]')).toBeNull(),
    );
    expect(container.querySelector('[data-slot="quiz-surface"]')).not.toHaveAttribute('inert');
    expect(screen.getByRole('button', { name: '제출하기' })).toBeInTheDocument();
  });

  it('제출에 실패하면 이유를 토스트로 알린다', async () => {
    server.use(
      http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(2))),
      http.post(SUBMIT_URL, () => new HttpResponse(null, { status: 500 })),
    );
    await renderLessonQuiz();
    await solveAllProblems(2);

    await userEvent.click(screen.getByRole('button', { name: '제출하기' }));

    expect(await screen.findByText('제출에 실패했어요. 다시 시도해 주세요.')).toBeInTheDocument();
  });

  it('제출에 성공하면 결과 라우트로 이동하고 풀이 화면을 기록에 남기지 않는다', async () => {
    server.use(
      http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(2))),
      http.post(SUBMIT_URL, () =>
        HttpResponse.json({ lessonSubmissionId: 345, isLevelUp: false, isLeaguePromoted: false }),
      ),
      http.get(RESULT_URL, () => HttpResponse.json({})),
    );
    const { router } = await renderLessonQuiz({ extraPaths: [...EXTRA_PATHS, RESULT_PATH] });
    await solveAllProblems(2);

    await userEvent.click(screen.getByRole('button', { name: '제출하기' }));

    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/learning/lessons/7/result/345'),
    );

    router.history.back();
    // 테스트에서 풀이 화면은 `/`에 마운트된다. replace라 해당 기록으로 돌아가지 않는다.
    await waitFor(() => expect(router.state.location.pathname).not.toBe('/'));
  });

  it('제출에 실패하면 풀이 화면에 남고 제출한 답을 잃지 않는다', async () => {
    server.use(
      http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(3))),
      http.post(SUBMIT_URL, () => new HttpResponse(null, { status: 500 })),
    );
    const { container } = await renderLessonQuiz();
    await solveAllProblems(3);

    await userEvent.click(screen.getByRole('button', { name: '제출하기' }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: '제출하기' })).not.toHaveAttribute('aria-busy'),
    );
    expect(screen.getByText('3번 발문')).toBeInTheDocument();
    // 현재 문제는 제출 후에도 `current` 상태이므로 완료 수는 진행률로 확인한다.
    expect(container.querySelector('[data-slot="progress-count"]')).toHaveTextContent('3/3');
  });
});

describe('LessonQuizPage 풀이 중 답안 보존', () => {
  it('새로고침처럼 다시 마운트되면 저장된 시작 시각부터 타이머를 이어간다', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(3))));
    const first = await renderLessonQuiz();

    const timer = await screen.findByRole('timer', { name: '경과 시간' });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(65_000);
    });

    expect(timer).toHaveTextContent('01:05');

    first.unmount();
    await renderLessonQuiz();

    expect(await screen.findByRole('timer', { name: '경과 시간' })).toHaveTextContent('01:05');
  });

  it('새로고침처럼 다시 마운트되면 풀던 답이 복원된다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(3))));
    const first = await renderLessonQuiz();

    await userEvent.click(await screen.findByRole('button', { name: /^정답/ }));
    await userEvent.click(screen.getByRole('button', { name: '다음 문제' }));
    await userEvent.click(screen.getByRole('button', { name: /^정답/ }));

    // 새로고침과 달리 sessionStorage는 그대로 둔 채 컴포넌트만 다시 마운트한다.
    first.unmount();
    const { container } = await renderLessonQuiz();

    await screen.findByText('2번 발문');
    expect(container.querySelector('[data-slot="progress-count"]')).toHaveTextContent('2/3');
  });

  it('레슨을 떠나 저장본이 지워졌으면 처음부터 시작한다', async () => {
    server.use(http.get(PROBLEMS_URL, () => HttpResponse.json(createLesson(3))));
    const first = await renderLessonQuiz();

    await userEvent.click(await screen.findByRole('button', { name: /^정답/ }));

    first.unmount();
    // 라우트의 onLeave와 같은 조건을 만든다.
    clearStoredQuizSession(7);
    const { container } = await renderLessonQuiz();

    await screen.findByText('1번 발문');
    expect(container.querySelector('[data-slot="progress-count"]')).toHaveTextContent('0/3');
  });
});
