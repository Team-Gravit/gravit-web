import { useMemo, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { useInitialMinimumDuration } from '@/shared/lib/use-initial-minimum-duration';
import { CardRetryStatus } from '@/shared/ui/card';
import { toUnitLabel } from '@/entities/learning';
import {
  getReviewProblemsQueryKey,
  useReviewProblems,
  type Problem,
  type ReviewProblemsKind,
} from '@/entities/problem';
import { BookmarkToggle } from '@/features/problem-bookmark';
import {
  QUIZ_FINISH_LABEL,
  QuizSessionProvider,
  useQuizSession,
  useSubmitProblemResult,
} from '@/features/lesson-quiz';
import { ExcludeWrongAnswerButton } from '@/features/wrong-answer-exclude';
import { QUIZ_SURFACE_CLASS, QuizLoadingScreen, QuizScreen } from '@/widgets/quiz-screen';

const MINIMUM_LOADING_DURATION_MS = 2500;
const EXIT_ROUTE = '/learning/units/$unitId';

// 유닛 상세가 진입을 막을 때 쓰는 문구와 같다. 주소로 바로 들어와 목록이 비었을 때 보인다.
const EMPTY_MESSAGES: Record<ReviewProblemsKind, string> = {
  bookmark: '아직 북마크한 문제가 없어요.',
  wrongAnswer: '아직 틀린 문제가 없어요.',
};

/** 새로고침 저장본의 키. 레슨 저장본(레슨 ID)과 겹치지 않게 종류를 붙인다. */
export function toReviewQuizSessionKey(kind: ReviewProblemsKind, unitId: number): string {
  return `review:${kind}:${unitId}`;
}

export interface ReviewQuizPageProps {
  kind: ReviewProblemsKind;
  unitId: number;
}

/**
 * 북마크·오답 문제를 레슨 풀이와 같은 틀로 다시 푼다.
 * 레슨과 달리 답마다 바로 저장하고, 결과 화면 없이 유닛 상세로 돌아간다.
 */
export function ReviewQuizPage({ kind, unitId }: ReviewQuizPageProps) {
  const { data: reviewProblems, isPending, isError, refetch } = useReviewProblems(kind, unitId);
  const { submitProblemResult } = useSubmitProblemResult();

  // 문제 목록이 바뀔 때만 세션 저장 작업이 실행되도록 배열 참조를 유지한다.
  const problemIds = useMemo(
    () => (reviewProblems?.problems ?? []).map((problem) => problem.problemId),
    [reviewProblems?.problems],
  );
  // 응답이 바로 오더라도 화면이 깜빡이지 않도록 레슨 풀이와 같은 시간 로딩 화면을 유지한다.
  const shouldShowLoadingScreen = useInitialMinimumDuration(isPending, MINIMUM_LOADING_DURATION_MS);

  if (shouldShowLoadingScreen) {
    return (
      <div data-slot="review-quiz-page" className={QUIZ_SURFACE_CLASS}>
        <QuizLoadingScreen />
      </div>
    );
  }

  if (isError || !reviewProblems) {
    return (
      <div data-slot="review-quiz-page" className={cn(QUIZ_SURFACE_CLASS, 'justify-center p-4')}>
        <CardRetryStatus sectionName="문제" onRetry={() => void refetch()} />
      </div>
    );
  }

  const sessionKey = toReviewQuizSessionKey(kind, unitId);
  const unitLabel = toUnitLabel(reviewProblems.unitSummary);

  return (
    <QuizSessionProvider
      key={`${sessionKey}:${problemIds.join(',')}`}
      sessionKey={sessionKey}
      problemIds={problemIds}
      submitAnswerRemotely={submitProblemResult}
    >
      <ReviewQuizScreen
        kind={kind}
        unitId={unitId}
        title={`${unitLabel} - ${reviewProblems.unitSummary.title}`}
        problems={reviewProblems.problems}
      />
    </QuizSessionProvider>
  );
}

interface ReviewQuizScreenProps {
  kind: ReviewProblemsKind;
  unitId: number;
  title: string;
  problems: Problem[];
}

function ReviewQuizScreen({ kind, unitId, title, problems }: ReviewQuizScreenProps) {
  const navigate = useNavigate();
  const { answersByProblemId } = useQuizSession();
  // 제외해도 문제는 이번 풀이에 남는다(P8). 버튼만 숨기려고 이 화면에 있는 동안 기억한다.
  const [excludedProblemIds, setExcludedProblemIds] = useState<ReadonlySet<number>>(new Set());

  const handleExcluded = (problemId: number) => {
    setExcludedProblemIds((previous) => new Set(previous).add(problemId));
  };

  // 오답노트 제외는 오답노트 풀이에서, 맞힌 문제에만 보인다 (동작 계약 K3).
  const renderExcludeButton = (problem: Problem) => {
    const answer = answersByProblemId[problem.problemId];

    if (!answer?.isCorrect || excludedProblemIds.has(problem.problemId)) {
      return null;
    }

    return (
      <ExcludeWrongAnswerButton
        problemId={problem.problemId}
        onExcluded={handleExcluded}
        size="sm"
      />
    );
  };

  const handleFinish = () => {
    // 풀이 화면으로 돌아오지 않도록 기록을 교체한다. 목록 무효화는 라우트 이탈이 맡는다.
    void navigate({ to: EXIT_ROUTE, params: { unitId: String(unitId) }, replace: true });
  };

  return (
    <QuizScreen
      title={title}
      unitId={unitId}
      problems={problems}
      emptyMessage={EMPTY_MESSAGES[kind]}
      finishLabel={QUIZ_FINISH_LABEL}
      onFinish={handleFinish}
      renderResultAction={kind === 'wrongAnswer' ? renderExcludeButton : undefined}
      renderProblemAction={(problem) => (
        <BookmarkToggle
          problemsQueryKey={getReviewProblemsQueryKey(kind, unitId)}
          unitId={unitId}
          problemId={problem.problemId}
          isBookmarked={problem.isBookmarked}
        />
      )}
    />
  );
}
