// REF-082 측정용 스텁: MSW 없는 빌드의 모든 API 요청에 고정 응답을 준다. 나머지는 404.
// MSW는 시작 비용(~1초)과 서비스 워커 경유 지연(요청이 몰리면 수 초)을 더해서 측정에서 뺐다.
// 응답 모양은 apps/web/src/shared/api/generated/model 타입을 그대로 따른다. 목록 길이는 화면이 한 번 스크롤될 만큼.
const http = require('node:http');
const { FIXTURES } = require('./fixtures.cjs');

// 온보딩 화면만 미온보딩 사용자가 필요하다. 측정 스크립트가 /__control?onboarded=false 로 바꾼다.
let isOnboarded = true;
let delayMs = 0;

const CHAPTER_TITLES = ['자료구조', '알고리즘', '운영체제', '네트워크', '데이터베이스', '컴퓨터구조', '소프트웨어공학', '보안', '자바', '파이썬'];
const CHAPTERS = CHAPTER_TITLES.map((title, i) => ({
  chapterSummaryResponse: { chapterId: i + 1, title, description: `${title}의 핵심 개념을 단계별로 학습합니다.` },
  chapterProgressRate: (i * 13) % 100,
}));
const RANKS = Array.from({ length: 10 }, (_, i) => ({ userId: i + 1, nickname: `사용자${i + 1}`, profileImgNumber: (i % 6) + 1, level: 3, xp: 120 - i * 7, lp: 98 - i * 6, rank: i + 1 }));

const unitSummary = (unitId) => ({ unitId, displayOrder: unitId, title: `유닛 ${unitId} · 스택과 큐`, description: 'LIFO와 FIFO 구조의 차이와 쓰임을 익힙니다.' });

// 문제 10개: 객관식 7 · 주관식 3
function problems(unitId) {
  return Array.from({ length: 10 }, (_, i) => {
    const problemId = unitId * 100 + i + 1;
    const objective = i % 10 < 7;
    return {
      problemId,
      problemType: objective ? 'OBJECTIVE' : 'SUBJECTIVE',
      instruction: objective ? '다음 중 옳은 것을 고르세요.' : '빈칸에 들어갈 용어를 쓰세요.',
      content: objective
        ? `스택에 1, 2, 3을 차례로 넣은 뒤 두 번 꺼냈을 때 남아 있는 값으로 옳은 것은? (${i + 1})`
        : '먼저 들어온 데이터가 먼저 나가는 자료구조를 ______ 라고 한다.',
      ...(objective
        ? {
            options: [1, 2, 3, 4].map((n) => ({
              optionId: problemId * 10 + n,
              content: `보기 ${n} — ${['1', '2', '3', '1과 2'][n - 1]}`,
              explanation: n === 1 ? '스택은 나중에 넣은 값부터 꺼내므로 1이 남습니다.' : '꺼낸 순서를 다시 확인해 보세요.',
              isAnswer: n === 1,
              problemId,
            })),
          }
        : { answerResponse: { contents: ['큐', 'queue'], explanation: '큐는 FIFO(선입선출) 구조입니다.' } }),
      isBookmarked: i % 3 === 0,
    };
  });
}

const problemSet = (unitId) => ({ unitSummaryResponse: unitSummary(unitId), problems: problems(unitId), totalProblems: 10 });

const page = (contents) => ({ page: 0, totalPages: 1, hasNext: false, totalElements: contents.length, contents });

const INQUIRIES = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `문의 ${i + 1} · 레슨 결과 화면에서 점수가 다르게 보여요`,
  type: ['BUG_REPORT', 'CONTENT_ERROR', 'FEATURE_SUGGESTION', 'OTHER'][i % 4],
  status: i % 3 === 0 ? 'PENDING' : 'RESOLVED',
  createdAt: `2026-10-${String(28 - i).padStart(2, '0')}T10:00:00`,
}));

const NOTICES = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `공지 ${i + 1} · 11월 학습 리그 시즌 안내`,
  summary: '새 시즌이 시작됩니다. 순위 보상과 승급 기준을 확인해 주세요.',
  pinned: i < 2,
  publishedAt: `2026-11-${String(10 - (i % 9)).padStart(2, '0')}T09:00:00`,
}));

