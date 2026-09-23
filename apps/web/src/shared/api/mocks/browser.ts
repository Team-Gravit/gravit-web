import { setupWorker } from 'msw/browser';

import {
  getGetFollowAndFollowingCountMockHandler,
  getGetFollowersMockHandler,
  getGetFollowingsMockHandler,
} from '../generated/mocks/friend-api/friend-api.msw';
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
import { getGetMyLeagueHistoryMockHandler } from '../generated/mocks/league-history-api/league-history-api.msw';
import {
  getGetMyPageBannerMockHandler,
  getGetMyPageTopChaptersMockHandler,
  getGetMyPageWeakConceptsMockHandler,
  getGetMyPageWeeklyReportMockHandler,
} from '../generated/mocks/mypage-api/mypage-api.msw';
import {
  getCongratulateFeedMockHandler,
  getFollowMockHandler,
  getGetFeedMockHandler,
  getGetRecommendedUsersMockHandler,
  getHideFeedMockHandler,
} from '../generated/mocks/social-api/social-api.msw';
import { getGetUserMockHandler } from '../generated/mocks/user-api/user-api.msw';

// MAIN-01 시안 검토에 필요한 응답을 고정한다.
// faker 기본값은 매 요청 값이 바뀌고 범위가 무의미해(예: 진행률 3만%) 화면 확인에 쓸 수 없다.
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

