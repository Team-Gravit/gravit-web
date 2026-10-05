import { useMemo } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { useInitialMinimumDuration } from '@/shared/lib/use-initial-minimum-duration';
import { CardRetryStatus } from '@/shared/ui/card';
import { toast } from '@/shared/ui/toast';
import { toUnitLabel } from '@/entities/learning';
import { getLessonProblemsQueryKey, useLessonProblems, type Problem } from '@/entities/problem';
import { BookmarkToggle } from '@/features/problem-bookmark';
import {
  clearStoredQuizSession,
  QUIZ_SUBMIT_LABEL,
  QuizSessionProvider,
  useQuizSession,
  useSubmitLesson,
} from '@/features/lesson-quiz';
import { QUIZ_SURFACE_CLASS, QuizLoadingScreen, QuizScreen } from '@/widgets/quiz-screen';

const MINIMUM_LOADING_DURATION_MS = 2500;
const RESULT_ROUTE = '/learning/lessons/$lessonId/result/$submissionId';
const SUBMIT_FAILURE_MESSAGE = '제출에 실패했어요. 다시 시도해 주세요.';

export interface LessonQuizPageProps {
  lessonId: number;
}

export function LessonQuizPage({ lessonId }: LessonQuizPageProps) {
  const { data: lessonProblems, isPending, isError, refetch } = useLessonProblems(lessonId);

  // 문제 목록이 바뀔 때만 세션 저장 작업이 실행되도록 배열 참조를 유지한다.
  const problemIds = useMemo(
    () => (lessonProblems?.problems ?? []).map((problem) => problem.problemId),
    [lessonProblems?.problems],
  );
  // 응답이 바로 오더라도 화면이 깜빡이지 않도록 로딩 화면을 최소 2.5초 유지한다.
  const shouldShowLoadingScreen = useInitialMinimumDuration(isPending, MINIMUM_LOADING_DURATION_MS);

  if (shouldShowLoadingScreen) {
    return (
      <div data-slot="lesson-quiz-page" className={QUIZ_SURFACE_CLASS}>
        <QuizLoadingScreen />
      </div>
    );
  }

  if (isError || !lessonProblems) {
    return (
      <div data-slot="lesson-quiz-page" className={cn(QUIZ_SURFACE_CLASS, 'justify-center p-4')}>
        <CardRetryStatus sectionName="문제" onRetry={() => void refetch()} />
      </div>
    );
  }

  const unitLabel = toUnitLabel(lessonProblems.unitSummary);
  const quizSessionKey = `${lessonId}:${problemIds.join(',')}`;

  return (
    <QuizSessionProvider key={quizSessionKey} sessionKey={lessonId} problemIds={problemIds}>
      <LessonQuizScreen
        lessonId={lessonId}
        title={`${unitLabel} - ${lessonProblems.unitSummary.title}`}
        unitId={lessonProblems.unitSummary.unitId}
        problems={lessonProblems.problems}
      />
    </QuizSessionProvider>
  );
}

interface LessonQuizScreenProps {
  lessonId: number;
  title: string;
  unitId: number;
  problems: Problem[];
}

/** 풀이 화면에 레슨 전용 동작(일괄 제출 · 결과 이동 · 북마크)을 연결한다. */
function LessonQuizScreen({ lessonId, title, unitId, problems }: LessonQuizScreenProps) {
  const navigate = useNavigate();
  const { answersByProblemId, startedAt } = useQuizSession();
  const { submit: submitLesson, isPending: isSubmitting } = useSubmitLesson({
    // 실패 후에도 풀이 화면을 유지하므로 토스트로 제출 결과를 알린다.
    onError: () => toast(SUBMIT_FAILURE_MESSAGE),
    onSuccess: async ({ lessonSubmissionId }) => {
      // 제출된 답안을 새로고침으로 다시 복원하지 않는다.
      clearStoredQuizSession(lessonId);

      // 제출을 마친 풀이 화면으로 돌아오지 않도록 현재 기록을 교체한다.
      await navigate({
        to: RESULT_ROUTE,
        params: { lessonId: String(lessonId), submissionId: String(lessonSubmissionId) },
        // 결과 라우트는 제출 직후의 이동만 허용한다.
        state: { fromLessonSubmission: true },
        replace: true,
      });
    },
  });

  const handleSubmitLesson = () =>
    submitLesson({
      lessonId,
      problems,
      answersByProblemId,
      learningTime: Math.round((Date.now() - startedAt) / 1000),
    });

  return (
    <QuizScreen
      title={title}
      unitId={unitId}
      problems={problems}
      emptyMessage="이 레슨에는 문제가 없어요."
      finishLabel={QUIZ_SUBMIT_LABEL}
      onFinish={handleSubmitLesson}
      isFinishing={isSubmitting}
      renderProblemAction={(problem) => (
        <BookmarkToggle
          problemsQueryKey={getLessonProblemsQueryKey(lessonId)}
          unitId={unitId}
          problemId={problem.problemId}
          isBookmarked={problem.isBookmarked}
        />
      )}
    />
  );
}
