import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';

import type { Problem } from '@/entities/problem';

import { gradeSubjective } from './grade-subjective';
import {
  readStoredQuizSession,
  writeStoredQuizSession,
  type QuizSessionKey,
} from './quiz-session-storage';
import {
  createInitialQuizSessionState,
  quizSessionReducer,
  type QuizAnswersByProblemId,
  type SubmitAnswerInput,
} from './quiz-session';

/** 다음 버튼을 눌렀을 때 수행할 동작. */
export type AdvanceAction = 'recordAnswer' | 'goToNext' | 'finish';

export interface QuizSessionContextValue {
  answersByProblemId: QuizAnswersByProblemId;
  currentProblemIndex: number;
  totalProblemCount: number;
  startedAt: number;
  subjectiveAnswerDraft: string;
  setSubjectiveAnswerDraft: (subjectiveAnswerDraft: string) => void;
  hiddenOptionIdsByProblemId: Partial<Record<number, number[]>>;
  toggleHiddenOption: (problemId: number, optionId: number) => void;
  submitAnswer: (input: SubmitAnswerInput) => void;
  /** 답을 서버에 보내는 중인 문제. 그동안 그 문제의 답을 바꿀 수 없다. */
  pendingProblemId: number | null;
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
  /** 새로고침 저장본을 구분한다. 레슨은 레슨 ID 를 넘긴다. */
  sessionKey: QuizSessionKey;
  problemIds: number[];
  /**
   * 주면 답을 이 함수로 먼저 보내고, 성공한 뒤에만 기록한다. 실패하면 기록하지 않아 다시 고를 수 있다.
   * 레슨처럼 마지막에 한꺼번에 제출하는 화면은 넘기지 않는다.
   */
  submitAnswerRemotely?: (input: SubmitAnswerInput) => Promise<void>;
  children: ReactNode;
}

/**
 * 풀이 상태를 `sessionStorage`에서 복원하고 변경될 때마다 저장한다.
 * 라우트 이탈 시 저장본 삭제는 `onLeave`가 담당한다.
 */
export function QuizSessionProvider({
  sessionKey,
  problemIds,
  submitAnswerRemotely,
  children,
}: QuizSessionProviderProps) {
  const [state, dispatch] = useReducer(quizSessionReducer, undefined, () => {
    const storedSession = readStoredQuizSession(sessionKey, problemIds);

    if (!storedSession) {
      return createInitialQuizSessionState(problemIds.length);
    }

    // 이전 버전의 저장본에는 새 필드가 없을 수 있어 기본값을 채운다.
    return {
      ...storedSession,
      subjectiveAnswerDraft: storedSession.subjectiveAnswerDraft ?? '',
      hiddenOptionIdsByProblemId: storedSession.hiddenOptionIdsByProblemId ?? {},
    };
  });

  useEffect(() => {
    writeStoredQuizSession(sessionKey, problemIds, state);
  }, [sessionKey, problemIds, state]);

  const [pendingProblemId, setPendingProblemId] = useState<number | null>(null);

  const submitAnswer = useCallback(
    (input: SubmitAnswerInput) => {
      if (!submitAnswerRemotely) {
        dispatch({ type: 'submitAnswer', ...input });
        return;
      }

      // 이미 기록했거나 보내는 중인 답은 다시 보내지 않는다.
      if (pendingProblemId !== null || state.answersByProblemId[input.problemId]) {
        return;
      }

      setPendingProblemId(input.problemId);
      submitAnswerRemotely(input)
        .then(() => dispatch({ type: 'submitAnswer', ...input }))
        // 실패 안내는 전송 함수가 맡는다. 여기서는 기록하지 않는 것으로 처리를 끝낸다.
        .catch(() => undefined)
        .finally(() => setPendingProblemId(null));
    },
    [pendingProblemId, state.answersByProblemId, submitAnswerRemotely],
  );
  const goToNext = useCallback(() => dispatch({ type: 'goToNext' }), []);
  const setSubjectiveAnswerDraft = useCallback(
    (subjectiveAnswerDraft: string) =>
      dispatch({ type: 'setSubjectiveAnswerDraft', subjectiveAnswerDraft }),
    [],
  );

  const toggleHiddenOption = useCallback(
    (problemId: number, optionId: number) =>
      dispatch({ type: 'toggleHiddenOption', problemId, optionId }),
    [],
  );

  const getAdvanceAction = useCallback(
    (problem: Problem): AdvanceAction => {
      const isAnswered = state.answersByProblemId[problem.problemId] !== undefined;

      if (problem.type === 'subjective' && !isAnswered && state.subjectiveAnswerDraft.trim()) {
        return 'recordAnswer';
      }

      // 마지막 문제에서는 넘어갈 곳이 없다. 답을 비워 두고 끝내는 것도 허용한다(R14).
      return state.currentProblemIndex === state.totalProblemCount - 1 ? 'finish' : 'goToNext';
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
        submitAnswer({
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
    [getAdvanceAction, state.subjectiveAnswerDraft, submitAnswer],
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
      hiddenOptionIdsByProblemId: state.hiddenOptionIdsByProblemId,
      toggleHiddenOption,
      submitAnswer,
      pendingProblemId,
      getAdvanceAction,
      advance,
      goToNext,
      goToPrevious,
      goTo,
    }),
    [
      state,
      pendingProblemId,
      setSubjectiveAnswerDraft,
      toggleHiddenOption,
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
