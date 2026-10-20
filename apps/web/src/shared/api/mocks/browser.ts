import { setupWorker } from 'msw/browser';

import {
  getGetFollowAndFollowingCountMockHandler,
  getGetFollowersMockHandler,
  getGetFollowingsMockHandler,
  getUnfollowMockHandler,
} from '../generated/mocks/friend-api/friend-api.msw';
import {
  getGetDashboardMockHandler,
  getGetSessionAnswersMockHandler,
  getGetSessionHistoryMockHandler,
  getGetSessionSummaryMockHandler,
  getGetWeakTopicsMockHandler,
} from '../generated/mocks/interview-feedback-api/interview-feedback-api.msw';
import { getGetInboxMockHandler } from '../generated/mocks/notification-api/notification-api.msw';
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

// 알림 인박스 시안 검토용 고정값. actionType 전 종류를 한 번에 확인할 수 있게 구성한다.
// targetId 1·2 는 friendFeedHandlers 의 feedId 와 맞춰 축하 동기화를 확인할 수 있게 한다.
const notificationHandlers = [
  getGetInboxMockHandler([
    // FOLLOW_BACK: 맞팔로우 버튼
    {
      id: 1,
      type: 'FOLLOW',
      message: '김나영님이 친구신청을 보냈어요.',
      actionType: 'FOLLOW_BACK',
      actor: { profileId: 5, nickname: '김나영', profileImgNumber: 1 },
      read: false,
      createdAt: '2026-05-22T10:00:00Z',
      timeAgo: '2시간 전',
    },
    // FOLLOW + NONE: 이미 팔로우 중 → 팔로우 취소 버튼
    {
      id: 2,
      type: 'FOLLOW',
      message: '이도윤님이 친구신청을 보냈어요.',
      actionType: 'NONE',
      actor: { profileId: 6, nickname: '이도윤', profileImgNumber: 4 },
      read: false,
      createdAt: '2026-05-22T09:30:00Z',
      timeAgo: '3시간 전',
    },
    // GO_TO_LEARNING: 학습하러 가기
    {
      id: 3,
      type: 'INACTIVITY',
      message: '연속학습이 깨져요.',
      subText: '다음날까지 2시간 남았어요.',
      actionType: 'GO_TO_LEARNING',
      read: false,
      createdAt: '2026-05-22T08:00:00Z',
      timeAgo: '5시간 전',
    },
    // GO_TO_NOTICE: 공지 보러가기
    {
      id: 4,
      type: 'NOTICE',
      message: '[공지] 새 시즌이 시작됐어요.',
      subText: '5월 업데이트 안내',
      actionType: 'GO_TO_NOTICE',
      read: true,
      createdAt: '2026-05-22T07:00:00Z',
      timeAgo: '6시간 전',
    },
    // GO_TO_INQUIRY: 문의 보러가기
    {
      id: 5,
      type: 'INQUIRY_ANSWERED',
      message: '문의하신 내용에 답변이 달렸어요.',
      actionType: 'GO_TO_INQUIRY',
      read: true,
      createdAt: '2026-05-21T15:00:00Z',
      timeAgo: '어제',
    },
    // CONGRATULATE(미완료): 축하하기 버튼 (targetId=feedId 1)
    {
      id: 6,
      type: 'FRIEND_ACTIVITY',
      message: '강도현님이 활동했어요.',
      subText: '자료구조 챕터를 완료했어요.',
      actionType: 'CONGRATULATE',
      targetId: 1,
      congratulated: false,
      read: false,
      createdAt: '2026-05-21T12:00:00Z',
      timeAgo: '어제',
    },
    // CONGRATULATE(완료): 축하 완료 비활성 (targetId=feedId 2)
    {
      id: 7,
      type: 'FRIEND_ACTIVITY',
      message: '윤서아님이 활동했어요.',
      subText: '7일 연속 학습을 달성했어요.',
      actionType: 'CONGRATULATE',
      targetId: 2,
      congratulated: true,
      read: true,
      createdAt: '2026-05-21T10:00:00Z',
      timeAgo: '어제',
    },
    // NONE(비-FOLLOW): 버튼 없는 정보성 알림
    {
      id: 8,
      type: 'FRIEND_ACTIVITY',
      message: '임건우님이 축하해줬어요! 🎉',
      subText: '[자료구조 챕터 완료]에 축하했어요.',
      actionType: 'NONE',
      read: true,
      createdAt: '2026-05-20T10:00:00Z',
      timeAgo: '2일 전',
    },
  ]),
  getUnfollowMockHandler(),
];

