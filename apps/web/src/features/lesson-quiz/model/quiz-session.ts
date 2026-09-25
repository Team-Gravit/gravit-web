export type QuizAnswer =
  | { kind: 'objective'; selectedOptionId: number; isCorrect: boolean }
  | { kind: 'subjective'; submittedContent: string; isCorrect: boolean };

/** 미제출 문제는 키가 없다. */
export type QuizAnswersByProblemId = Partial<Record<number, QuizAnswer>>;

export interface SubmitAnswerInput {
  problemId: number;
  answer: QuizAnswer;
}

export interface QuizSessionState {
  currentProblemIndex: number;
  answersByProblemId: QuizAnswersByProblemId;
  /** 일괄 제출 시 풀이 시간을 계산할 기준 시각(ms). */
  startedAt: number;
  totalProblemCount: number;
  /** 현재 주관식 문제에 입력했지만 제출하지 않은 답안. */
  subjectiveAnswerDraft: string;
}

export type QuizSessionAction =
  | ({ type: 'submitAnswer' } & SubmitAnswerInput)
  | { type: 'setSubjectiveAnswerDraft'; subjectiveAnswerDraft: string }
  | { type: 'goToNext' }
  | { type: 'goToPrevious' }
  | { type: 'goTo'; problemIndex: number };

/** `useReducer`의 지연 초기화에서 시작 시각을 한 번만 기록한다. */
export function createInitialQuizSessionState(
  totalProblemCount: number,
  startedAt: number = Date.now(),
): QuizSessionState {
  return {
    currentProblemIndex: 0,
    answersByProblemId: {},
    startedAt,
    totalProblemCount,
    subjectiveAnswerDraft: '',
  };
}

/** 첫 제출만 기록하고 문제 이동은 레슨의 문제 범위 안에서만 허용한다. */
export function quizSessionReducer(
  state: QuizSessionState,
  action: QuizSessionAction,
): QuizSessionState {
  switch (action.type) {
    case 'submitAnswer': {
      // 제출한 답은 바꿀 수 없으므로 같은 문제의 후속 제출을 무시한다.
      if (state.answersByProblemId[action.problemId]) {
        return state;
      }

      return {
        ...state,
        answersByProblemId: {
          ...state.answersByProblemId,
          [action.problemId]: action.answer,
        },
      };
    }
    case 'setSubjectiveAnswerDraft':
      return { ...state, subjectiveAnswerDraft: action.subjectiveAnswerDraft };
    case 'goToNext':
      return moveToProblem(state, state.currentProblemIndex + 1);
    case 'goToPrevious':
      return moveToProblem(state, state.currentProblemIndex - 1);
    case 'goTo':
      return moveToProblem(state, action.problemIndex);
    default: {
      const exhaustiveAction: never = action;
      return exhaustiveAction;
    }
  }
}

function moveToProblem(state: QuizSessionState, problemIndex: number): QuizSessionState {
  if (
    problemIndex < 0 ||
    problemIndex >= state.totalProblemCount ||
    problemIndex === state.currentProblemIndex
  ) {
    return state;
  }

  // 주관식 초안은 현재 문제에서만 유효하다.
  return { ...state, currentProblemIndex: problemIndex, subjectiveAnswerDraft: '' };
}
