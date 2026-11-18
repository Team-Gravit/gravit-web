// REF-082 1단계: 화면마다 한 번 열어 API 응답 상태와 최종 경로, 스크린샷을 남긴다 (스로틀 없음).
// 응답 없는(404 · 실패) API를 찾아 스텁을 채우기 위한 조사용이다.
// node survey.mjs <puppeteer node_modules/> <port>
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');
const PORT = Number(process.argv[3] ?? 4194);

export const ROUTES = [
  '/main',
  '/learning',
  '/learning/chapters/1',
  '/learning/units/1',
  '/learning/units/1/concept-note',
  '/league',
  '/friends',
  '/my/summary',
  '/my/learning',
  '/my/league',
  '/my/social',
  '/my/friends/search',
  '/learning/lessons/1',
  '/learning/units/1/bookmarked-problems',
  '/learning/units/1/incorrect-problems',
  '/my/edit',
  '/notifications',
  '/settings',
  '/settings/inquiry',
  '/settings/inquiry/new',
  '/settings/notice',
  '/settings/notice/1',
];

const browser = await puppeteer.launch({ headless: true });
const report = [];
for (const path of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await page.evaluateOnNewDocument(() => localStorage.setItem('hasSession', '1'));
  const api = [];
  page.on('response', (res) => {
    const u = new URL(res.url());
    if (u.pathname.startsWith('/api/v1/')) api.push(`${res.request().method()} ${u.pathname} ${res.status()}`);
  });
  page.on('requestfailed', (req) => {
    const u = new URL(req.url());
    if (u.pathname.startsWith('/api/v1/')) api.push(`${req.method()} ${u.pathname} FAILED`);
  });
  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle0', timeout: 60000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 1500));
  const finalPath = new URL(page.url()).pathname;
  const name = path.replace(/\//g, '_').replace(/^_/, '') || 'root';
  await page.screenshot({ path: `shots/${name}.png` });
  report.push({ path, finalPath, api: [...new Set(api)] });
  console.log(path, '->', finalPath);
  for (const a of new Set(api)) console.log('   ', a);
  await page.close();
}
writeFileSync('survey.json', JSON.stringify(report, null, 2));
await browser.close();
