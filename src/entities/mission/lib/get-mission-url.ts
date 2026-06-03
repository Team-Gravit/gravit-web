import type { MissionName } from '@/shared/config/constants';
import { MISSION_LABEL_MAP } from '@/shared/config/constants';

export type MissionRoutePath = '/learning' | '/user/addfriend';

const MISSION_URL_MAP = {
  COMPLETE_LESSON_ONE: '/learning',
  COMPLETE_LESSONS_TWO: '/learning',
  COMPLETE_LESSONS_THREE: '/learning',
  PERFECT_LESSON_ONE: '/learning',
  PERFECT_LESSONS_TWO: '/learning',
  PERFECT_LESSONS_THREE: '/learning',
  LEARNING_MINUTES_FIVE: '/learning',
  LEARNING_MINUTES_TEN: '/learning',
  LEARNING_MINUTES_FIFTEEN: '/learning',
  FOLLOW_NEW_FRIEND: '/user/addfriend',
} as const satisfies Record<MissionName, MissionRoutePath>;

export const isMissionName = (name: string): name is MissionName => name in MISSION_LABEL_MAP;

export const getMissionUrl = (missionType: string): MissionRoutePath =>
  isMissionName(missionType) ? MISSION_URL_MAP[missionType] : '/learning';
