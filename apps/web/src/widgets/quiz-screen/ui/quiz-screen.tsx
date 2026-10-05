import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { Button } from '@/shared/ui/button';
import { CardStatus } from '@/shared/ui/card';
import { Spinner } from '@/shared/ui/spinner';
import { ProblemCard, type Problem } from '@/entities/problem';
import {
  ObjectiveSolver,
  PROBLEM_NAV_LABELS,
  SubjectiveAnswer,
  useQuizSession,
} from '@/features/lesson-quiz';

import { QuizProgressPanel } from './quiz-progress-panel';
import { QuizTimer } from './quiz-timer';
import { QuizTopBar } from './quiz-top-bar';

export const QUIZ_SURFACE_CLASS = 'flex h-dvh flex-col bg-bg-1';
const PANEL_CLASS = 'w-70 shrink-0 overflow-y-auto';

export interface QuizScreenProps {
  title: string;
  /** 상단바 닫기가 돌아갈 유닛. */
  unitId: number;
  problems: Problem[];
  /** 문제가 하나도 없을 때 보일 문구. */
  emptyMessage: string;
  /** 마지막 문제에서 다음 버튼 자리에 보일 문구. */
  finishLabel: string;
  /** 마지막 문제에서 다음 버튼을 눌렀을 때. 답이 비어 있어도 호출된다. */
  onFinish: () => void;
  /** 끝내기 요청 중이면 덮개로 상호작용을 막는다. */
  isFinishing?: boolean;
  /** 문제 카드 머리 오른쪽에 둘 조작. */
  renderProblemAction?: (problem: Problem) => ReactNode;
}

/**
 * 풀이 화면의 공통 틀. 세션 상태는 바깥의 `QuizSessionProvider` 가 갖고,
 * 끝내기에서 무엇을 할지는 화면이 정한다.
 */
export function QuizScreen({
  title,
  unitId,
  problems,
  emptyMessage,
  finishLabel,
  onFinish,
  isFinishing = false,
  renderProblemAction,
}: QuizScreenProps) {
  const isWide = useIsWideViewport();
  const { currentProblemIndex, startedAt, advance, getAdvanceAction } = useQuizSession();
  const currentProblem = problems[currentProblemIndex];

  const handleAdvance = () => {
    if (!currentProblem) return;

    const action = advance(currentProblem);
    if (action === 'finish') {
      onFinish();
    }
  };

  if (!currentProblem) {
    return (
      <div data-slot="quiz-screen" className={cn(QUIZ_SURFACE_CLASS, 'justify-center p-4')}>
        <CardStatus message={emptyMessage} />
      </div>
    );
  }

  return (
    <div data-slot="quiz-screen" className={QUIZ_SURFACE_CLASS}>
      {/* 제출 중에는 풀이 상태를 유지하고 inert로 뒤쪽 상호작용을 막는다. */}
      <div data-slot="quiz-surface" inert={isFinishing} className="flex min-h-0 flex-1 flex-col">
        <QuizTopBar title={title} unitId={unitId} />
        {/* 문제 영역의 상위 flex 자식에 min-h-0이 없으면 컨테이너가 내용만큼 늘어난다. */}
        <div className="flex min-h-0 w-full flex-1">
          {isWide ? <QuizProgressPanel problems={problems} className={PANEL_CLASS} /> : null}
          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="scrollbar-gutter-stable min-h-0 flex-1 overflow-y-auto">
              {/* 내용이 짧을 때도 이동 버튼을 바닥에 두기 위해 최소 높이를 채운다. */}
              <div className="mx-auto flex min-h-full w-full max-w-300 flex-col gap-6 px-4 pt-5 md:px-8 md:pt-8">
                <div className="flex justify-end">
                  <QuizTimer startedAt={startedAt} />
                </div>
                <ProblemCard
                  problem={currentProblem}
                  number={currentProblemIndex + 1}
                  headerAction={renderProblemAction?.(currentProblem)}
                >
                  <ProblemSolver
                    key={currentProblem.problemId}
                    problem={currentProblem}
                    onAdvance={handleAdvance}
                  />
                </ProblemCard>
                <QuizFooter
                  isWide={isWide}
                  onAdvance={handleAdvance}
                  finishLabel={
                    getAdvanceAction(currentProblem) === 'finish' ? finishLabel : undefined
                  }
                />
              </div>
            </div>
          </main>
        </div>
      </div>
      {isFinishing ? <SubmittingOverlay /> : null}
    </div>
  );
}

/** 제출 중에는 풀이 맥락이 남도록 반투명 덮개로 상호작용을 막는다. */
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

interface ProblemSolverProps {
  problem: Problem;
  onAdvance: () => void;
}

function ProblemSolver({ problem, onAdvance }: ProblemSolverProps) {
  if (problem.type === 'objective') {
    return <ObjectiveSolver problem={problem} />;
  }

  return <SubjectiveAnswer problem={problem} onAdvance={onAdvance} />;
}

interface QuizFooterProps {
  isWide: boolean;
  onAdvance: () => void;
  /** 마지막 문제일 때만 넘긴다. 없으면 다음 문제 문구를 쓴다. */
  finishLabel?: string;
}

/** 문제 이동과 마지막 끝내기를 연결한다. */
function QuizFooter({ isWide, onAdvance, finishLabel }: QuizFooterProps) {
  const { currentProblemIndex, goToPrevious } = useQuizSession();

  const navigationLabels = isWide ? PROBLEM_NAV_LABELS.wide : PROBLEM_NAV_LABELS.narrow;

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
        {navigationLabels.prev}
      </Button>
      <Button
        size={{ base: 'md', md: 'lg' }}
        type="button"
        onClick={onAdvance}
        className={isWide ? 'md:w-40' : 'flex-1'}
      >
        {finishLabel ?? navigationLabels.next}
      </Button>
    </div>
  );
}
