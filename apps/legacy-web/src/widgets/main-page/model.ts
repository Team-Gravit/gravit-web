import {
  toLearningDetail,
  toRecommendedUnit,
  toWeeklyLearningRecord,
} from '@/entities/learning/model/schema';
import { getMissionUrl } from '@/entities/mission/lib/get-mission-url';
import { toMissionDetail } from '@/entities/mission/model/schema';
import type { LeagueDetailResponse } from '@/shared/api/@generated/model/leagueDetailResponse';
import type { LearningDetailResponse } from '@/shared/api/@generated/model/learningDetailResponse';
import type { MissionDetailResponse } from '@/shared/api/@generated/model/missionDetailResponse';
import type { ProfileSummaryResponse } from '@/shared/api/@generated/model/profileSummaryResponse';
import type { RecommendedUnitResponse } from '@/shared/api/@generated/model/recommendedUnitResponse';
import type { WeeklyLearningRecordResponse } from '@/shared/api/@generated/model/weeklyLearningRecordResponse';

export const toProfileViewModel = (profile: ProfileSummaryResponse) => ({
  nickname: profile.nickname ?? '',
  profileImgNumber: profile.profileImgNumber ?? 0,
  level: profile.userLevelDetailResponse?.level ?? 1,
  currentXp: profile.userLevelDetailResponse?.currentXp ?? 0,
  maxXp: profile.userLevelDetailResponse?.maxXp ?? 100,
});

export const toLeagueViewModel = (league: LeagueDetailResponse) => ({
  leagueId: league.leagueId ?? 0,
  leagueName: league.leagueName ?? '',
  currentLP: league.currentLP ?? 0,
  maxLP: league.maxLP ?? 100,
});

export const toStreakViewModel = (
  weeklyRecord: WeeklyLearningRecordResponse,
  learning: LearningDetailResponse,
) => ({
  weeklyRecord: toWeeklyLearningRecord(weeklyRecord),
  consecutiveSolvedDays: learning.consecutiveSolvedDays ?? 0,
});

export const toLearningViewModel = (learning: LearningDetailResponse) => ({
  chapterId: learning.recentSolvedChapterId ?? 0,
  chapterTitle: learning.recentSolvedChapterTitle ?? '',
  chapterProgressRate: learning.recentSolvedChapterProgressRate ?? 0,
  items: toLearningDetail(learning).units,
});

export const toRecommendedUnitsViewModel = (units: RecommendedUnitResponse[]) =>
  units.map(toRecommendedUnit);

export const toMissionViewModel = (mission: MissionDetailResponse) => ({
  ...toMissionDetail(mission),
  url: getMissionUrl(mission.missionType ?? ''),
});
