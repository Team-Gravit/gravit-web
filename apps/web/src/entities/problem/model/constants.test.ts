import { describe, expect, it } from 'vitest';

import { INCORRECT_ANSWER_MESSAGE, toIncorrectSubjectiveMessage } from './constants';

describe('toIncorrectSubjectiveMessage', () => {
  it("정답이 하나면 '❌ 정답: DFS'를 반환한다", () => {
    expect(toIncorrectSubjectiveMessage(['DFS'])).toBe('❌ 정답: DFS');
  });

  it('정답이 여러 개면 모두 열거한다', () => {
    expect(toIncorrectSubjectiveMessage(['DFS', '깊이 우선 탐색'])).toBe(
      '❌ 정답: DFS, 깊이 우선 탐색',
    );
  });

  it('알려줄 정답이 없으면 오답이라는 사실만 전한다', () => {
    expect(toIncorrectSubjectiveMessage([])).toBe(INCORRECT_ANSWER_MESSAGE);
  });
});
