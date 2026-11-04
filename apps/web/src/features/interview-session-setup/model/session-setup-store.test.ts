import { beforeEach, describe, expect, it } from 'vitest';

import { useSessionSetupStore } from './session-setup-store';

const ALL_TOPICS = [
  'DATA_STRUCTURE',
  'ALGORITHM',
  'DATABASE',
  'OPERATING_SYSTEM',
  'NETWORK',
] as const;

function getState() {
  return useSessionSetupStore.getState();
}

beforeEach(() => {
  getState().reset();
});

describe('useSessionSetupStore', () => {
  it('같은 답변 방식을 다시 고르면 선택이 풀린다 (AC-1)', () => {
    getState().selectInputType('VOICE');
    expect(getState().inputType).toBe('VOICE');

    getState().selectInputType('VOICE');
    expect(getState().inputType).toBeNull();
  });

  it('다른 답변 방식을 고르면 이전 선택을 대체한다', () => {
    getState().selectInputType('VOICE');
    getState().selectInputType('TEXT');

    expect(getState().inputType).toBe('TEXT');
  });

  it('모드를 바꾸면 분야 · 직군 · 스택이 비워지고 답변 방식 · 난이도는 유지된다 (AC-2)', () => {
    getState().selectInputType('TEXT');
    getState().selectDifficulty('NORMAL');
    getState().selectMode('COMMON_CS');
    getState().toggleTopic('ALGORITHM');
    getState().toggleTopic('NETWORK');

    getState().selectMode('JOB_SPECIFIC');

    expect(getState()).toMatchObject({
      inputType: 'TEXT',
      mode: 'JOB_SPECIFIC',
      topics: [],
      stackGroup: null,
      stack: null,
      difficulty: 'NORMAL',
    });
  });

  it('직군을 바꾸면 스택이 비워진다 (AC-6)', () => {
    getState().selectStackGroup('SERVER');
    getState().selectStack('JAVA_SPRING_BOOT');

    getState().selectStackGroup('WEB');

    expect(getState().stackGroup).toBe('WEB');
    expect(getState().stack).toBeNull();
  });

  it('분야는 개별로 토글된다', () => {
    getState().toggleTopic('ALGORITHM');
    getState().toggleTopic('NETWORK');
    getState().toggleTopic('ALGORITHM');

    expect(getState().topics).toEqual(['NETWORK']);
  });

  it('분야가 일부만 선택돼 있으면 전체 선택은 모두 선택한다 (AC-4)', () => {
    getState().toggleTopic('ALGORITHM');

    getState().toggleAllTopics(ALL_TOPICS);

    expect(getState().topics).toEqual([...ALL_TOPICS]);
  });

  it('모두 선택된 상태에서 전체 선택을 누르면 모두 해제된다 (AC-3)', () => {
    ALL_TOPICS.forEach((topic) => getState().toggleTopic(topic));

    getState().toggleAllTopics(ALL_TOPICS);

    expect(getState().topics).toEqual([]);
  });

  it('preselectStack 은 이미 선택된 스택을 해제하지 않는다', () => {
    getState().preselectStack('SWIFT_SWIFTUI');
    getState().preselectStack('SWIFT_SWIFTUI');

    expect(getState().stack).toBe('SWIFT_SWIFTUI');
  });

  it('reset 하면 모든 선택이 비워진다', () => {
    getState().selectInputType('VOICE');
    getState().selectMode('COMMON_CS');
    getState().toggleTopic('ALGORITHM');

    getState().reset();

    expect(getState()).toMatchObject({ inputType: null, mode: null, topics: [] });
  });
});
