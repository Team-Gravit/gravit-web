import type {
  InterviewDifficulty,
  InterviewInputType,
  InterviewMode,
  InterviewSessionCreateRequest,
  InterviewStack,
  InterviewStackGroup,
  InterviewStackResponse,
  InterviewTopic,
} from '@/entities/interview';

/**
 * 면접 세션 생성 전, 사용자 선택과 단계 이동을 판단하는 순수 함수 모음.
 *
 * 공통 흐름: 답변 방식(answer-type) → 면접 유형(topic)
 * - COMMON_CS: CS 분야(cs-topics) → 난이도(difficulty) → 확인(confirm)
 * - JOB_SPECIFIC: 직군(job) → 기술 스택(stack) → 난이도(difficulty) → 확인(confirm)
 *
 * 이동할 단계 계산, 현재 선택의 완료 여부, 단계 진입 가능 여부를 각각 구분한다.
 * 실제 화면 이동과 선택 상태 변경은 호출하는 쪽에서 처리한다.
 */

/** 모든 유효한 단계 식별자. 실제 이동 순서는 선택한 모드에 따라 getStepPath에서 정한다. */
export const SESSION_SETUP_STEPS = [
  'answer-type',
  'topic',
  'cs-topics',
  'job',
  'stack',
  'difficulty',
  'confirm',
] as const;

export type SessionSetupStep = (typeof SESSION_SETUP_STEPS)[number];

/**
 * 세션 생성 전까지 누적하는 선택 초안. null과 빈 topics는 아직 선택하지 않은 상태다.
 * COMMON_CS는 topics를, JOB_SPECIFIC은 stackGroup과 stack을 사용한다.
 * stackGroup은 스택 목록을 좁히는 화면용 선택이며, 생성 요청에는 stack만 전달한다.
 */
export interface SessionSetupDraft {
  inputType: InterviewInputType | null;
  mode: InterviewMode | null;
  topics: InterviewTopic[];
  stackGroup: InterviewStackGroup | null;
  stack: InterviewStack | null;
  difficulty: InterviewDifficulty | null;
}

export interface SessionSetupProgress {
  labels: readonly string[];
  /** 전체 단계 목록이 아닌, 현재 모드의 labels 안에서의 위치(0부터 시작). */
  currentIndex: number;
}

const CS_PROGRESS_LABELS = ['분야 선택', '난이도 선택'] as const;
const JOB_PROGRESS_LABELS = ['직군 선택', '스택 선택', '난이도 선택'] as const;

/** URL 등에서 받은 문자열이 유효한 단계 이름인지 검사한다. 현재 초안으로 진입 가능한지는 별도다. */
export function isSessionSetupStep(value: string): value is SessionSetupStep {
  return (SESSION_SETUP_STEPS as readonly string[]).includes(value);
}

/** 모드에 따라 갈라지는 단계 순서. 모드를 고르기 전에는 주제 선택까지만 정해진다. */
function getStepPath(mode: InterviewMode | null): readonly SessionSetupStep[] {
  if (mode === 'COMMON_CS') {
    return ['answer-type', 'topic', 'cs-topics', 'difficulty', 'confirm'];
  }
  if (mode === 'JOB_SPECIFIC') {
    return ['answer-type', 'topic', 'job', 'stack', 'difficulty', 'confirm'];
  }
  return ['answer-type', 'topic'];
}

/**
 * 현재 모드의 흐름에서 바로 앞 단계를 찾는다. 선택 완료 여부는 검사하지 않는다.
 * 첫 단계이거나 현재 모드에 속하지 않는 단계면 null을 반환한다.
 */
export function getPreviousStep(
  step: SessionSetupStep,
  mode: InterviewMode | null,
): SessionSetupStep | null {
  const path = getStepPath(mode);
  const index = path.indexOf(step);

  if (index <= 0) {
    return null;
  }
  return path[index - 1] ?? null;
}

/**
 * 현재 모드의 흐름에서 바로 다음 단계를 찾는다. 선택 완료 여부는 canProceed로 따로 검사한다.
 * 마지막 단계이거나 현재 모드에 속하지 않는 단계면 null을 반환한다.
 * 모드가 없어도 answer-type → topic은 가능하며, topic 이후부터 모드 선택이 필요하다.
 *
 * @example getNextStep('topic', 'COMMON_CS') // 'cs-topics'
 * @example getNextStep('topic', 'JOB_SPECIFIC') // 'job'
 */
export function getNextStep(
  step: SessionSetupStep,
  mode: InterviewMode | null,
): SessionSetupStep | null {
  const path = getStepPath(mode);
  const index = path.indexOf(step);

  if (index === -1) {
    return null;
  }
  return path[index + 1] ?? null;
}

