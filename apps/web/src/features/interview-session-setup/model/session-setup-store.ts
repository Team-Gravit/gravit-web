import { create } from 'zustand';

import type {
  InterviewDifficulty,
  InterviewInputType,
  InterviewMode,
  InterviewStack,
  InterviewStackGroup,
  InterviewTopic,
} from '@/entities/interview';

import {
  isAllTopicsSelected,
  isStepReachable,
  type SessionSetupDraft,
  type SessionSetupStep,
} from './session-setup-rules';

/**
 * 선택 초안과 이를 변경하는 액션.
 * select*는 하나만 고르는 카드용으로, 같은 값을 다시 고르면 선택을 해제한다.
 * CS 분야는 여러 개를 고를 수 있어 toggleTopic과 toggleAllTopics로 따로 다룬다.
 */
interface SessionSetupState extends SessionSetupDraft {
  selectInputType: (inputType: InterviewInputType) => void;
  selectMode: (mode: InterviewMode) => void;
  toggleTopic: (topic: InterviewTopic) => void;
  /** 제공된 분야가 모두 선택됐으면 전체 해제하고, 일부만 선택됐으면 제공된 목록 전체로 대체한다. */
  toggleAllTopics: (availableTopics: readonly InterviewTopic[]) => void;
  selectStackGroup: (stackGroup: InterviewStackGroup) => void;
  selectStack: (stack: InterviewStack) => void;
  /** 스택이 하나일 때의 자동 선택용. 같은 값으로 다시 호출해도 선택을 유지한다. */
  preselectStack: (stack: InterviewStack) => void;
  selectDifficulty: (difficulty: InterviewDifficulty) => void;
  reset: () => void;
}

const INITIAL_DRAFT: SessionSetupDraft = {
  inputType: null,
  mode: null,
  topics: [],
  stackGroup: null,
  stack: null,
  difficulty: null,
};

// 선택된 카드를 다시 누르면 해제하고, 다른 카드를 누르면 선택을 교체한다.
function toggleSingleSelection<T>(currentSelection: T | null, nextSelection: T): T | null {
  return currentSelection === nextSelection ? null : nextSelection;
}

/**
 * 답변 방식부터 최종 확인까지, 여러 단계 화면에서 이어서 사용하는 선택 초안.
 * 단계 사이를 이동해도 유지되며, 영구 저장하지 않아 새로고침하면 초기화된다.
 * `/interview/new` 흐름을 벗어날 때는 라우트에서 resetSessionSetup을 호출한다.
 *
 * 모드를 선택·해제하면 분야·직군·스택을 비우고, 직군을 선택·해제하면 스택을 비운다.
 * 답변 방식과 난이도는 두 모드에서 공통으로 사용하므로 모드 선택을 바꿔도 유지한다.
 */
export const useSessionSetupStore = create<SessionSetupState>((set) => ({
  ...INITIAL_DRAFT,
  selectInputType: (inputType) =>
    set((state) => ({ inputType: toggleSingleSelection(state.inputType, inputType) })),
  selectMode: (mode) =>
    set((state) => ({
      mode: toggleSingleSelection(state.mode, mode),
      topics: [],
      stackGroup: null,
      stack: null,
    })),
  toggleTopic: (topic) =>
    set((state) => ({
      topics: state.topics.includes(topic)
        ? state.topics.filter((selectedTopic) => selectedTopic !== topic)
        : [...state.topics, topic],
    })),
  toggleAllTopics: (availableTopics) =>
    set((state) => ({
      topics: isAllTopicsSelected(state.topics, availableTopics) ? [] : [...availableTopics],
    })),
  selectStackGroup: (stackGroup) =>
    set((state) => ({
      stackGroup: toggleSingleSelection(state.stackGroup, stackGroup),
      stack: null,
    })),
  selectStack: (stack) => set((state) => ({ stack: toggleSingleSelection(state.stack, stack) })),
  preselectStack: (stack) => set({ stack }),
  selectDifficulty: (difficulty) =>
    set((state) => ({ difficulty: toggleSingleSelection(state.difficulty, difficulty) })),
  reset: () => set(INITIAL_DRAFT),
}));

/**
 * 라우트 진입 시 최신 초안으로 선행 단계의 선택 완료 여부를 검사한다.
 * React 밖에서도 호출할 수 있도록 훅 구독 대신 getState로 현재 상태를 읽는다.
 */
export function canEnterSessionSetupStep(step: SessionSetupStep): boolean {
  return isStepReachable(step, useSessionSetupStore.getState());
}

/** 설정 흐름을 벗어날 때 모든 선택을 비운다. 다음 진입에서 이전 초안이 남지 않게 한다. */
export function resetSessionSetup(): void {
  useSessionSetupStore.getState().reset();
}
