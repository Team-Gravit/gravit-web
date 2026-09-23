import { describe, expect, it } from 'vitest';

import { createInitialQuizSessionState, quizSessionReducer } from './quiz-session';

const STARTED_AT = 1_700_000_000_000;

describe('quizSessionReducer 답안 제출', () => {
  it('submitAnswer 하면 problemId를 키로 답이 기록된다', () => {
    const state = createInitialQuizSessionState(3, STARTED_AT);

    const next = quizSessionReducer(state, {
      type: 'submitAnswer',
      problemId: 101,
      answer: { kind: 'objective', selectedOptionId: 10, isCorrect: true },
    });

    expect(next.answersByProblemId[101]).toEqual({
      kind: 'objective',
      selectedOptionId: 10,
      isCorrect: true,
    });
    expect(Object.keys(next.answersByProblemId)).toHaveLength(1);
  });

  it('이미 제출한 문제에 다시 submitAnswer 하면 첫 제출이 유지된다', () => {
    const submitted = quizSessionReducer(createInitialQuizSessionState(3, STARTED_AT), {
      type: 'submitAnswer',
      problemId: 101,
      answer: { kind: 'objective', selectedOptionId: 10, isCorrect: true },
    });

    const next = quizSessionReducer(submitted, {
      type: 'submitAnswer',
      problemId: 101,
      answer: { kind: 'objective', selectedOptionId: 11, isCorrect: false },
    });

    expect(next.answersByProblemId[101]).toEqual({
      kind: 'objective',
      selectedOptionId: 10,
      isCorrect: true,
    });
    expect(next).toBe(submitted);
  });

  it('startedAt은 제출해도 바뀌지 않는다', () => {
    const state = createInitialQuizSessionState(3, STARTED_AT);

    const next = quizSessionReducer(state, {
      type: 'submitAnswer',
      problemId: 101,
      answer: { kind: 'subjective', submittedContent: 'DFS', isCorrect: true },
    });

    expect(next.startedAt).toBe(STARTED_AT);
  });
});

describe('quizSessionReducer 문제 이동', () => {
  it('goToNext 하면 currentProblemIndex가 1 증가한다', () => {
    const next = quizSessionReducer(createInitialQuizSessionState(3, STARTED_AT), {
      type: 'goToNext',
    });

    expect(next.currentProblemIndex).toBe(1);
  });

  it('첫 문제에서 goToPrevious 하면 currentProblemIndex가 0으로 유지된다', () => {
    const state = createInitialQuizSessionState(3, STARTED_AT);

    const next = quizSessionReducer(state, { type: 'goToPrevious' });

    expect(next.currentProblemIndex).toBe(0);
    expect(next).toBe(state);
  });

  it('마지막 문제에서 goToNext 하면 currentProblemIndex가 그대로다', () => {
    const last = quizSessionReducer(
      quizSessionReducer(createInitialQuizSessionState(3, STARTED_AT), { type: 'goToNext' }),
      { type: 'goToNext' },
    );

    const next = quizSessionReducer(last, { type: 'goToNext' });

    expect(next.currentProblemIndex).toBe(2);
    expect(next).toBe(last);
  });

  it('goTo 하면 그 순번으로 가고 답은 그대로다', () => {
    const submitted = quizSessionReducer(createInitialQuizSessionState(3, STARTED_AT), {
      type: 'submitAnswer',
      problemId: 101,
      answer: { kind: 'objective', selectedOptionId: 10, isCorrect: true },
    });
    const moved = quizSessionReducer(submitted, { type: 'goTo', problemIndex: 2 });

    const next = quizSessionReducer(moved, { type: 'goTo', problemIndex: 0 });

    expect(next.currentProblemIndex).toBe(0);
    expect(next.answersByProblemId).toEqual(submitted.answersByProblemId);
  });

  it('범위를 벗어난 goTo는 무시한다', () => {
    const state = createInitialQuizSessionState(3, STARTED_AT);

    expect(quizSessionReducer(state, { type: 'goTo', problemIndex: 3 })).toBe(state);
    expect(quizSessionReducer(state, { type: 'goTo', problemIndex: -1 })).toBe(state);
  });
});
