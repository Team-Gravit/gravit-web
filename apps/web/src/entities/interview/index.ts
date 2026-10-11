export { useCsTopics } from './api/use-cs-topics';
export { useInterviewStacks, usePrefetchInterviewStacks } from './api/use-interview-stacks';
export {
  INTERVIEW_DIFFICULTY_LABEL,
  INTERVIEW_INPUT_TYPE_LABEL,
  INTERVIEW_MODE_LABEL,
  INTERVIEW_STACK_GROUP_LABEL,
  type InterviewDifficulty,
  type InterviewInputType,
  type InterviewMode,
  type InterviewStack,
  type InterviewStackGroup,
  type InterviewTopic,
} from './model/interview-options';

// 생성 타입을 도메인 경계에서 노출한다. 화면은 generated 경로를 직접 참조하지 않는다.
export type {
  InterviewSessionCreateRequest,
  InterviewStackResponse,
  InterviewTopicResponse,
} from '@/shared/api/generated/model';