const NOTICE_DETAIL = {
  id: 1,
  title: '공지 1 · 11월 학습 리그 시즌 안내',
  content: ['## 새 시즌 안내', '', '11월 학습 리그가 시작됩니다.', '', '- 시즌 기간: 11월 10일 ~ 11월 23일', '- 승급 기준: 리그 상위 30%', '- 보상: 시즌 배지', '', '자세한 내용은 리그 화면에서 확인해 주세요.'].join('\n'),
  authorName: '그래빗 팀',
  createdAt: '2026-11-10T09:00:00',
  updatedAt: '2026-11-10T09:00:00',
  status: 'PUBLISHED',
  pinned: true,
  publishedAt: '2026-11-10T09:00:00',
};

// 개념 노트 약 4KB: 제목 · 목록 · 표 · 코드 블록 · 인용
const CONCEPT_NOTE = [
  '# 스택과 큐',
  '',
  '스택(Stack)과 큐(Queue)는 데이터를 넣고 꺼내는 **순서**가 정해진 선형 자료구조입니다.',
  '',
  '## 스택',
  '',
  '- 나중에 넣은 데이터가 먼저 나옵니다 (LIFO, Last In First Out)',
  '- 넣기는 `push`, 꺼내기는 `pop`, 맨 위 확인은 `peek`',
  '- 함수 호출 스택, 되돌리기(undo), 괄호 짝 검사에 쓰입니다',
  '',
  '```ts',
  'const stack: number[] = [];',
  'stack.push(1);',
  'stack.push(2);',
  'stack.pop(); // 2',
  '```',
  '',
  '## 큐',
  '',
  '- 먼저 넣은 데이터가 먼저 나옵니다 (FIFO, First In First Out)',
  '- 넣기는 `enqueue`, 꺼내기는 `dequeue`',
  '- 작업 대기열, BFS, 프린터 출력 순서에 쓰입니다',
  '',
  '```ts',
  'const queue: number[] = [];',
  'queue.push(1);',
  'queue.push(2);',
  'queue.shift(); // 1',
  '```',
  '',
  '## 비교',
  '',
  '| 구분 | 스택 | 큐 |',
  '| --- | --- | --- |',
  '| 순서 | LIFO | FIFO |',
  '| 넣기 | push | enqueue |',
  '| 꺼내기 | pop | dequeue |',
  '| 대표 쓰임 | 호출 스택 | 작업 대기열 |',
  '',
  '> 배열의 `shift()`는 뒤 원소를 모두 한 칸씩 옮겨 O(n)입니다. 큐를 많이 쓰면 원형 버퍼나 연결 리스트로 구현합니다.',
  '',
  '## 시간 복잡도',
  '',
  '| 연산 | 스택 | 큐(원형 버퍼) |',
  '| --- | --- | --- |',
  '| 넣기 | O(1) | O(1) |',
  '| 꺼내기 | O(1) | O(1) |',
  '| 탐색 | O(n) | O(n) |',
  '',
  '## 정리',
  '',
  '1. 순서가 중요할 때 스택과 큐 중 무엇이 맞는지 먼저 정합니다',
  '2. 언어가 주는 자료구조의 실제 복잡도를 확인합니다',
  '3. 경계 조건(빈 구조에서 꺼내기)을 처리합니다',
].join('\n');

