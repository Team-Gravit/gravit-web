import { setupWorker } from 'msw/browser';

import { getOauth20ApiMock } from '../generated/mocks/index.msw';
import {
  getGetLeagueMockHandler,
  getGetLearningMockHandler,
  getGetMissionMockHandler,
  getGetProfileMockHandler,
  getGetUnitsMockHandler,
  getGetWeeklyRecordMockHandler,
} from '../generated/mocks/mainpage-api/mainpage-api.msw';
import { getGetUserMockHandler } from '../generated/mocks/user-api/user-api.msw';

/**
 * 메인 화면 시나리오 — 시안(MAIN-01)의 예시 값을 그대로 돌려준다.
 * faker 기본값은 매 요청 값이 바뀌고 범위가 무의미해(예: 진행률 3만%) 화면 확인에 쓸 수 없다.
 */
const mainPageHandlers = [
  getGetUserMockHandler({
    userId: 1,
    nickname: '땅콩',
    profileImgNumber: 3,
    providerId: 'mock',
    isOnboarded: true,
  }),
  getGetProfileMockHandler({
    nickname: '땅콩',
    profileImgNumber: 3,
    userLevelDetailResponse: { level: 1, currentXp: 31, maxXp: 99, levelRate: 0.31 },
  }),
  getGetLeagueMockHandler({
    leagueId: 1,
    leagueName: '브론즈 3',
    currentLP: 31,
    minLP: 0,
    maxLP: 99,
  }),
  getGetLearningMockHandler({
    recentSolvedChapterId: 3,
    recentSolvedChapterTitle: '자료구조',
    recentSolvedChapterProgressRate: 10,
    units: [
      { unitId: 1, title: '자료구조', status: 'COMPLETED' },
      { unitId: 2, title: '자료구조', status: 'IN_PROGRESS' },
      { unitId: 3, title: '자료구조', status: 'NOT_STARTED' },
    ],
  }),
  getGetUnitsMockHandler([
    { unitId: 1, unitTitle: '배열', chapterId: 3, chapterTitle: '자료구조' },
    { unitId: 7, unitTitle: '프로세스', chapterId: 5, chapterTitle: '운영체제' },
  ]),
  getGetWeeklyRecordMockHandler({
    consecutiveSolvedDays: 1,
    MONDAY: { dayTiming: 'PAST', isCompleted: true },
    TUESDAY: { dayTiming: 'PAST', isCompleted: true },
    WEDNESDAY: { dayTiming: 'TODAY', isCompleted: true },
    THURSDAY: { dayTiming: 'FUTURE', isCompleted: false },
    FRIDAY: { dayTiming: 'FUTURE', isCompleted: false },
    SATURDAY: { dayTiming: 'FUTURE', isCompleted: false },
    SUNDAY: { dayTiming: 'FUTURE', isCompleted: false },
  }),
  getGetMissionMockHandler({
    missionType: 'COMPLETE_LESSONS_TWO',
    missionDescription: '레슨 4개 완료하기',
    awardXp: 15,
    progressRate: 0.5,
    isCompleted: false,
  }),
];

export const worker = setupWorker(...getOauth20ApiMock(), ...mainPageHandlers);
