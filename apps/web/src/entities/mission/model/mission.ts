import type { MissionDetailResponse } from '@/shared/api/generated/model';

import { getMissionRoute, type MissionRoute } from './mission-route';

export interface DailyMission {
  description: string;
  awardXp: number;
  /** 화면과 게이지가 사용하는 0~100 퍼센트. */
  progressPercent: number;
  isCompleted: boolean;
  route: MissionRoute;
}

/**
 * API 명세에 단위가 없어 legacy와 같이 0~1로 가정한다.
 * 실제 응답이 0~100이면 이 변환에서 곱셈을 제거한다.
 */
export function toMissionProgressPercent(progressRate: number): number {
  return Math.round(progressRate * 100);
}

export function toDailyMission(response: MissionDetailResponse): DailyMission {
  return {
    description: response.missionDescription,
    awardXp: response.awardXp,
    progressPercent: toMissionProgressPercent(response.progressRate),
    isCompleted: response.isCompleted,
    route: getMissionRoute(response.missionType),
  };
}
