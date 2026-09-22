import { useState, type SubmitEvent } from 'react';

import { TextField } from '@/shared/ui/text-field';
import { AnswerResult, type SubjectiveProblem } from '@/entities/problem';

import { QUIZ_ANSWER_FORM_ID } from '../model/constants';
import { gradeSubjective } from '../model/grade-subjective';
import { useQuizSession } from '../model/quiz-session-context';

export interface SubjectiveAnswerProps {
  problem: SubjectiveProblem;
}

/**
 * 하단의 `정답 확인` 버튼이 `form` 속성으로 이 폼을 제출한다. 입력이 비어 있으면
 * 답을 기록하지 않고 미완료 상태로 남긴다.
 */
export function SubjectiveAnswer({ problem }: SubjectiveAnswerProps) {
  const { answersByProblemId, submitAnswer } = useQuizSession();
  const [draft, setDraft] = useState('');
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

    if (draft.trim()) {
      submitAnswer({
        problemId: problem.problemId,
        answer: {
          kind: 'subjective',
          submittedContent: draft,
          isCorrect: gradeSubjective(problem.answer.contents, draft),
        },
      });
    }
  };

  return (
    <form id={QUIZ_ANSWER_FORM_ID} onSubmit={handleSubmit}>
      <TextField
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        aria-label="답 입력"
        placeholder="답을 입력하세요"
      />
    </form>
  );
}
