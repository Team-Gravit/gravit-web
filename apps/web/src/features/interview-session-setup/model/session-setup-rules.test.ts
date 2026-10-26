import { describe, expect, it } from 'vitest';

import {
  buildCreateSessionRequest,
  canProceed,
  getNextStep,
  getOnlyStack,
  getPreviousStep,
  getProgress,
  isAllTopicsSelected,
  isSessionSetupStep,
  isStepReachable,
  type SessionSetupDraft,
} from './session-setup-rules';

const EMPTY_DRAFT: SessionSetupDraft = {
  inputType: null,
  mode: null,
  topics: [],
  stackGroup: null,
  stack: null,
  difficulty: null,
};

const CS_DRAFT: SessionSetupDraft = {
  ...EMPTY_DRAFT,
  inputType: 'VOICE',
  mode: 'COMMON_CS',
  topics: ['DATA_STRUCTURE', 'NETWORK'],
  difficulty: 'HARD',
};

const JOB_DRAFT: SessionSetupDraft = {
  ...EMPTY_DRAFT,
  inputType: 'TEXT',
  mode: 'JOB_SPECIFIC',
  stackGroup: 'SERVER',
  stack: 'JAVA_SPRING_BOOT',
  difficulty: 'EASY',
};

describe('isSessionSetupStep', () => {
  it('정의된 단계만 true 다', () => {
    expect(isSessionSetupStep('cs-topics')).toBe(true);
    expect(isSessionSetupStep('unknown')).toBe(false);
  });
});

describe('getNextStep · getPreviousStep (AC-7)', () => {
  it('주제 화면의 다음은 COMMON_CS 면 cs-topics, JOB_SPECIFIC 이면 job 이다', () => {
    expect(getNextStep('topic', 'COMMON_CS')).toBe('cs-topics');
    expect(getNextStep('topic', 'JOB_SPECIFIC')).toBe('job');
  });

  it('모드를 고르기 전에는 주제 화면의 다음이 없다', () => {
    expect(getNextStep('topic', null)).toBeNull();
  });

  it('난이도 화면의 이전은 COMMON_CS 면 cs-topics, JOB_SPECIFIC 이면 stack 이다', () => {
    expect(getPreviousStep('difficulty', 'COMMON_CS')).toBe('cs-topics');
    expect(getPreviousStep('difficulty', 'JOB_SPECIFIC')).toBe('stack');
  });

  it('직군 모드는 job → stack → difficulty → confirm 순서다', () => {
    expect(getNextStep('job', 'JOB_SPECIFIC')).toBe('stack');
    expect(getNextStep('stack', 'JOB_SPECIFIC')).toBe('difficulty');
    expect(getNextStep('difficulty', 'JOB_SPECIFIC')).toBe('confirm');
    expect(getPreviousStep('job', 'JOB_SPECIFIC')).toBe('topic');
  });

  it('첫 단계의 이전과 마지막 단계의 다음은 없다', () => {
    expect(getPreviousStep('answer-type', null)).toBeNull();
    expect(getNextStep('confirm', 'COMMON_CS')).toBeNull();
  });
});

describe('getProgress (AC-8)', () => {
  it('COMMON_CS 는 2단계, cs-topics 가 첫 번째다', () => {
    expect(getProgress('cs-topics', 'COMMON_CS')).toEqual({
      labels: ['분야 선택', '난이도 선택'],
      currentIndex: 0,
    });
  });

  it('JOB_SPECIFIC 은 3단계, difficulty 가 세 번째다', () => {
    expect(getProgress('difficulty', 'JOB_SPECIFIC')).toEqual({
      labels: ['직군 선택', '스택 선택', '난이도 선택'],
      currentIndex: 2,
    });
  });

  it('답변 방식 · 주제 · 확인 단계에는 진행 바가 없다', () => {
    expect(getProgress('answer-type', null)).toBeNull();
    expect(getProgress('topic', 'COMMON_CS')).toBeNull();
    expect(getProgress('confirm', 'JOB_SPECIFIC')).toBeNull();
  });
});