// AI-HOME-01 시안 검토용 고정값. 데이터 5개 프레임(DATA4)에 맞춘다. 빈 상태는 페이지 테스트가 확인한다.
const interviewHomeHandlers = [
  getGetDashboardMockHandler({
    completedSessionCount: 12,
    recentAverageScore: 68,
    weakestTopics: [
      { topic: { topic: 'ALGORITHM', displayName: '알고리즘' }, accuracyRate: 30 },
      { topic: { topic: 'NETWORK', displayName: '네트워크' }, accuracyRate: 60 },
      { topic: { topic: 'DATABASE', displayName: '데이터베이스' }, accuracyRate: 80 },
    ],
    recentSessions: [
      {
        sessionId: 12,
        sequence: 12,
        mode: 'COMMON_CS',
        topics: [
          { topic: 'DATA_STRUCTURE', displayName: '자료구조' },
          { topic: 'ALGORITHM', displayName: '알고리즘' },
        ],
        startedAt: '2026-07-28T10:00:00',
        score: 68,
        maxScore: 100,
      },
      {
        sessionId: 11,
        sequence: 11,
        mode: 'COMMON_CS',
        topics: [{ topic: 'DATA_STRUCTURE', displayName: '자료구조' }],
        startedAt: '2026-07-27T10:00:00',
        score: 50,
        maxScore: 100,
      },
      {
        sessionId: 10,
        sequence: 10,
        mode: 'JOB_SPECIFIC',
        topics: [{ topic: 'REACT', displayName: 'React' }],
        startedAt: '2026-07-20T10:00:00',
        score: 42,
        maxScore: 100,
      },
    ],
    scoreTrends: [
      { sequence: 8, score: 20 },
      { sequence: 9, score: 68 },
      { sequence: 10, score: 42 },
      { sequence: 11, score: 50 },
      { sequence: 12, score: 68 },
    ],
  }),
  // 「전체 보기」 모달(AI-HOME-01-MODAL)이 스크롤되도록 대시보드의 하위 3개보다 길게 둔다.
  getGetWeakTopicsMockHandler([
    { topic: { topic: 'ALGORITHM', displayName: '알고리즘' }, accuracyRate: 30 },
    { topic: { topic: 'NETWORK', displayName: '네트워크' }, accuracyRate: 60 },
    { topic: { topic: 'DATABASE', displayName: '데이터베이스' }, accuracyRate: 80 },
    { topic: { topic: 'OPERATING_SYSTEM', displayName: '운영체제' }, accuracyRate: 82 },
    { topic: { topic: 'DATA_STRUCTURE', displayName: '자료구조' }, accuracyRate: 85 },
    { topic: { topic: 'JAVA', displayName: 'Java' }, accuracyRate: 88 },
    { topic: { topic: 'REACT', displayName: 'React' }, accuracyRate: 91 },
  ]),
];

// 최근 응시 이력(AI-HOME-01 응시 이력 페이지) 시안 검토용. 번호형 페이지 이동을 보도록 3페이지로 둔다.
const HISTORY_TOPIC_SETS = [
  [
    { topic: 'DATA_STRUCTURE', displayName: '자료구조' },
    { topic: 'DATABASE', displayName: '데이터베이스' },
    { topic: 'ALGORITHM', displayName: '알고리즘' },
  ],
  [{ topic: 'DATA_STRUCTURE', displayName: '자료구조' }],
  [{ topic: 'NETWORK', displayName: '네트워크' }],
] as const;

