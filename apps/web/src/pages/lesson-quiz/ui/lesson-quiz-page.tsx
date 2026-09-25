import { useMemo } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { useInitialMinimumDuration } from '@/shared/lib/use-initial-minimum-duration';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { Button } from '@/shared/ui/button';
import { CardRetryStatus, CardStatus } from '@/shared/ui/card';
import { Spinner } from '@/shared/ui/spinner';
import { toast } from '@/shared/ui/toast';
import { toUnitLabel } from '@/entities/learning';
import { ProblemCard, useLessonProblems, type Problem } from '@/entities/problem';
import {
  clearStoredQuizSession,
  ObjectiveSolver,
  PROBLEM_NAV_LABELS,
  QUIZ_ANSWER_FORM_ID,
  QUIZ_SUBMIT_LABEL,
  QuizSessionProvider,
  SubjectiveAnswer,
  useQuizSession,
  useSubmitLesson,
} from '@/features/lesson-quiz';
import { QuizProgressPanel } from '@/widgets/quiz-progress-panel';

import { LoadingScreen } from './loading-screen';
import { QuizTimer } from './quiz-timer';
import { QuizTopBar } from './quiz-top-bar';

const SURFACE_CLASS = 'flex h-dvh flex-col bg-bg-1';
const MINIMUM_LOADING_DURATION_MS = 2500;
const PANEL_CLASS = 'w-70 shrink-0 overflow-y-auto';
const RESULT_ROUTE = '/learning/lessons/$lessonId/result/$submissionId';
const SUBMIT_FAILURE_MESSAGE = '제출에 실패했어요. 다시 시도해 주세요.';

export interface LessonQuizPageProps {
  lessonId: number;
}

export function LessonQuizPage({ lessonId }: LessonQuizPageProps) {
  const { data, isPending, isError, refetch } = useLessonProblems(lessonId);

  // 문제 목록이 바뀔 때만 세션 저장 작업이 실행되도록 배열 참조를 유지
  const problemIds = useMemo(
    () => (data?.problems ?? []).map((problem) => problem.problemId),
    [data],
  );
  // 응답이 바로 오더라도 화면이 깜빡이지 않도록 로딩 화면을 최소 2.5초 유지
  const shouldShowLoadingScreen = useInitialMinimumDuration(isPending, MINIMUM_LOADING_DURATION_MS);

  if (shouldShowLoadingScreen) {
    return (
      <div data-slot="lesson-quiz-page" className={SURFACE_CLASS}>
        <LoadingScreen />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div data-slot="lesson-quiz-page" className={cn(SURFACE_CLASS, 'justify-center p-4')}>
        <CardRetryStatus sectionName="문제" onRetry={() => void refetch()} />
      </div>
    );
  }

  const unitLabel = toUnitLabel(data.unitSummary);

  return (
    <QuizSessionProvider key={lessonId} lessonId={lessonId} problemIds={problemIds}>
      <QuizScreen
        lessonId={lessonId}
        title={`${unitLabel} - ${data.unitSummary.title}`}
        unitId={data.unitSummary.unitId}
        problems={data.problems}
      />
    </QuizSessionProvider>
  );
}

interface QuizScreenProps {
  lessonId: number;
  title: string;
  unitId: number;
  problems: Problem[];
}

