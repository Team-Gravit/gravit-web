import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { readStoredQuizSession, writeStoredQuizSession } from './quiz-session-storage';
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
  lessonId: number;
  problemIds: number[];
  children: ReactNode;
}

/**
 * 레슨 풀이 상태를 `sessionStorage`에서 복원하고 변경될 때마다 저장한다.
 * 라우트 이탈 시 저장본 삭제는 `onLeave`가 담당한다.
 */
export function QuizSessionProvider({ lessonId, problemIds, children }: QuizSessionProviderProps) {
  const [state, dispatch] = useReducer(quizSessionReducer, undefined, () => {
    const storedSession = readStoredQuizSession(lessonId, problemIds);

    return storedSession ?? createInitialQuizSessionState(problemIds.length);
  });

  useEffect(() => {
    writeStoredQuizSession(lessonId, problemIds, state);
  }, [lessonId, problemIds, state]);

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
