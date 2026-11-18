// REF-082 진단 측정. 화면마다 새 브라우저 컨텍스트에서 RUNS번 잰다.
//   MODE=load  FCP · LCP(요소) · CLS(원인 요소) · TBT · 요청 순서. 캐시 끔 · Fast 4G 근사 · CPU 4배
//   MODE=inp   화면이 다 그려진 뒤 대표 상호작용을 실행해 가장 긴 상호작용(Event Timing)을 잰다. CPU 4배 · 네트워크 제한 없음
// GROUP=A|B|C (묶음) · SCREENS=id,id (일부만) · RUNS=7 · DELAY=ms (스텁 응답 지연, CLS 검토용)
// node diagnose.mjs <puppeteer node_modules/> <출력 폴더>
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { openStateScreen } from './state-probe.mjs';

const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');

const OUT = process.argv[3] ?? '.';
const MODE = process.env.MODE ?? 'load';
const RUNS = Number(process.env.RUNS ?? 7);
// MSW 없는 빌드(4195) + 스텁(4199). MSW 빌드는 시작 비용과 서비스 워커 지연이 섞여 쓰지 않는다.
const ORIGIN = 'http://localhost:4195';
const STUB = 'http://localhost:4199';
const MOBILE = { width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true };
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1 };

// 상호작용: { click: 보이는 글자 또는 css } · { type: css, text }. 이동이 일어나는 것은 마지막에 둔다.
const t = (text) => ({ click: text });
const css = (selector) => ({ click: selector, isCss: true });
const SCREENS = [
  // 묶음 A · 앱 셸
  { id: 'main', group: 'A', path: '/main', desktop: true, actions: [t('전체 학습화면 보기')] },
  { id: 'learning', group: 'A', path: '/learning', desktop: true, actions: [t('자료구조 학습하기')] },
  { id: 'chapter', group: 'A', path: '/learning/chapters/1', actions: [t('Unit01')] },
  { id: 'unit', group: 'A', path: '/learning/units/1', actions: [t('Lesson01')] },
  { id: 'concept-note', group: 'A', path: '/learning/units/1/concept-note', desktop: true, actions: [t('복사')] },
  { id: 'league', group: 'A', path: '/league', desktop: true, actions: [t('실버 3'), t('골드 1')] },
  { id: 'friends', group: 'A', path: '/friends', actions: [t('8 팔로잉'), t('12 팔로우')] },
  { id: 'my-summary', group: 'A', path: '/my/summary', desktop: true, actions: [t('학습 기록 연도 선택'), css('a[href="/my/learning"]')] },
  { id: 'my-learning', group: 'A', path: '/my/learning', actions: [css('a[href="/my/league"]')] },
  { id: 'my-league', group: 'A', path: '/my/league', actions: [css('a[href="/my/social"]')] },
  { id: 'my-social', group: 'A', path: '/my/social', actions: [t('축하하기'), t('8 팔로잉')] },
  { id: 'friend-search', group: 'A', path: '/my/friends/search', actions: [css('a[href="/my/summary"]')] },
  // 묶음 B · 풀이
  { id: 'lesson', group: 'B', path: '/learning/lessons/1', actions: [t('1번 선지 가리기'), t('보기 1'), t('다음')] },
  { id: 'lesson-result', group: 'B', path: '/learning/lessons/1/result/1', state: { fromLessonSubmission: true }, actions: [t('이어서 학습하기')] },
  { id: 'bookmarked', group: 'B', path: '/learning/units/1/bookmarked-problems', actions: [t('보기 1'), t('다음')] },
  { id: 'incorrect', group: 'B', path: '/learning/units/1/incorrect-problems', actions: [t('보기 1'), t('다음')] },
  // 묶음 C · 그 밖
  { id: 'my-edit', group: 'C', path: '/my/edit', actions: [t('다음 프로필 색'), { type: 'input', text: '새닉네임' }] },
  { id: 'notifications', group: 'C', path: '/notifications', actions: [t('학습하러 가기')] },
  // 미온보딩 사용자가 필요해서 스텁을 바꿔 두고 잰다 (측정 후 되돌린다).
  { id: 'onboarding', group: 'C', path: '/onboarding', unonboarded: true, actions: [t('다음 프로필 색'), { type: 'input', text: '새닉네임' }] },
  { id: 'onboarding-success', group: 'C', path: '/onboarding/success', state: { fromOnboarding: true }, actions: [t('홈으로')] },
  { id: 'settings', group: 'C', path: '/settings', actions: [t('공지사항')] },
  { id: 'inquiry', group: 'C', path: '/settings/inquiry', actions: [t('문의 1'), t('문의 2')] },
  { id: 'inquiry-new', group: 'C', path: '/settings/inquiry/new', actions: [t('문의 유형을 선택해주세요.'), { type: 'input', text: '점수 오류' }, { type: 'textarea', text: '결과 화면 점수가 달라요' }] },
  { id: 'notice', group: 'C', path: '/settings/notice', actions: [t('공지 1 ·')] },
  { id: 'notice-detail', group: 'C', path: '/settings/notice/1', actions: [t('뒤로 가기')] },
];