const ROUTES = [
  // FEAT-080: 새로고침 때 쿠키로 재발급한다. 측정에서는 쿠키 없이 바로 토큰을 준다.
  [/\/api\/v1\/auth\/reissue$/, () => ({ accessToken: 'mock' })],
  [/\/api\/v1\/chapters$/, () => CHAPTERS],
  [/\/api\/v1\/league\/home$/, () => ({ containsPopup: false, currentSeason: { nowSeason: '2026-W45' } })],
  [/\/api\/v1\/ranking\/me$/, () => ({ leagueId: 1, leagueName: '브론즈 3', rank: 3, userId: 1, lp: 31, maxLp: 99, nickname: '땅콩', profileImgNumber: 3, xp: 31, level: 1 })],
  [/\/api\/v1\/league\/\d+$/, () => ({ leagueId: 1, name: '브론즈 3', minLp: 0, maxLp: 99 })],
  [/\/api\/v1\/ranking\/(leagues\/\d+|user-leagues)\/page\/\d+$/, () => ({ hasNextPage: false, contents: RANKS })],
  // REF-082에서 추가
  [/\/api\/v1\/units\/(\d+)$/, (m) => ({
    chapterSummaryResponse: CHAPTERS[(Number(m[1]) - 1) % 10].chapterSummaryResponse,
    unitDetailResponses: Array.from({ length: 8 }, (_, i) => ({ unitSummaryResponse: unitSummary(i + 1), progressRate: (i * 17) % 101 })),
  })],
  // 잔디(히트맵)는 1년치를 그린다. 렌더 비용이 개수에 따라 달라지므로 365일을 다 채운다.
  [/\/api\/v1\/my-pages\/learning\/history$/, () => ({
    dailySolvedCounts: Array.from({ length: 365 }, (_, i) => {
      const d = new Date(Date.UTC(2026, 0, 1 + i));
      return { date: d.toISOString().slice(0, 10), solvedLessonCount: (i * 7) % 5 === 0 ? 0 : (i * 3) % 6 };
    }),
    peakLearningHour: 21,
    years: [2025, 2026],
  })],
  [/\/api\/v1\/my-pages\/learning\/summaries$/, () => ({ topPercent: 23, completedLessonCount: 42, totalLessonCount: 120, totalLearningHours: 18, averageAccuracy: 81 })],
  [/\/api\/v1\/problems\/(\d+)$/, (m) => problemSet(Number(m[1]))],
  [/\/api\/v1\/bookmarks\/(\d+)$/, (m) => problemSet(Number(m[1]))],
  [/\/api\/v1\/wrong-answered-notes\/(\d+)$/, (m) => problemSet(Number(m[1]))],
  [/\/api\/v1\/inquiries$/, () => page(INQUIRIES)],
  [/\/api\/v1\/notice\/summaries\/\d+$/, () => page(NOTICES)],
  [/\/api\/v1\/notice\/\d+$/, () => NOTICE_DETAIL],
  [/\/api\/v1\/lessons\/results\/\d+$/, () => ({
    leagueName: '브론즈 3',
    userLevelResponse: { currentLevel: 1, nextLevel: 2, xp: 61, minXp: 0, maxXp: 99 },
    unitSummaryResponse: unitSummary(1),
    accuracy: 80,
    learningTime: 312,
    chapterId: 1,
  })],
  // MSW에서 옮긴 고정 응답. 위의 더 구체적인 경로(lessons/results)가 먼저 맞도록 뒤에 둔다.
  ...FIXTURES.map(([path, body]) => [
    new RegExp(`^${path.replace(':id', '\\d+')}$`),
    () => (path === '/api/v1/users' ? { ...body, isOnboarded } : body),
  ]),
];

// 개념 노트는 JSON이 아니라 파일(Blob)로 받는다.
const TEXT_ROUTES = [[/\/api\/v1\/cs-notes\/units\/\d+$/, () => CONCEPT_NOTE]];

http.createServer((req, res) => {
  res.setHeader('access-control-allow-origin', req.headers.origin ?? '*');
  res.setHeader('access-control-allow-credentials', 'true');
  res.setHeader('access-control-allow-headers', 'authorization, content-type');
  res.setHeader('access-control-allow-methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const [path, query = ''] = req.url.split('?');
  if (path === '/__control') {
    const params = new URLSearchParams(query);
    isOnboarded = params.get('onboarded') !== 'false';
    delayMs = Number(params.get('delay') ?? 0);
    res.writeHead(200);
    return res.end(`onboarded=${isOnboarded} delay=${delayMs}`);
  }
  // CLS 검토용: 실제 서버처럼 응답을 늦춰 스켈레톤이 화면에 그려지게 한다. 재발급은 늦추지 않는다.
  if (delayMs && !path.endsWith('/auth/reissue') && !path.endsWith('/users')) {
    setTimeout(() => respond(req, res, path), delayMs);
    return;
  }
  respond(req, res, path);
}).listen(4199, () => console.log('stub 4199'));

function respond(req, res, path) {
  // 변경 요청(팔로우 · 축하 등)은 측정 상호작용에서 성공으로 돌려준다. 재발급은 아래 경로가 처리한다.
  if (req.method !== 'GET' && !path.endsWith('/auth/reissue')) {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end('{}');
  }
  for (const [re, make] of TEXT_ROUTES) {
    const m = path.match(re);
    if (m) { res.writeHead(200, { 'content-type': 'text/markdown; charset=utf-8' }); return res.end(make(m)); }
  }
  for (const [re, make] of ROUTES) {
    const m = path.match(re);
    if (m) { res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' }); return res.end(JSON.stringify(make(m))); }
  }
  res.writeHead(404); res.end();
}