function QuizScreen({ lessonId, title, unitId, problems }: QuizScreenProps) {
  const navigate = useNavigate();
  const isWide = useIsWideViewport();
  const { currentProblemIndex, answersByProblemId, startedAt } = useQuizSession();
  const currentProblem = problems[currentProblemIndex];
  const { submit, isPending: isSubmitting } = useSubmitLesson({
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
    submit({
      lessonId,
      problems,
      answersByProblemId,
      learningTime: Math.round((Date.now() - startedAt) / 1000),
    });

  if (!currentProblem) {
    return (
      <div data-slot="lesson-quiz-page" className={cn(SURFACE_CLASS, 'justify-center p-4')}>
        <CardStatus message="이 레슨에는 문제가 없어요." />
      </div>
    );
  }

  return (
    <div data-slot="lesson-quiz-page" className={SURFACE_CLASS}>
      {/* 제출 중에는 풀이 상태를 유지하고 inert로 뒤쪽 상호작용을 막는다. */}
      <div data-slot="quiz-surface" inert={isSubmitting} className="flex min-h-0 flex-1 flex-col">
        <QuizTopBar title={title} unitId={unitId} />
        {/*
        문제 영역만 스크롤하려면 상위 flex 자식마다 min-h-0이 필요
        하나라도 빠지면 overflow가 적용되지 않고 컨테이너가 내용만큼 늘어날 수 있음
      */}
        <div className="flex min-h-0 w-full flex-1">
          {isWide ? <QuizProgressPanel problems={problems} className={PANEL_CLASS} /> : null}
          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="scrollbar-gutter-stable min-h-0 flex-1 overflow-y-auto">
              {/* 내용이 짧을 때도 이동 버튼을 바닥에 두기 위해 최소 높이를 채운다. */}
              <div className="mx-auto flex min-h-full w-full max-w-300 flex-col gap-6 px-4 pt-5 md:px-8 md:pt-8">
                <div className="flex justify-end">
                  <QuizTimer startedAt={startedAt} />
                </div>
                <ProblemCard problem={currentProblem} number={currentProblemIndex + 1}>
                  <ProblemSolver key={currentProblem.problemId} problem={currentProblem} />
                </ProblemCard>
                <QuizFooter
                  problems={problems}
                  isWide={isWide}
                  onSubmitLesson={handleSubmitLesson}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
      {isSubmitting ? <SubmittingOverlay /> : null}
    </div>
  );
}

/** 제출 중에는 풀이 맥락이 남도록 반투명 덮개로 상호작용만 방지*/
function SubmittingOverlay() {
  return (
    <div
      data-slot="submitting-overlay"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-bg-0/65"
    >
      <Spinner size="lg" label="제출하고 있어요" className="text-cta" />
    </div>
  );
}

function ProblemSolver({ problem }: { problem: Problem }) {
  if (problem.type === 'objective') {
    return <ObjectiveSolver problem={problem} />;
  }

  return <SubjectiveAnswer problem={problem} />;
}

/** 주관식 답안 제출과 문제 이동, 마지막 레슨 제출을 연결한다. */
function QuizFooter({
  problems,
  isWide,
  onSubmitLesson,
}: {
  problems: Problem[];
  isWide: boolean;
  onSubmitLesson: () => void;
}) {
  const { answersByProblemId, currentProblemIndex, totalProblemCount, goToPrevious, goToNext } =
    useQuizSession();

  const problem = problems[currentProblemIndex];
  const labels = isWide ? PROBLEM_NAV_LABELS.wide : PROBLEM_NAV_LABELS.narrow;
  const isAnswerSubmitted =
    problem !== undefined && answersByProblemId[problem.problemId] !== undefined;
  const shouldSubmitAnswer = problem?.type === 'subjective' && !isAnswerSubmitted;
  const isLastProblem = currentProblemIndex === totalProblemCount - 1;
  const canSubmitLesson = isLastProblem && isAnswerSubmitted;

  // 브라우저는 클릭 전파가 끝난 뒤 버튼의 type을 다시 읽는다. 전파 도중 리렌더로 type이
  // submit이 되면 그 클릭이 방금 마운트된 주관식 폼까지 제출하므로 type을 고정해 둔다.
  const handleNext = () => {
    if (canSubmitLesson) {
      onSubmitLesson();
      return;
    }

    if (!shouldSubmitAnswer) {
      goToNext();
      return;
    }

    const answerForm = document.getElementById(QUIZ_ANSWER_FORM_ID);

    if (answerForm instanceof HTMLFormElement) {
      answerForm.requestSubmit();
    }
  };

  return (
    <div
      data-slot="quiz-footer"
      className={cn(
        // 내용이 짧으면 mt-auto가 아래로 밀고, 길면 sticky가 하단에 붙잡아 둔다.
        'sticky bottom-0 mt-auto flex gap-3 bg-bg-1 pt-3 pb-5 md:gap-4 md:pb-10',
        isWide ? 'justify-end' : null,
      )}
    >
      <Button
        size={{ base: 'md', md: 'lg' }}
        type="button"
        variant="stroke-default"
        className="md:w-40"
        onClick={goToPrevious}
        disabled={currentProblemIndex === 0}
      >
        {labels.prev}
      </Button>
      <Button
        size={{ base: 'md', md: 'lg' }}
        type="button"
        onClick={handleNext}
        className={isWide ? 'md:w-40' : 'flex-1'}
      >
        {canSubmitLesson ? QUIZ_SUBMIT_LABEL : labels.next}
      </Button>
    </div>
  );
}
