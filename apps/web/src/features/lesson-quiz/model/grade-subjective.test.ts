import { describe, expect, it } from 'vitest';

import { gradeSubjective } from './grade-subjective';

describe('gradeSubjective', () => {
  it('앞뒤 공백과 대소문자를 무시하고 일치하면 true를 반환한다', () => {
    expect(gradeSubjective(['DFS', '깊이 우선 탐색'], '  dfs  ')).toBe(true);
  });

  it('가운데 띄어쓰기가 다르면 false를 반환한다', () => {
    expect(gradeSubjective(['투 포인터'], '투포인터')).toBe(false);
  });

  it('부분만 일치하면 false를 반환한다', () => {
    expect(gradeSubjective(['스택 오버플로'], '스택')).toBe(false);
  });

  it('공백만 입력하면 false를 반환한다', () => {
    expect(gradeSubjective(['DFS'], '   ')).toBe(false);
  });

  it('정답이 여러 개면 그중 하나만 맞아도 true를 반환한다', () => {
    expect(gradeSubjective(['DFS', '깊이 우선 탐색'], '깊이 우선 탐색')).toBe(true);
  });

  it('정답 목록이 비어 있으면 false를 반환한다', () => {
    expect(gradeSubjective([], 'DFS')).toBe(false);
  });
});