// LRN-03에서 완료·미완료 칩을 함께 검토할 수 있도록 `isSolved`를 고정한다.
const unitDetailHandlers = [
  getGetAllLessonInUnitMockHandler({
    chapterSummary: { chapterId: 3, title: '자료구조' },
    unitSummaryResponse: {
      unitId: 1,
      displayOrder: 1,
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

// MIG-025 마이페이지(프로필 배너 + 학습 탭) 시안 검토용 고정값.
const myPageHandlers = [
  getGetMyPageBannerMockHandler({
    profileImageNumber: 3,
    nickname: '한준서',
    handle: '4p9nfz5t',
    level: 3,
    currentLeague: '브론즈 3',
    consecutiveSolvedDays: 7,
  }),
  getGetMyPageWeeklyReportMockHandler({
    MONDAY: 6,
    TUESDAY: 0,
    WEDNESDAY: 4,
    THURSDAY: 3,
    FRIDAY: 2,
    SATURDAY: 1,
    SUNDAY: 5,
    thisWeekCompletedLessonCount: 30,
    weekOverWeekDeltas: [4, -4, -4],
  }),
  getGetMyPageTopChaptersMockHandler([
    { rank: 1, chapterTitle: '자료구조', solvedLessonCount: 14, ratio: 100 },
    { rank: 2, chapterTitle: '알고리즘', solvedLessonCount: 8, ratio: 60 },
    { rank: 3, chapterTitle: '네트워크', solvedLessonCount: 4, ratio: 30 },
  ]),
  getGetMyPageWeakConceptsMockHandler([
    {
      rank: 1,
      unitId: 30,
      unitTitle: '해시 테이블 충돌 처리',
      chapterTitle: '자료구조',
      wrongAnswerCount: 8,
      wrongAnswerRate: 32,
    },
    {
      rank: 2,
      unitId: 87,
      unitTitle: '이진 탐색 트리',
      chapterTitle: '자료구조',
      wrongAnswerCount: 5,
      wrongAnswerRate: 28,
    },
    {
      rank: 3,
      unitId: 66,
      unitTitle: '최소 신장 트리',
      chapterTitle: '알고리즘',
      wrongAnswerCount: 7,
      wrongAnswerRate: 25,
    },
  ]),
  getGetMyLeagueHistoryMockHandler({
    currentSeasonRank: 12,
    totalSeasonCount: 5,
    top3SeasonCount: 14,
    bestLeagueName: '실버 1',
    // sortOrder는 티어 순위(클수록 상위 티어): 브론즈3=1, 브론즈2=2, 실버1=3
    seasonHistory: [
      { seasonKey: 's1', displayKey: 'S1', leagueName: '브론즈 3', sortOrder: 1, isCurrent: false },
      { seasonKey: 's2', displayKey: 'S2', leagueName: '실버 1', sortOrder: 3, isCurrent: false },
      { seasonKey: 's3', displayKey: 'S3', leagueName: '브론즈 2', sortOrder: 2, isCurrent: false },
      { seasonKey: 's4', displayKey: 'S4', leagueName: '브론즈 2', sortOrder: 2, isCurrent: false },
      { seasonKey: 's5', displayKey: '현재', leagueName: '실버 1', sortOrder: 3, isCurrent: true },
    ],
  }),
];

// 팔로우/팔로잉 시안 검토용 고정값. isFollowing 으로 팔로우/취소 상태를 섞는다.
const followHandlers = [
  getGetFollowAndFollowingCountMockHandler({ followerCount: 12, followingCount: 8 }),
  getGetFollowersMockHandler({
    hasNextPage: false,
    contents: [
      { id: 1, nickname: '김나영', profileImgNumber: 3, handle: '1235cws', isFollowing: true },
      { id: 2, nickname: '이철수', profileImgNumber: 5, handle: 'chulsoo22', isFollowing: false },
      { id: 3, nickname: '박민지', profileImgNumber: 7, handle: 'minji_p', isFollowing: true },
      { id: 4, nickname: '최유진', profileImgNumber: 2, handle: 'yujin99', isFollowing: false },
      { id: 5, nickname: '정하윤', profileImgNumber: 9, handle: 'hayoon', isFollowing: true },
    ],
  }),
  getGetFollowingsMockHandler({
    hasNextPage: false,
    contents: [
      { id: 11, nickname: '강도현', profileImgNumber: 4, handle: 'dohyun_k' },
      { id: 12, nickname: '윤서아', profileImgNumber: 6, handle: 'seoa_y' },
      { id: 13, nickname: '임건우', profileImgNumber: 8, handle: 'gunwoo' },
    ],
  }),
];

// 친구 활동 피드 시안 검토용 고정값. congratulated/canCongratulate 로 축하 상태를 섞는다.
const friendFeedHandlers = [
  getGetFeedMockHandler({
    hasNextPage: false,
    contents: [
      {
        feedId: 1,
        actorId: 11,
        actorNickname: '강도현',
        actorProfileImgNumber: 4,
        actorHandle: 'dohyun_k',
        message: '자료구조 챕터를 완료했어요',
        timeAgo: '5분 전',
        congratulated: false,
        canCongratulate: true,
        createdAt: '2026-09-23T09:00:00Z',
      },
      {
        feedId: 2,
        actorId: 12,
        actorNickname: '윤서아',
        actorProfileImgNumber: 6,
        actorHandle: 'seoa_y',
        message: '7일 연속 학습을 달성했어요',
        timeAgo: '3시간 전',
        congratulated: true,
        canCongratulate: false,
        createdAt: '2026-09-23T06:00:00Z',
      },
      {
        feedId: 3,
        actorId: 13,
        actorNickname: '임건우',
        actorProfileImgNumber: 8,
        actorHandle: 'gunwoo',
        message: '실버 리그로 승급했어요',
        timeAgo: '1일 전',
        congratulated: false,
        canCongratulate: false,
        createdAt: '2026-09-22T09:00:00Z',
      },
    ],
  }),
  getCongratulateFeedMockHandler(),
  getHideFeedMockHandler(),
];

// 추천 친구 시안 검토용 고정값. mutualFollowCount 로 함께 아는 친구 표기 유무를 섞는다.
const recommendFriendHandlers = [
  getGetRecommendedUsersMockHandler([
    { userId: 21, nickname: '한소희', profileImgNumber: 2, mutualFollowCount: 3 },
    { userId: 22, nickname: '오지훈', profileImgNumber: 5, mutualFollowCount: 0 },
    { userId: 23, nickname: '배수민', profileImgNumber: 7, mutualFollowCount: 1 },
    { userId: 24, nickname: '신예린', profileImgNumber: 9, mutualFollowCount: 0 },
  ]),
  getFollowMockHandler(),
];

export const worker = setupWorker(
  ...getOauth20ApiMock(),
  ...mainPageHandlers,
  ...unitDetailHandlers,
  ...myPageHandlers,
  ...followHandlers,
  ...friendFeedHandlers,
  ...recommendFriendHandlers,
);
