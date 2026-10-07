import type { ReactNode, SubmitEvent } from 'react';

import { TextField } from '@/shared/ui/text-field';
import { AnswerResult, type SubjectiveProblem } from '@/entities/problem';

import { useQuizSession } from '../model/quiz-session-context';

export interface SubjectiveAnswerProps {
  problem: SubjectiveProblem;
  onAdvance: () => void;
  /** 정답을 맞혔을 때 해설 아래에 둘 조작. */
  correctAction?: ReactNode;
}

/** 주관식 답안을 입력하고 채점 결과를 표시한다. 진행 동작은 상위 화면이 결정한다. */
export function SubjectiveAnswer({ problem, onAdvance, correctAction }: SubjectiveAnswerProps) {
  const { answersByProblemId, pendingProblemId, subjectiveAnswerDraft, setSubjectiveAnswerDraft } =
    useQuizSession();
  const answer = answersByProblemId[problem.problemId];

  if (answer?.kind === 'subjective') {
    return (
      <AnswerResult
        submittedContent={answer.submittedContent ?? ''}
        isCorrect={answer.isCorrect}
        correctAnswers={problem.answer.contents}
        explanation={problem.answer.explanation}
        correctAction={correctAction}
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
        // 보내는 동안 답이 바뀌면 저장되는 답과 화면의 답이 달라진다.
        readOnly={pendingProblemId === problem.problemId}
      />
    </form>
  );
}