const ONLY = process.env.SCREENS?.split(',');
const targets = SCREENS.filter((s) => (ONLY ? ONLY.includes(s.id) : !process.env.GROUP || s.group === process.env.GROUP));
const cases = targets.flatMap((s) => {
  const list = [{ ...s, key: `${s.id}-mobile`, viewport: MOBILE }];
  if (MODE === 'load' && s.desktop) list.push({ ...s, key: `${s.id}-desktop`, viewport: DESKTOP });
  return list;
});

// 페이지 안에서 지표를 모은다. 요소는 사람이 알아볼 수 있게 태그 · 글자 · 이미지 파일명으로 적는다.
function installObservers() {
  localStorage.setItem('hasSession', '1');
  const describe = (node) => {
    if (!node || !node.tagName) return null;
    const text = (node.innerText || node.alt || node.getAttribute?.('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 30);
    const cls = typeof node.className === 'string' ? node.className.split(' ').slice(0, 3).join('.') : '';
    return `${node.tagName.toLowerCase()}${cls ? '.' + cls : ''}${text ? ` "${text}"` : ''}`;
  };
  window.__m = { lcp: null, cls: 0, shifts: [], longTasks: [], events: [] };
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__m.lcp = { time: e.startTime, element: describe(e.element), url: e.url ? new URL(e.url).pathname.split('/').pop() : null, size: e.size };
    }
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__m.cls += e.value;
      window.__m.shifts.push({ time: e.startTime, value: e.value, sources: (e.sources ?? []).map((s) => describe(s.node)).filter(Boolean).slice(0, 3) });
    }
  }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__m.longTasks.push({ start: e.startTime, duration: e.duration });
  }).observe({ type: 'longtask', buffered: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (e.interactionId) window.__m.events.push({ id: e.interactionId, name: e.name, start: e.startTime, duration: e.duration, target: describe(e.target) });
    }
  }).observe({ type: 'event', durationThreshold: 16, buffered: true });
}

function collectLoad() {
  const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? -1;
  const tbt = window.__m.longTasks.filter((x) => x.start >= fcp).reduce((sum, x) => sum + Math.max(0, x.duration - 50), 0);
  const kind = (e) => {
    const path = new URL(e.name).pathname;
    if (path.startsWith('/api/')) return 'api';
    if (/\.(js|mjs)$/.test(path)) return 'js';
    if (path.endsWith('.css')) return 'css';
    if (/\.(woff2?|ttf)$/.test(path)) return 'font';
    if (/\.(png|jpe?g|webp|avif|svg|gif)$/.test(path)) return 'img';
    return 'other';
  };
  const requests = performance.getEntriesByType('resource').map((e) => ({
    kind: kind(e),
    path: new URL(e.name).pathname.replace(/^\/assets\//, ''),
    start: Math.round(e.startTime),
    end: Math.round(e.responseEnd),
    bytes: e.transferSize || e.encodedBodySize,
  }));
  return { fcp, lcp: window.__m.lcp, cls: window.__m.cls, shifts: window.__m.shifts, tbt, longTasks: window.__m.longTasks, requests };
}

// 측정 중 브라우저가 죽으면(메모리 · 크래시) 다시 띄워 다음 회차를 잇는다.
let browser = await puppeteer.launch({ headless: true });
async function ensureBrowser() {
  if (!browser.connected) browser = await puppeteer.launch({ headless: true });
}

async function openPage(c) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport(c.viewport);
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  if (MODE === 'load') {
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 60, downloadThroughput: 9e6 / 8, uploadThroughput: 1.5e6 / 8 });
  }
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.evaluateOnNewDocument(installObservers);
  return { ctx, page };
}

