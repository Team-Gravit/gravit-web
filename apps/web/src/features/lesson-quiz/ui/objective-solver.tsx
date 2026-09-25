import { OptionChoiceList, OptionResultList, type ObjectiveProblem } from '@/entities/problem';

import { gradeObjective } from '../model/grade-objective';
import { useQuizSession } from '../model/quiz-session-context';

export interface ObjectiveSolverProps {
  problem: ObjectiveProblem;
}

/** 객관식 선지 선택을 채점·세션 기록에 연결하고 제출 전후 표시를 전환한다. */
export function ObjectiveSolver({ problem }: ObjectiveSolverProps) {
  const { answersByProblemId, submitAnswer, hiddenOptionIdsByProblemId, toggleHiddenOption } =
    useQuizSession();
  const answer = answersByProblemId[problem.problemId];

  if (answer?.kind === 'objective') {
    return (
      <OptionResultList options={problem.options} selectedOptionId={answer.selectedOptionId} />
    );
  }

  const handleOptionSelect = (optionId: number) => {
    submitAnswer({
      problemId: problem.problemId,
      answer: {
        kind: 'objective',
        selectedOptionId: optionId,
        isCorrect: gradeObjective(problem.options, optionId),
      },
    });
  };

  return (
    <OptionChoiceList
      options={problem.options}
      onSelect={handleOptionSelect}
      hiddenOptionIds={hiddenOptionIdsByProblemId[problem.problemId]}
      onToggleHide={(optionId) => toggleHiddenOption(problem.problemId, optionId)}
    />
  );
}