/**
 * 현재 단계의 필수 선택이 끝났는지 판단한다. 「다음」 버튼의 활성화 조건으로 사용한다.
 * 앞 단계의 완료 여부와 현재 모드에 속하는지는 검사하지 않으므로 진입 검증에는 isStepReachable을 쓴다.
 * confirm에서는 「시작」할 수 있도록 세션 생성 요청을 구성할 수 있는지 검사한다.
 */
export function canProceed(step: SessionSetupStep, draft: SessionSetupDraft): boolean {
  switch (step) {
    case 'answer-type':
      return draft.inputType !== null;
    case 'topic':
      return draft.mode !== null;
    case 'cs-topics':
      return draft.topics.length > 0;
    case 'job':
      return draft.stackGroup !== null;
    case 'stack':
      return draft.stack !== null;
    case 'difficulty':
      return draft.difficulty !== null;
    case 'confirm':
      return buildCreateSessionRequest(draft) !== null;
  }
}

/**
 * 현재 모드에 속하고, 그 앞의 모든 단계에서 필수 선택을 마쳤을 때만 진입을 허용한다.
 * 현재 단계의 선택은 비어 있어도 된다. 예를 들어 분야를 골랐다면 난이도 선택 전에도 difficulty에 진입한다.
 * 새로고침이나 주소 직접 입력으로 중간 단계의 선행 선택을 건너뛰는 것을 막는 데 사용한다.
 * 첫 단계인 answer-type은 선행 단계가 없어 항상 진입할 수 있다.
 */
export function isStepReachable(step: SessionSetupStep, draft: SessionSetupDraft): boolean {
  const path = getStepPath(draft.mode);
  const index = path.indexOf(step);

  if (index === -1) {
    return false;
  }
  return path.slice(0, index).every((previousStep) => canProceed(previousStep, draft));
}

/**
 * 모드별 세부 선택 단계만 진행 바에 표시한다. 공통 단계(answer-type, topic)와 confirm은 null이다.
 * currentIndex는 표시할 labels의 인덱스다. JOB_SPECIFIC의 difficulty는 2로, 세 번째 항목을 뜻한다.
 * 현재 모드에 속하지 않는 단계나 모드 미선택 상태에서도 null을 반환한다.
 */
export function getProgress(
  step: SessionSetupStep,
  mode: InterviewMode | null,
): SessionSetupProgress | null {
  if (mode === 'COMMON_CS') {
    const index = ['cs-topics', 'difficulty'].indexOf(step);
    return index === -1 ? null : { labels: CS_PROGRESS_LABELS, currentIndex: index };
  }
  if (mode === 'JOB_SPECIFIC') {
    const index = ['job', 'stack', 'difficulty'].indexOf(step);
    return index === -1 ? null : { labels: JOB_PROGRESS_LABELS, currentIndex: index };
  }
  return null;
}

/**
 * 현재 제공되는 분야가 모두 선택됐는지 계산해 「전체 선택」 표시와 토글에 사용한다.
 * 별도 상태로 저장하지 않아 개별 분야를 선택·해제해도 표시가 함께 갱신된다.
 * 제공되는 분야가 없으면 false이며, 선택 목록에 추가 항목이 있어도 제공된 분야를 모두 포함하면 true다.
 */
export function isAllTopicsSelected(
  selectedTopics: readonly InterviewTopic[],
  availableTopics: readonly InterviewTopic[],
): boolean {
  return (
    availableTopics.length > 0 && availableTopics.every((topic) => selectedTopics.includes(topic))
  );
}

/**
 * 조회된 스택이 정확히 하나일 때 자동 선택할 후보를 반환한다. 없거나 여러 개면 null이다.
 * 직군 이름에 의존하지 않고 목록 개수로 판단하며, 실제 선택 상태 변경은 호출하는 쪽에서 처리한다.
 */
export function getOnlyStack(stacks: readonly InterviewStackResponse[]): InterviewStack | null {
  if (stacks.length !== 1) {
    return null;
  }
  return stacks[0]?.stack ?? null;
}

/**
 * 초안을 세션 생성 API의 요청으로 변환한다. 모드·답변 방식·난이도와 모드별 필수 선택이 없으면 null이다.
 * COMMON_CS는 topics만, JOB_SPECIFIC은 stack만 담아 다른 모드의 선택이 요청에 섞이지 않게 한다.
 * stackGroup은 화면용 값이므로 제외하고, topics는 복사해 초안 배열과 분리한다.
 * 단계 진입 조건과 스택의 직군 소속은 이 함수의 검증 범위에 포함하지 않는다.
 */
export function buildCreateSessionRequest(
  draft: SessionSetupDraft,
): InterviewSessionCreateRequest | null {
  const { inputType, mode, difficulty, topics, stack } = draft;

  if (inputType === null || difficulty === null) {
    return null;
  }
  if (mode === 'COMMON_CS' && topics.length > 0) {
    return { inputType, mode, difficulty, topics: [...topics] };
  }
  if (mode === 'JOB_SPECIFIC' && stack !== null) {
    return { inputType, mode, difficulty, stack };
  }
  return null;
}