// 화면이 늦게 그려지는 경우(풀이 화면 로딩 등)가 있어 대상이 나타날 때까지 최대 30초 기다린다.
async function findTarget(page, action) {
  const selector = action.type ?? (action.isCss ? action.click : null);
  if (selector) {
    return page.waitForSelector(selector, { visible: true, timeout: 30000 }).catch(() => null);
  }
  const handle = await page
    .waitForFunction(
      (text) => {
        const candidates = [...document.querySelectorAll('button, a, [role=button], [role=tab], [role=combobox]')];
        return candidates.find((e) => (e.getAttribute('aria-label') || e.innerText || '').replace(/\s+/g, ' ').includes(text)) ?? null;
      },
      { timeout: 30000, polling: 200 },
      action.click,
    )
    .catch(() => null);
  return handle?.asElement() ?? null;
}

async function runActions(page, c) {
  const results = [];
  for (const action of c.actions) {
    const label = action.type ? `${action.type} 입력` : action.click;
    const target = await findTarget(page, action);
    if (!target) {
      results.push({ action: label, inp: null, note: '대상 없음' });
      continue;
    }
    // 설정 지연 이후의 상호작용만 센다. 16ms 미만은 Event Timing에 잡히지 않아 0으로 남는다.
    await new Promise((r) => setTimeout(r, 500));
    const before = await page.evaluate(() => performance.now());
    if (action.type) {
      await target.type(action.text, { delay: 120 });
    } else {
      await target.click();
    }
    await new Promise((r) => setTimeout(r, 2500));
    const events = await page.evaluate((from) => window.__m.events.filter((e) => e.start >= from), before).catch(() => []);
    const worst = events.sort((a, b) => b.duration - a.duration)[0];
    results.push({ action: label, inp: worst?.duration ?? 0, event: worst?.name ?? null, target: worst?.target ?? null });
  }
  return results;
}

async function measure(c) {
  await fetch(`${STUB}/__control?onboarded=${c.unonboarded ? 'false' : 'true'}&delay=${process.env.DELAY ?? 0}`);
  const { ctx, page } = await openPage(c);
  const gotoOptions = { waitUntil: 'load', timeout: 120000 };
  try {
    if (c.state) await openStateScreen(page, c, gotoOptions);
    else await page.goto(ORIGIN + c.path, gotoOptions);
    if (MODE === 'load') {
      await new Promise((r) => setTimeout(r, 12000));
      return await page.evaluate(collectLoad);
    }
    await page.waitForNetworkIdle({ idleTime: 1000, timeout: 60000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 2000));
    const interactions = await runActions(page, c);
    return { interactions, inp: Math.max(0, ...interactions.map((i) => i.inp ?? 0)) };
  } finally {
    await ctx.close();
  }
}

const results = {};
const file = `${OUT}/diagnose-${MODE}-${process.env.GROUP ?? ONLY?.join('+') ?? 'all'}.json`;
for (const c of cases) {
  results[c.key] = [];
  for (let i = 0; i < RUNS; i++) {
    await ensureBrowser();
    const r = await Promise.race([
      measure(c),
      new Promise((_, reject) => setTimeout(() => reject(new Error('3분 초과')), 180000)),
    ]).catch(async (error) => {
      if (error.message === '3분 초과') await browser.process()?.kill();
      return { error: error.message };
    });
    results[c.key].push(r);
    if (r.error) console.log(c.key, i + 1, 'ERROR', r.error);
    else if (MODE === 'load') console.log(c.key, i + 1, `fcp ${Math.round(r.fcp)}`, `lcp ${Math.round(r.lcp?.time ?? -1)}`, `cls ${r.cls.toFixed(3)}`, `tbt ${Math.round(r.tbt)}`, `| ${r.lcp?.element ?? '-'} ${r.lcp?.url ?? ''}`);
    else console.log(c.key, i + 1, `inp ${Math.round(r.inp)}`, r.interactions.map((x) => `${x.action}:${x.inp === null ? x.note : Math.round(x.inp)}`).join(' '));
  }
  writeFileSync(file, JSON.stringify(results, null, 2));
}
// 브라우저 종료가 멈춘 적이 있어(18:43~20:20) 10초 뒤 강제로 끝낸다.
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 10000))]);
process.exit(0);
