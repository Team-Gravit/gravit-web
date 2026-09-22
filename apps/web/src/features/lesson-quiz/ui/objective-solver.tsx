import { OptionChoiceList, OptionResultList, type ObjectiveProblem } from '@/entities/problem';

import { gradeObjective } from '../model/grade-objective';
import { useQuizSession } from '../model/quiz-session-context';

export interface ObjectiveSolverProps {
  problem: ObjectiveProblem;
}

/**
 * 객관식 선지의 클릭을 채점과 세션에 잇는다.
 *
 * 선지 표시는 다른 풀이 화면에서도 재사용할 수 있도록 `entities/problem`에 두고,
 * 제출 여부에 따른 전환만 이 기능에서 결정한다.
 */
export function ObjectiveSolver({ problem }: ObjectiveSolverProps) {
  const { answersByProblemId, submitAnswer } = useQuizSession();
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

  return <OptionChoiceList options={problem.options} onSelect={handleOptionSelect} />;
}
