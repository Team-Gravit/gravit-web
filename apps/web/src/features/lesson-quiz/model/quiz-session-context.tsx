import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';

import {
  createInitialQuizSessionState,
  quizSessionReducer,
  type QuizAnswersByProblemId,
  type SubmitAnswerInput,
} from './quiz-session';

export interface QuizSessionContextValue {
  answersByProblemId: QuizAnswersByProblemId;
  currentProblemIndex: number;
  totalProblemCount: number;
  startedAt: number;
  submitAnswer: (input: SubmitAnswerInput) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goTo: (problemIndex: number) => void;
}

const QuizSessionContext = createContext<QuizSessionContextValue | null>(null);

export interface QuizSessionProviderProps {
  totalProblemCount: number;
  children: ReactNode;
}

/**
 * 레슨 하나를 푸는 동안의 상태를 담는다.
 *
 * 매초 바뀌는 경과 시간은 구독자 전체를 다시 그리지 않도록 Context에 저장하지 않는다.
 */
export function QuizSessionProvider({ totalProblemCount, children }: QuizSessionProviderProps) {
  const [state, dispatch] = useReducer(
    quizSessionReducer,
    totalProblemCount,
    createInitialQuizSessionState,
  );

  const submitAnswer = useCallback((input: SubmitAnswerInput) => {
    dispatch({ type: 'submitAnswer', ...input });
  }, []);
  const goToNext = useCallback(() => dispatch({ type: 'goToNext' }), []);
  const goToPrevious = useCallback(() => dispatch({ type: 'goToPrevious' }), []);
  const goTo = useCallback((problemIndex: number) => dispatch({ type: 'goTo', problemIndex }), []);

  const value = useMemo<QuizSessionContextValue>(
    () => ({
      answersByProblemId: state.answersByProblemId,
      currentProblemIndex: state.currentProblemIndex,
      totalProblemCount: state.totalProblemCount,
      startedAt: state.startedAt,
      submitAnswer,
      goToNext,
      goToPrevious,
      goTo,
    }),
    [state, submitAnswer, goToNext, goToPrevious, goTo],
  );

  return <QuizSessionContext value={value}>{children}</QuizSessionContext>;
}

export function useQuizSession(): QuizSessionContextValue {
  const value = useContext(QuizSessionContext);

  if (!value) {
    throw new Error('useQuizSession은 QuizSessionProvider 안에서만 사용할 수 있습니다.');
  }

  return value;
}
