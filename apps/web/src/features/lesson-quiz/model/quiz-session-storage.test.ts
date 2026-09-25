import { afterEach, describe, expect, it } from 'vitest';

import {
  clearStoredQuizSession,
  readStoredQuizSession,
  writeStoredQuizSession,
} from './quiz-session-storage';
import { createInitialQuizSessionState } from './quiz-session';

const LESSON_ID = 7;
const PROBLEM_IDS = [101, 102, 103];

function createSessionWithAnswer() {
  return {
    ...createInitialQuizSessionState(3, 1_700_000_000_000),
    answersByProblemId: {
      101: { kind: 'objective', selectedOptionId: 10, isCorrect: true },
    },
  } as const;
}

afterEach(() => {
  window.sessionStorage.clear();
});

describe('풀이 세션 저장', () => {
  it('저장한 세션을 같은 레슨과 문제 목록에서 복원한다', () => {
    writeStoredQuizSession(LESSON_ID, PROBLEM_IDS, createSessionWithAnswer());

    expect(readStoredQuizSession(LESSON_ID, PROBLEM_IDS)).toEqual(createSessionWithAnswer());
  });

  it('저장본이 없으면 undefined를 반환한다', () => {
    expect(readStoredQuizSession(LESSON_ID, PROBLEM_IDS)).toBeUndefined();
  });

  it('레슨이 다르면 서로의 저장본을 읽지 않는다', () => {
    writeStoredQuizSession(LESSON_ID, PROBLEM_IDS, createSessionWithAnswer());

    expect(readStoredQuizSession(8, PROBLEM_IDS)).toBeUndefined();
  });

  it('문제 ID 집합이 바뀌면 저장본을 삭제한다', () => {
    writeStoredQuizSession(LESSON_ID, PROBLEM_IDS, createSessionWithAnswer());

    expect(readStoredQuizSession(LESSON_ID, [101, 102, 999])).toBeUndefined();
    expect(readStoredQuizSession(LESSON_ID, PROBLEM_IDS)).toBeUndefined();
  });

  it('문제 ID 순서만 바뀌면 저장본을 복원한다', () => {
    writeStoredQuizSession(LESSON_ID, PROBLEM_IDS, createSessionWithAnswer());

    expect(readStoredQuizSession(LESSON_ID, [103, 101, 102])).toEqual(createSessionWithAnswer());
  });

  it('저장본을 지우면 다시 읽히지 않는다', () => {
    writeStoredQuizSession(LESSON_ID, PROBLEM_IDS, createSessionWithAnswer());
    clearStoredQuizSession(LESSON_ID);

    expect(readStoredQuizSession(LESSON_ID, PROBLEM_IDS)).toBeUndefined();
  });

  it('저장본 JSON이 깨졌으면 예외 대신 undefined를 반환한다', () => {
    window.sessionStorage.setItem('gravit.quiz-session.7', '{ 깨진 JSON');

    expect(() => readStoredQuizSession(LESSON_ID, PROBLEM_IDS)).not.toThrow();
    expect(readStoredQuizSession(LESSON_ID, PROBLEM_IDS)).toBeUndefined();
  });
});
