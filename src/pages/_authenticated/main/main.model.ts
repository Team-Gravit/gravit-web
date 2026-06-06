import {
  toLearningDetail,
  toRecommendedUnit,
  toWeeklyLearningRecord,
} from '@/entities/learning/model/schema';
import { getMissionUrl } from '@/entities/mission/lib/get-mission-url';
import { toMissionDetail } from '@/entities/mission/model/schema';
import type { MainPageResponse } from '@/shared/api/@generated';

export const toMainPageViewModel = (data: MainPageResponse) => ({
  progress: {
    nickname: data.nickname ?? '',
    profileImgNumber: data.profileImgNumber ?? 0,
    level: data.userLevelDetailResponse?.level ?? 1,
    currentXp: data.userLevelDetailResponse?.currentXp ?? 0,
    maxXp: data.userLevelDetailResponse?.maxXp ?? 100,
    levelRate: data.userLevelDetailResponse?.levelRate ?? 0,
    leagueId: data.leagueDetailResponse?.leagueId ?? 0,
    leagueName: data.leagueDetailResponse?.leagueName ?? '',
    currentLP: data.leagueDetailResponse?.currentLP ?? 0,
    maxLP: data.leagueDetailResponse?.maxLP ?? 100,
  },
  streak: {
    weeklyRecord: data.weeklyLearningRecordResponse
      ? toWeeklyLearningRecord(data.weeklyLearningRecordResponse)
      : undefined,
    consecutiveSolvedDays: data.learningDetailResponse?.consecutiveSolvedDays ?? 0,
  },
  units: {
    chapterId: data.learningDetailResponse?.recentSolvedChapterId ?? 0,
    chapterTitle: data.learningDetailResponse?.recentSolvedChapterTitle ?? '',
    chapterProgressRate: data.learningDetailResponse?.recentSolvedChapterProgressRate ?? 0,
    items: data.learningDetailResponse ? toLearningDetail(data.learningDetailResponse).units : [],
  },
  recommendedUnits: data.recommendedUnitResponses?.map(toRecommendedUnit) ?? [],
  mission: data.missionDetailResponse
    ? {
        ...toMissionDetail(data.missionDetailResponse),
        url: getMissionUrl(data.missionDetailResponse.missionType ?? ''),
      }
    : undefined,
});

export type MainPageViewModel = ReturnType<typeof toMainPageViewModel>;
