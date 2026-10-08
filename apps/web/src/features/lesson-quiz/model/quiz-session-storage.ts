import type { QuizSessionState } from './quiz-session';

const QUIZ_SESSION_KEY_PREFIX = 'gravit.quiz-session.';

/** 풀이 세션을 구분하는 키. 레슨은 레슨 ID 를 그대로 써서 기존 저장본과 같은 키를 만든다. */
export type QuizSessionKey = number | string;

interface StoredQuizSession {
  problemIdsKey: string;
  state: QuizSessionState;
}

function toQuizSessionStorageKey(sessionKey: QuizSessionKey): string {
  return `${QUIZ_SESSION_KEY_PREFIX}${sessionKey}`;
}

// 문제 순서는 저장본의 유효성에 영향이 없으므로 정렬한 ID로 비교 키를 만든다.
function toProblemIdsKey(problemIds: number[]): string {
  return [...problemIds].sort((a, b) => a - b).join(',');
}

// sessionStorage를 사용할 수 없거나 저장본이 손상돼도 문제 풀이는 계속한다.
function withSessionStorage<T>(operation: (storage: Storage) => T): T | undefined {
  try {
    return operation(window.sessionStorage);
  } catch {
    return undefined;
  }
}

/**
 * 레슨의 저장본을 현재 문제 ID 구성과 비교해 복원한다.
 * 저장본이 없거나 손상됐으면 `undefined`를 반환하고,
 * 문제 ID 구성이 달라졌으면 오래된 저장본도 함께 삭제한다.
 */
export function readStoredQuizSession(
  sessionKey: QuizSessionKey,
  problemIds: number[],
): QuizSessionState | undefined {
  return withSessionStorage((storage) => {
    const storageKey = toQuizSessionStorageKey(sessionKey);
    const storedSessionJson = storage.getItem(storageKey);

    if (!storedSessionJson) {
      return undefined;
    }

    const storedSession = JSON.parse(storedSessionJson) as StoredQuizSession;

    if (storedSession.problemIdsKey !== toProblemIdsKey(problemIds)) {
      storage.removeItem(storageKey);
      return undefined;
    }

    return storedSession.state;
  });
}

export function writeStoredQuizSession(
  sessionKey: QuizSessionKey,
  problemIds: number[],
  state: QuizSessionState,
): void {
  withSessionStorage((storage) => {
    const storedSession: StoredQuizSession = {
      problemIdsKey: toProblemIdsKey(problemIds),
      state,
    };

    storage.setItem(toQuizSessionStorageKey(sessionKey), JSON.stringify(storedSession));
  });
}

export function clearStoredQuizSession(sessionKey: QuizSessionKey): void {
  withSessionStorage((storage) => storage.removeItem(toQuizSessionStorageKey(sessionKey)));
}
