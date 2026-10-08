import { cn } from '@/shared/lib/cn';
import { ProgressBar } from '@/shared/ui/progress-bar';
import type { Problem } from '@/entities/problem';
import {
  countCompletedProblems,
  PROGRESS_PANEL_LABELS,
  toProblemProgressStatuses,
  useQuizSession,
} from '@/features/lesson-quiz';

import { ProblemStatusButton, problemStatusColors } from './problem-status-button';

const LEGEND_ITEMS = [
  { status: 'current', label: PROGRESS_PANEL_LABELS.current },
  { status: 'completed', label: PROGRESS_PANEL_LABELS.completed },
  { status: 'incomplete', label: PROGRESS_PANEL_LABELS.incomplete },
] as const;

export interface QuizProgressPanelProps {
  problems: Problem[];
  className?: string;
}

/** 배치와 개폐를 페이지에 맡겨 같은 패널을 고정 열과 서랍에서 사용할 수 있게 한다. */
export function QuizProgressPanel({ problems, className }: QuizProgressPanelProps) {
  const { answersByProblemId, currentProblemIndex, goTo } = useQuizSession();
  const problemStatuses = toProblemProgressStatuses(
    problems,
    answersByProblemId,
    currentProblemIndex,
  );
  const completedProblemCount = countCompletedProblems(problems, answersByProblemId);
  const totalProblemCount = problems.length;

  return (
    <aside
      data-slot="quiz-progress-panel"
      className={cn(
        'flex flex-col gap-9 md:gap-15 bg-white p-8 h-full border-r-divider-1 border-r',
        className,
      )}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="md:text-headline1 md:text-text-1">{PROGRESS_PANEL_LABELS.progress}</span>
          <span
            data-slot="progress-count"
            className="md:text-body2-normal md:text-text-3 flex items-baseline"
          >
            <span className="md:text-text-1 md:text-headline2">{completedProblemCount}</span>/
            {totalProblemCount}
          </span>
        </div>
        <ProgressBar
          fill="solid"
          value={totalProblemCount === 0 ? 0 : (completedProblemCount / totalProblemCount) * 100}
          aria-label={PROGRESS_PANEL_LABELS.progress}
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:gap-5">
          <h2 className="md:text-headline2 md:text-text-1">{PROGRESS_PANEL_LABELS.title}</h2>
          <ol className="grid grid-cols-5 justify-items-center gap-2">
            {problems.map((problem, problemIndex) => (
              <li key={problem.problemId}>
                <ProblemStatusButton
                  status={problemStatuses[problemIndex]}
                  onClick={() => goTo(problemIndex)}
                >
                  {problemIndex + 1}
                </ProblemStatusButton>
              </li>
            ))}
          </ol>
        </div>

        <ul className="flex justify-between">
          {LEGEND_ITEMS.map((item) => (
            <li key={item.status} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={cn(
                  problemStatusColors({ status: item.status }),
                  'size-4 shrink-0 rounded-4',
                )}
              />
              <span className="text-body2-normal text-text-1">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
