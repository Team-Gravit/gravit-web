import { cn } from '@/shared/lib/cn';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { Button } from '@/shared/ui/button';
import { CardRetryStatus, CardStatus } from '@/shared/ui/card';
import { toUnitLabel } from '@/entities/learning';
import { ProblemCard, useLessonProblems, type Problem } from '@/entities/problem';
import {
  ObjectiveSolver,
  PROBLEM_NAV_LABELS,
  QUIZ_ANSWER_FORM_ID,
  QuizSessionProvider,
  SubjectiveAnswer,
  useQuizSession,
} from '@/features/lesson-quiz';
import { QuizProgressPanel } from '@/widgets/quiz-progress-panel';

import { LoadingScreen } from './loading-screen';
import { QuizTimer } from './quiz-timer';
import { QuizTopBar } from './quiz-top-bar';

const SURFACE_CLASS = 'flex h-dvh flex-col bg-bg-1';
const PANEL_CLASS = 'w-70 shrink-0 overflow-y-auto';

export interface LessonQuizPageProps {
  lessonId: number;
}

export function LessonQuizPage({ lessonId }: LessonQuizPageProps) {
  const { data, isPending, isError, refetch } = useLessonProblems(lessonId);

  if (isPending) {
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
    <QuizSessionProvider key={lessonId} totalProblemCount={data.problems.length}>
      <QuizScreen
        title={`${unitLabel} - ${data.unitSummary.title}`}
        unitId={data.unitSummary.unitId}
        problems={data.problems}
      />
    </QuizSessionProvider>
  );
}

interface QuizScreenProps {
  title: string;
  unitId: number;
  problems: Problem[];
}

function QuizScreen({ title, unitId, problems }: QuizScreenProps) {
  const isWide = useIsWideViewport();
  const { currentProblemIndex } = useQuizSession();
  const currentProblem = problems[currentProblemIndex];

  if (!currentProblem) {
    return (
      <div data-slot="lesson-quiz-page" className={cn(SURFACE_CLASS, 'justify-center p-4')}>
        <CardStatus message="이 레슨에는 문제가 없어요." />
      </div>
    );
  }

  return (
    <div data-slot="lesson-quiz-page" className={SURFACE_CLASS}>
      <QuizTopBar title={title} unitId={unitId} />
      {/*
        문제 영역만 스크롤하려면 상위 flex 자식마다 min-h-0이 필요하다.
        하나라도 빠지면 overflow가 적용되지 않고 컨테이너가 내용만큼 늘어난다.
      */}
      <div className="flex min-h-0 w-full flex-1">
        {isWide ? <QuizProgressPanel problems={problems} className={PANEL_CLASS} /> : null}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          {/*
            스크롤러는 남은 폭을 채우고 본문 너비만 안쪽에서 제한한다. scrollbar gutter는
            문제마다 스크롤바가 생기고 사라질 때 본문이 좌우로 움직이는 것을 막는다.
          */}
          <div className="scrollbar-gutter-stable min-h-0 flex-1 overflow-y-auto">
            {/* 내용이 짧을 때도 이동 버튼을 바닥에 두기 위해 최소 높이를 채운다. */}
            <div className="mx-auto flex min-h-full w-full max-w-300 flex-col gap-6 px-4 pt-5 md:px-8 md:pt-8">
              <div className="flex justify-end">
                <QuizTimer />
              </div>
              <ProblemCard problem={currentProblem} number={currentProblemIndex + 1}>
                <ProblemSolver key={currentProblem.problemId} problem={currentProblem} />
              </ProblemCard>
              <QuizFooter problem={currentProblem} isWide={isWide} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ProblemSolver({ problem }: { problem: Problem }) {
  if (problem.type === 'objective') {
    return <ObjectiveSolver problem={problem} />;
  }

  return <SubjectiveAnswer problem={problem} />;
}

/**
 * 미제출 주관식의 `다음 문제` 버튼은 카드 밖에서 form을 제출한다.
 * 마지막 문제는 제출 완료 동작이 연결되기 전까지 이동 버튼을 비활성화한다.
 */
function QuizFooter({ problem, isWide }: { problem: Problem; isWide: boolean }) {
  const { answersByProblemId, currentProblemIndex, totalProblemCount, goToPrevious, goToNext } =
    useQuizSession();
  const labels = isWide ? PROBLEM_NAV_LABELS.wide : PROBLEM_NAV_LABELS.narrow;
  const isAnswerSubmitted = answersByProblemId[problem.problemId] !== undefined;
  const shouldSubmitAnswer = problem.type === 'subjective' && !isAnswerSubmitted;
  const isLastProblem = currentProblemIndex === totalProblemCount - 1;

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
        type={shouldSubmitAnswer ? 'submit' : 'button'}
        form={shouldSubmitAnswer ? QUIZ_ANSWER_FORM_ID : undefined}
        onClick={shouldSubmitAnswer ? undefined : goToNext}
        disabled={isLastProblem && isAnswerSubmitted}
        className={isWide ? 'md:w-40' : 'flex-1'}
      >
        {labels.next}
      </Button>
    </div>
  );
}
