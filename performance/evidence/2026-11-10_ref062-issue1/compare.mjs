// 두 빌드를 번갈아 재서 비교한다. 같은 시간대에 번갈아 재야 PC 상태 차이가 양쪽에 똑같이 들어간다.
// 조건은 measure.mjs와 같다. TARGETS=base:4191,ref062:4192 CASES=... node compare.mjs <puppeteer node_modules/> <출력 폴더>
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');

const OUT = process.argv[3];
const RUNS = Number(process.env.RUNS ?? 5);
const TARGETS = (process.env.TARGETS ?? 'base:4191,ref062:4192').split(',').map((t) => t.split(':'));
const MOBILE = { width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true };
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1 };
const ALL_CASES = [
  { id: 'login-mobile', path: '/', viewport: MOBILE, auth: false },
  { id: 'main-mobile', path: '/main', viewport: MOBILE, auth: true },
  { id: 'main-desktop', path: '/main', viewport: DESKTOP, auth: true },
  { id: 'learning-mobile', path: '/learning', viewport: MOBILE, auth: true },
];
const ONLY = process.env.CASES?.split(',');
const CASES = ONLY ? ALL_CASES.filter((c) => ONLY.includes(c.id)) : ALL_CASES;

const browser = await puppeteer.launch({ headless: true });

async function measure(port, c) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport(c.viewport);
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 60, downloadThroughput: 9e6 / 8, uploadThroughput: 1.5e6 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.evaluateOnNewDocument((auth) => {
    if (auth) localStorage.setItem('hasSession', '1');
    window.__lcp = null;
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__lcp = e.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  }, c.auth);
  await page.goto(`http://localhost:${port}${c.path}`, { waitUntil: 'load', timeout: 120000 });
  await new Promise((r) => setTimeout(r, 12000));
  const r = await page.evaluate(() => ({
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? -1,
    lcp: window.__lcp ?? -1,
    cls: window.__cls,
    usersEnd: performance.getEntriesByType('resource').find((e) => new URL(e.name).pathname === '/api/v1/users')?.responseEnd ?? -1,
  }));
  await ctx.close();
  return r;
}

const results = {};
for (const c of CASES) {
  results[c.id] = Object.fromEntries(TARGETS.map(([k]) => [k, []]));
  for (let i = 0; i < RUNS; i++) {
    for (const [k, port] of TARGETS) {
      const r = await measure(port, c);
      results[c.id][k].push(r);
      console.log(c.id, i + 1, k, `fcp ${Math.round(r.fcp)}`, `lcp ${Math.round(r.lcp)}`, `cls ${r.cls.toFixed(3)}`, `users ${Math.round(r.usersEnd)}`);
    }
  }
  writeFileSync(`${OUT}/compare-results.json`, JSON.stringify(results, null, 2));
}
await browser.close();

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
console.log('\nSUMMARY (중앙값, ms)');
for (const c of CASES) {
  const row = Object.fromEntries(
    TARGETS.map(([k]) => [
      k,
      {
        fcp: Math.round(median(results[c.id][k].map((r) => r.fcp))),
        lcp: Math.round(median(results[c.id][k].map((r) => r.lcp))),
        cls: +median(results[c.id][k].map((r) => r.cls)).toFixed(3),
        usersEnd: Math.round(median(results[c.id][k].map((r) => r.usersEnd ?? -1))),
      },
    ]),
  );
  console.log(c.id, JSON.stringify(row));
}
