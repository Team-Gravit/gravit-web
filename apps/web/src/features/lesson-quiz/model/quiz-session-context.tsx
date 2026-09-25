import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import type { Problem } from '@/entities/problem';

import { gradeSubjective } from './grade-subjective';
import { readStoredQuizSession, writeStoredQuizSession } from './quiz-session-storage';
import {
  createInitialQuizSessionState,
  quizSessionReducer,
  type QuizAnswersByProblemId,
  type SubmitAnswerInput,
} from './quiz-session';

/** 다음 버튼을 눌렀을 때 수행할 동작. */
export type AdvanceAction = 'recordAnswer' | 'goToNext' | 'submitLesson';

export interface QuizSessionContextValue {
  answersByProblemId: QuizAnswersByProblemId;
  currentProblemIndex: number;
  totalProblemCount: number;
  startedAt: number;
  subjectiveAnswerDraft: string;
  setSubjectiveAnswerDraft: (subjectiveAnswerDraft: string) => void;
  submitAnswer: (input: SubmitAnswerInput) => void;
  /** 상태를 바꾸지 않고 다음 동작을 계산한다. */
  getAdvanceAction: (problem: Problem) => AdvanceAction;
  /** 다음 동작을 실행하고 화면이 이어서 처리할 동작을 반환한다. */
  advance: (problem: Problem) => AdvanceAction;
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

    if (!storedSession) {
      return createInitialQuizSessionState(problemIds.length);
    }

    return {
      ...storedSession,
      subjectiveAnswerDraft: storedSession.subjectiveAnswerDraft ?? '',
    };
  });

  useEffect(() => {
    writeStoredQuizSession(lessonId, problemIds, state);
  }, [lessonId, problemIds, state]);

  const submitAnswer = useCallback((input: SubmitAnswerInput) => {
    dispatch({ type: 'submitAnswer', ...input });
  }, []);
  const goToNext = useCallback(() => dispatch({ type: 'goToNext' }), []);
  const setSubjectiveAnswerDraft = useCallback(
    (subjectiveAnswerDraft: string) =>
      dispatch({ type: 'setSubjectiveAnswerDraft', subjectiveAnswerDraft }),
    [],
  );

  const getAdvanceAction = useCallback(
    (problem: Problem): AdvanceAction => {
      const isAnswered = state.answersByProblemId[problem.problemId] !== undefined;

      if (problem.type === 'subjective' && !isAnswered && state.subjectiveAnswerDraft.trim()) {
        return 'recordAnswer';
      }

      // 마지막 문제에서는 넘어갈 곳이 없다. 답을 비워 두고 끝내는 것도 허용한다(R14).
      return state.currentProblemIndex === state.totalProblemCount - 1
        ? 'submitLesson'
        : 'goToNext';
    },
    [
      state.answersByProblemId,
      state.currentProblemIndex,
      state.subjectiveAnswerDraft,
      state.totalProblemCount,
    ],
  );

  const advance = useCallback(
    (problem: Problem): AdvanceAction => {
      const action = getAdvanceAction(problem);

      if (action === 'recordAnswer' && problem.type === 'subjective') {
        dispatch({
          type: 'submitAnswer',
          problemId: problem.problemId,
          answer: {
            kind: 'subjective',
            submittedContent: state.subjectiveAnswerDraft,
            isCorrect: gradeSubjective(problem.answer.contents, state.subjectiveAnswerDraft),
          },
        });
      }

      if (action === 'goToNext') {
        dispatch({ type: 'goToNext' });
      }

      return action;
    },
    [getAdvanceAction, state.subjectiveAnswerDraft],
  );
  const goToPrevious = useCallback(() => dispatch({ type: 'goToPrevious' }), []);
  const goTo = useCallback((problemIndex: number) => dispatch({ type: 'goTo', problemIndex }), []);

  const contextValue = useMemo<QuizSessionContextValue>(
    () => ({
      answersByProblemId: state.answersByProblemId,
      currentProblemIndex: state.currentProblemIndex,
      totalProblemCount: state.totalProblemCount,
      startedAt: state.startedAt,
      subjectiveAnswerDraft: state.subjectiveAnswerDraft,
      setSubjectiveAnswerDraft,
      submitAnswer,
      getAdvanceAction,
      advance,
      goToNext,
      goToPrevious,
      goTo,
    }),
    [
      state,
      setSubjectiveAnswerDraft,
      submitAnswer,
      getAdvanceAction,
      advance,
      goToNext,
      goToPrevious,
      goTo,
    ],
  );

  return <QuizSessionContext value={contextValue}>{children}</QuizSessionContext>;
}

export function useQuizSession(): QuizSessionContextValue {
  const contextValue = useContext(QuizSessionContext);

  if (!contextValue) {
    throw new Error('useQuizSession은 QuizSessionProvider 안에서만 사용할 수 있습니다.');
  }

  return contextValue;
}