describe('canProceed', () => {
  it('답변 방식을 고르지 않으면 answer-type 에서 다음으로 갈 수 없다', () => {
    expect(canProceed('answer-type', EMPTY_DRAFT)).toBe(false);
    expect(canProceed('answer-type', { ...EMPTY_DRAFT, inputType: 'VOICE' })).toBe(true);
  });

  it('분야를 하나 이상 골라야 cs-topics 에서 다음으로 갈 수 있다', () => {
    expect(canProceed('cs-topics', { ...CS_DRAFT, topics: [] })).toBe(false);
    expect(canProceed('cs-topics', CS_DRAFT)).toBe(true);
  });
});

describe('isStepReachable (AC-12)', () => {
  it('초안이 비어 있으면 answer-type 만 도달할 수 있다', () => {
    expect(isStepReachable('answer-type', EMPTY_DRAFT)).toBe(true);
    expect(isStepReachable('topic', EMPTY_DRAFT)).toBe(false);
    expect(isStepReachable('difficulty', EMPTY_DRAFT)).toBe(false);
  });

  it('현재 모드의 경로에 없는 단계는 도달할 수 없다', () => {
    expect(isStepReachable('stack', CS_DRAFT)).toBe(false);
    expect(isStepReachable('cs-topics', JOB_DRAFT)).toBe(false);
  });

  it('앞 단계 선택을 모두 마쳤으면 confirm 에 도달할 수 있다', () => {
    expect(isStepReachable('confirm', CS_DRAFT)).toBe(true);
    expect(isStepReachable('confirm', JOB_DRAFT)).toBe(true);
    expect(isStepReachable('confirm', { ...JOB_DRAFT, difficulty: null })).toBe(false);
  });
});

describe('isAllTopicsSelected (AC-3)', () => {
  const available = ['DATA_STRUCTURE', 'ALGORITHM'] as const;

  it('선택 가능한 분야를 모두 고르면 true 다', () => {
    expect(isAllTopicsSelected(['ALGORITHM', 'DATA_STRUCTURE'], available)).toBe(true);
    expect(isAllTopicsSelected(['ALGORITHM'], available)).toBe(false);
  });

  it('선택 가능한 분야가 없으면 false 다', () => {
    expect(isAllTopicsSelected([], [])).toBe(false);
  });
});

describe('getOnlyStack (AC-5)', () => {
  it('스택이 하나면 그 스택을, 아니면 null 을 반환한다', () => {
    expect(getOnlyStack([{ stack: 'KOTLIN_COMPOSE', displayName: 'Kotlin + Compose' }])).toBe(
      'KOTLIN_COMPOSE',
    );
    expect(
      getOnlyStack([
        { stack: 'TS_REACT', displayName: 'React' },
        { stack: 'TS_VUE', displayName: 'Vue' },
      ]),
    ).toBeNull();
  });
});

describe('buildCreateSessionRequest (AC-9)', () => {
  it('COMMON_CS 는 topics 만 담고 stack 키가 없다', () => {
    expect(buildCreateSessionRequest(CS_DRAFT)).toStrictEqual({
      inputType: 'VOICE',
      mode: 'COMMON_CS',
      difficulty: 'HARD',
      topics: ['DATA_STRUCTURE', 'NETWORK'],
    });
  });

  it('JOB_SPECIFIC 은 stack 만 담고 topics 키가 없다', () => {
    expect(buildCreateSessionRequest(JOB_DRAFT)).toStrictEqual({
      inputType: 'TEXT',
      mode: 'JOB_SPECIFIC',
      difficulty: 'EASY',
      stack: 'JAVA_SPRING_BOOT',
    });
  });

  it('필수값이 하나라도 없으면 null 이다', () => {
    expect(buildCreateSessionRequest({ ...CS_DRAFT, inputType: null })).toBeNull();
    expect(buildCreateSessionRequest({ ...CS_DRAFT, topics: [] })).toBeNull();
    expect(buildCreateSessionRequest({ ...JOB_DRAFT, stack: null })).toBeNull();
    expect(buildCreateSessionRequest({ ...JOB_DRAFT, difficulty: null })).toBeNull();
  });
});
