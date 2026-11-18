// 측정용: MSW가 통과시키는 요청 중 화면에 필요한 것만 고정 응답, 나머지는 404.
const http = require('node:http');
const CHAPTERS = Array.from({ length: 10 }, (_, i) => ({ chapterSummaryResponse: { chapterId: i + 1, title: ['자료구조', '알고리즘', '운영체제', '네트워크', '데이터베이스', '컴퓨터구조', '소프트웨어공학', '보안', '자바', '파이썬'][i], description: '설명' }, chapterProgressRate: (i * 13) % 100 }));
const RANKS = Array.from({ length: 10 }, (_, i) => ({ userId: i + 1, nickname: `사용자${i + 1}`, profileImgNumber: (i % 6) + 1, level: 3, xp: 120 - i * 7, lp: 98 - i * 6, rank: i + 1 }));
const ROUTES = [
  // FEAT-080: 새로고침 때 쿠키로 재발급한다. 측정에서는 쿠키 없이 바로 토큰을 준다.
  [/\/api\/v1\/auth\/reissue$/, { accessToken: 'mock' }],
  [/\/api\/v1\/chapters$/, CHAPTERS],
  [/\/api\/v1\/league\/home$/, { containsPopup: false, currentSeason: { nowSeason: '2026-W45' } }],
  [/\/api\/v1\/ranking\/me$/, { leagueId: 1, leagueName: '브론즈 3', rank: 3, userId: 1, lp: 31, maxLp: 99, nickname: '땅콩', profileImgNumber: 3, xp: 31, level: 1 }],
  [/\/api\/v1\/league\/\d+$/, { leagueId: 1, name: '브론즈 3', minLp: 0, maxLp: 99 }],
  [/\/api\/v1\/ranking\/(leagues\/\d+|user-leagues)\/page\/\d+$/, { hasNextPage: false, contents: RANKS }],
];
http.createServer((req, res) => {
  res.setHeader('access-control-allow-origin', req.headers.origin ?? '*');
  res.setHeader('access-control-allow-credentials', 'true');
  res.setHeader('access-control-allow-headers', 'authorization, content-type');
  res.setHeader('access-control-allow-methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const path = req.url.split('?')[0];
  const hit = ROUTES.find(([re]) => re.test(path));
  if (hit) { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(hit[1])); }
  res.writeHead(404); res.end();
}).listen(4199, () => console.log('stub 4199'));
