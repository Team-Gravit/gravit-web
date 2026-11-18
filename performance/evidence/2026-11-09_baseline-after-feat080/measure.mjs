// FEAT-080 이후 기준선: 화면별 FCP · LCP · CLS · TBT(근사)와 API 요청 순서를 잰다.
// 조건은 REF-054 · FIX-073 측정과 같다 — 캐시 끔 · Fast 4G 근사(9 Mbps · RTT 60ms) · CPU 4배 · 5회 중앙값.
// 로그인 상태는 hasSession 표시 + 스텁의 /auth/reissue로 만든다 (실제 새로고침과 같은 경로).
//
// node measure.mjs <puppeteer가 있는 node_modules 경로/> <출력 폴더> <포트>
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');

const OUT = process.argv[3];
const PORT = Number(process.argv[4] ?? 4192);
const RUNS = 5;
const MOBILE = { width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true };
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1 };
const CASES = [
  { id: 'login-mobile', path: '/', viewport: MOBILE, auth: false },
  { id: 'main-mobile', path: '/main', viewport: MOBILE, auth: true },
  { id: 'main-desktop', path: '/main', viewport: DESKTOP, auth: true },
  { id: 'learning-mobile', path: '/learning', viewport: MOBILE, auth: true },
  { id: 'league-mobile', path: '/league', viewport: MOBILE, auth: true },
  { id: 'my-mobile', path: '/my/summary', viewport: MOBILE, auth: true },
];

// CASES=main-mobile,learning-mobile 처럼 골라 잴 수 있다. 없으면 전부.
const ONLY = process.env.CASES?.split(',');
if (ONLY) CASES.splice(0, CASES.length, ...CASES.filter((c) => ONLY.includes(c.id)));

const browser = await puppeteer.launch({ headless: true });

async function measure(c) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport(c.viewport);
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 60,
    downloadThroughput: 9e6 / 8,
    uploadThroughput: 1.5e6 / 8,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.evaluateOnNewDocument((auth) => {
    if (auth) {
      localStorage.setItem('hasSession', '1');
    }
    window.__perf = { lcp: null, cls: 0, shifts: [], longTasks: [] };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        const el = e.element;
        const name = el
          ? el.tagName + (e.url ? ' ' + e.url.split('/').pop().replace(/-[\w-]{8}\./, '.') : '')
          : '?';
        window.__perf.lcp = { t: e.startTime, el: name };
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.hadRecentInput) continue;
        window.__perf.cls += e.value;
        const src = e.sources?.[0]?.node;
        window.__perf.shifts.push({
          t: Math.round(e.startTime),
          v: +e.value.toFixed(4),
          node: src ? `${src.nodeName}${src.className ? '.' + String(src.className).split(' ')[0] : ''}` : '?',
        });
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__perf.longTasks.push([e.startTime, e.duration]);
    }).observe({ type: 'longtask', buffered: true });
  }, c.auth);

  await page.goto(`http://localhost:${PORT}${c.path}`, { waitUntil: 'load', timeout: 120000 });
  await new Promise((r) => setTimeout(r, 12000));

  const result = await page.evaluate(() => {
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? -1;
    const api = performance
      .getEntriesByType('resource')
      .filter((r) => r.name.includes('/api/v1/'))
      .map((r) => ({
        path: new URL(r.name).pathname,
        start: Math.round(r.startTime),
        end: Math.round(r.responseEnd),
      }));
    const p = window.__perf;
    // TBT 근사: FCP 이후 긴 작업에서 50ms를 넘는 부분의 합
    const tbt = p.longTasks
      .filter(([s]) => s >= fcp)
      .reduce((sum, [, d]) => sum + Math.max(0, d - 50), 0);
    return {
      fcp,
      lcp: p.lcp?.t ?? -1,
      el: p.lcp?.el ?? 'none',
      cls: p.cls,
      shifts: p.shifts,
      tbt,
      api,
      finalPath: location.pathname,
    };
  });
  await ctx.close();
  return result;
}

const results = {};
for (const c of CASES) {
  results[c.id] = [];
  for (let i = 0; i < RUNS; i++) {
    const r = await measure(c);
    results[c.id].push(r);
    const reissue = r.api.find((a) => a.path.endsWith('/auth/reissue'));
    console.log(
      c.id,
      i + 1,
      `fcp ${Math.round(r.fcp)}`,
      `lcp ${Math.round(r.lcp)} ${r.el}`,
      `cls ${r.cls.toFixed(3)}`,
      `tbt ${Math.round(r.tbt)}`,
      reissue ? `reissue ${reissue.start}-${reissue.end}` : 'reissue -',
      r.finalPath,
    );
  }
  writeFileSync(`${OUT}/results.json`, JSON.stringify(results, null, 2));
}
await browser.close();

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};
console.log('\nSUMMARY (중앙값, ms)');
for (const c of CASES) {
  const rs = results[c.id];
  const reissueEnd = rs.map((r) => r.api.find((a) => a.path.endsWith('/auth/reissue'))?.end ?? 0);
  console.log(
    c.id,
    JSON.stringify({
      fcp: Math.round(median(rs.map((r) => r.fcp))),
      lcp: Math.round(median(rs.map((r) => r.lcp))),
      cls: +median(rs.map((r) => r.cls)).toFixed(3),
      tbt: Math.round(median(rs.map((r) => r.tbt))),
      reissueEnd: Math.round(median(reissueEnd)),
      el: rs.at(-1).el,
      finalPath: rs.at(-1).finalPath,
    }),
  );
}
