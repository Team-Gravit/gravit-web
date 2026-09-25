import type { SubmitEvent } from 'react';

import { TextField } from '@/shared/ui/text-field';
import { AnswerResult, type SubjectiveProblem } from '@/entities/problem';

import { useQuizSession } from '../model/quiz-session-context';

export interface SubjectiveAnswerProps {
  problem: SubjectiveProblem;
  onAdvance: () => void;
}

/** 주관식 답안을 입력하고 채점 결과를 표시한다. 진행 동작은 상위 화면이 결정한다. */
export function SubjectiveAnswer({ problem, onAdvance }: SubjectiveAnswerProps) {
  const { answersByProblemId, subjectiveAnswerDraft, setSubjectiveAnswerDraft } = useQuizSession();
  const answer = answersByProblemId[problem.problemId];

  if (answer?.kind === 'subjective') {
    return (
      <AnswerResult
        submittedContent={answer.submittedContent ?? ''}
        isCorrect={answer.isCorrect}
        correctAnswers={problem.answer.contents}
        explanation={problem.answer.explanation}
      />
    );
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAdvance();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        value={subjectiveAnswerDraft}
        onChange={(event) => setSubjectiveAnswerDraft(event.target.value)}
        aria-label="답 입력"
        placeholder="답을 입력하세요"
      />
    </form>
  );
}
