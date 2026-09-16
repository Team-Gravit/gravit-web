import { setupWorker } from 'msw/browser';

import { getOauth20ApiMock } from '../generated/mocks/index.msw';
import { getGetAllLessonInUnitMockHandler } from '../generated/mocks/lesson-api/lesson-api.msw';
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

/**
 * 유닛 상세 시나리오 — 시안(LRN-03)의 예시 값을 그대로 돌려준다.
 * 레슨 상태 칩 두 가지가 모두 보이도록 `isSolved`를 섞어 둔다.
 */
const unitDetailHandlers = [
  getGetAllLessonInUnitMockHandler({
    chapterSummary: { chapterId: 3, title: '자료구조' },
    unitSummaryResponse: {
      unitId: 1,
      title: '리스트',
      description: '리스트에 대한 설명글을 작성해주세요.',
    },
    bookmarkAccessible: true,
    wrongAnsweredNoteAccessible: true,
    unitId: 1,
    lessonSummaries: [
      { lessonId: 1, title: 'Lesson01', totalProblem: 10, isSolved: false },
      { lessonId: 2, title: 'Lesson02', totalProblem: 10, isSolved: true },
      { lessonId: 3, title: 'Lesson03', totalProblem: 10, isSolved: false },
      { lessonId: 4, title: 'Lesson04', totalProblem: 10, isSolved: false },
      { lessonId: 5, title: 'Lesson05', totalProblem: 10, isSolved: true },
      { lessonId: 6, title: 'Lesson06', totalProblem: 10, isSolved: false },
      { lessonId: 7, title: 'Lesson07', totalProblem: 10, isSolved: true },
    ],
  }),
];

export const worker = setupWorker(
  ...getOauth20ApiMock(),
  ...mainPageHandlers,
  ...unitDetailHandlers,
);
