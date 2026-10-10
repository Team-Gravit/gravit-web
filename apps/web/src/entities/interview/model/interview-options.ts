import type { getStacks } from '@/shared/api/generated/interview-stack-group-api/interview-stack-group-api';
import type {
  InterviewSessionCreateRequestDifficulty,
  InterviewSessionCreateRequestInputType,
  InterviewSessionCreateRequestMode,
  InterviewSessionCreateRequestStack,
  InterviewSessionCreateRequestTopicsItem,
} from '@/shared/api/generated/model';

export type InterviewInputType = InterviewSessionCreateRequestInputType;
export type InterviewMode = InterviewSessionCreateRequestMode;
export type InterviewDifficulty = InterviewSessionCreateRequestDifficulty;
export type InterviewStack = InterviewSessionCreateRequestStack;
export type InterviewTopic = InterviewSessionCreateRequestTopicsItem;
// 직군 그룹은 별도 모델 없이 경로 파라미터 타입으로만 생성된다.
export type InterviewStackGroup = Parameters<typeof getStacks>[0];

export const INTERVIEW_INPUT_TYPE_LABEL: Record<InterviewInputType, string> = {
  VOICE: '음성 모드',
  TEXT: '텍스트 모드',
};

export const INTERVIEW_MODE_LABEL: Record<InterviewMode, string> = {
  COMMON_CS: 'CS 개념 모드',
  JOB_SPECIFIC: '직군별 특화 모드',
};

export const INTERVIEW_DIFFICULTY_LABEL: Record<InterviewDifficulty, string> = {
  HARD: '상',
  NORMAL: '중',
  EASY: '하',
};

// API displayName(Server · Web · AOS · iOS) 대신 Figma 문구를 쓴다 (FEAT-055 Q4).
export const INTERVIEW_STACK_GROUP_LABEL: Record<InterviewStackGroup, string> = {
  SERVER: '백엔드',
  WEB: '프론트엔드',
  AOS: '안드로이드',
  IOS: 'iOS',
};