const interviewHistoryHandlers = [
  getGetSessionHistoryMockHandler(({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const isOldestFirst = url.searchParams.get('sort') === 'OLDEST';
    const totalCount = 25;

    return {
      hasNextPage: page < 2,
      totalPages: 3,
      contents: Array.from({ length: Math.min(10, totalCount - page * 10) }, (_, index) => {
        const order = page * 10 + index;
        const sequence = isOldestFirst ? order + 1 : totalCount - order;
        return {
          sessionId: sequence,
          sequence,
          mode: sequence % 4 === 0 ? 'JOB_SPECIFIC' : 'COMMON_CS',
          topics: [...HISTORY_TOPIC_SETS[sequence % HISTORY_TOPIC_SETS.length]],
          startedAt: `2026-07-${String(sequence).padStart(2, '0')}T10:00:00`,
          score: 40 + ((sequence * 7) % 50),
          maxScore: 100,
        };
      }),
    };
  }),
];

// 피드백 리포트(AI-HOME-01 리포트) 시안 검토용. 모든 세션이 같은 리포트를 돌려준다.
// 2번은 낮은 정확도로 막대 위 라벨을, 5번은 무응답 문항을 확인하도록 둔다.
const REPORT_ANSWER_SCORES = [
  { accuracyScore: 12, structureScore: 3, clarityScore: 2 },
  { accuracyScore: 1, structureScore: 1, clarityScore: 1 },
  { accuracyScore: 9, structureScore: 2, clarityScore: 3 },
  { accuracyScore: 14, structureScore: 3, clarityScore: 3 },
  { accuracyScore: 0, structureScore: 0, clarityScore: 0 },
];
const REPORT_TOPICS = [
  { topic: 'ALGORITHM', displayName: '알고리즘' },
  { topic: 'DATA_STRUCTURE', displayName: '자료구조' },
  { topic: 'NETWORK', displayName: '네트워크' },
  { topic: 'OPERATING_SYSTEM', displayName: '운영체제' },
  { topic: 'ALGORITHM', displayName: '알고리즘' },
] as const;

// 문항 탭을 바꿨을 때 내용이 달라지는지 볼 수 있도록 문항마다 다른 글을 둔다. 5번은 무응답이다.
const REPORT_ANSWER_CONTENTS = [
  {
    question: '퀵소트의 평균 및 최악 시간복잡도를 설명해주세요.',
    answer: '퀵소트는 평균적으로 O(n log n)이에요.\n피벗이 한쪽으로 치우치면 O(n²)까지 늘어나요.',
    modelAnswer:
      '평균은 **O(n log n)**, 최악은 **O(n²)**입니다. 피벗을 무작위로 고르면 최악을 피하기 쉽습니다.',
    concepts: ['평균 시간복잡도는 O(n log n)이다', '피벗이 치우치면 최악 O(n²)이 된다'],
    improvement: '- 최악의 경우가 생기는 **입력 조건**을 함께 말해 보세요.',
  },
  {
    question: '배열과 연결 리스트의 차이를 설명해주세요.',
    answer: '배열은 인덱스로 바로 접근해요.',
    modelAnswer:
      '배열은 **임의 접근이 O(1)**이지만 중간 삽입이 느리고, 연결 리스트는 삽입·삭제가 빠르지만 탐색이 **O(n)**입니다.',
    concepts: ['배열은 연속된 메모리에 저장된다', '연결 리스트는 삽입·삭제가 O(1)이다'],
    improvement:
      '- 연결 리스트의 장점까지 비교해 말해 보세요.\n- 메모리 배치 차이를 함께 언급하면 좋아요.',
  },
  {
    question: 'TCP와 UDP의 차이를 설명해주세요.',
    answer: 'TCP는 연결 지향이고 신뢰성을 보장해요.\nUDP는 빠르지만 순서를 보장하지 않아요.',
    modelAnswer:
      'TCP는 **3-way handshake**로 연결을 맺고 재전송·순서 보장을 합니다. UDP는 비연결형으로 오버헤드가 작습니다.',
    concepts: ['TCP는 연결 지향 프로토콜이다', 'UDP는 순서와 도착을 보장하지 않는다'],
    improvement: '- 각각을 쓰는 **예시 서비스**를 들어 보세요.',
  },
  {
    question: '프로세스와 스레드의 차이를 설명해주세요.',
    answer: '프로세스는 독립된 메모리를 갖고, 스레드는 프로세스 안에서 메모리를 공유해요.',
    modelAnswer:
      '프로세스는 **독립된 주소 공간**을, 스레드는 같은 프로세스의 **힙·데이터 영역을 공유**합니다.',
    concepts: ['스레드는 스택을 따로 갖는다', '스레드는 힙 영역을 공유한다'],
    improvement: '좋은 답변이에요. 지금처럼 핵심을 짧게 짚어 주세요.',
  },
  {
    question: '이진 탐색의 동작 조건과 시간복잡도를 설명해주세요.',
    answer: undefined,
    modelAnswer: '이진 탐색은 **정렬된 배열**에서 범위를 절반씩 줄여 **O(log n)**에 찾습니다.',
    concepts: ['정렬된 데이터에서만 동작한다', '시간복잡도는 O(log n)이다'],
    improvement: undefined,
  },
];

const interviewReportHandlers = [
  getGetSessionSummaryMockHandler(() => ({
    sessionId: 25,
    sequence: 25,
    startedAt: '2026-06-21T10:00:00',
    score: 68,
    maxScore: 100,
    accuracyScore: 48,
    accuracyMaxScore: 70,
    deliveryScore: 20,
    deliveryMaxScore: 30,
    averageAccuracyScore: 28,
    averageDeliveryScore: 22,
    recentSessions: [
      { sessionId: 21, sequence: 21, accuracyScore: 30, deliveryScore: 18 },
      { sessionId: 22, sequence: 22, accuracyScore: 26, deliveryScore: 24 },
      { sessionId: 23, sequence: 23, accuracyScore: 35, deliveryScore: 21 },
      { sessionId: 24, sequence: 24, accuracyScore: 44, deliveryScore: 23 },
      { sessionId: 25, sequence: 25, accuracyScore: 48, deliveryScore: 20 },
    ],
    answers: REPORT_ANSWER_SCORES.map((score, index) => ({
      displayOrder: index + 1,
      topic: { ...REPORT_TOPICS[index] },
      accuracyScore: score.accuracyScore,
      deliveryScore: score.structureScore + score.clarityScore,
    })),
    weakTopics: [
      { unitId: 1, topic: { topic: 'DATA_STRUCTURE', displayName: '자료구조' } },
      { unitId: 7, topic: { topic: 'ALGORITHM', displayName: '알고리즘' } },
    ],
  })),
  getGetSessionAnswersMockHandler(() => ({
    sessionId: 25,
    startedAt: '2026-06-21T10:00:00',
    answers: REPORT_ANSWER_SCORES.map((score, index) => {
      const content = REPORT_ANSWER_CONTENTS[index];
      return {
        displayOrder: index + 1,
        topic: { ...REPORT_TOPICS[index] },
        questionContent: content.question,
        answerContent: content.answer,
        audioUrl: undefined,
        modelAnswer: content.modelAnswer,
        concepts: content.concepts.map((name) => ({ name, type: 'ESSENTIAL' as const })),
        improvementSuggestion: content.improvement,
        accuracyScore: score.accuracyScore,
        accuracyMaxScore: 14,
        structureScore: score.structureScore,
        structureMaxScore: 3,
        clarityScore: score.clarityScore,
        clarityMaxScore: 3,
      };
    }),
  })),
];

export const worker = setupWorker(
  ...getOauth20ApiMock(),
  ...mainPageHandlers,
  ...unitDetailHandlers,
  ...myPageHandlers,
  ...followHandlers,
  ...friendFeedHandlers,
  ...recommendFriendHandlers,
  ...notificationHandlers,
  ...interviewHomeHandlers,
  ...interviewHistoryHandlers,
  ...interviewReportHandlers,
);
