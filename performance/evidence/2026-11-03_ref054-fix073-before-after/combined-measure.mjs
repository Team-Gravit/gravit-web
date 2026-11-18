// REF-054 + FIX-073 합산 전후 측정: 기준(523cbc27) · 변경(develop) · 변경(다른 포트)을 번갈아 5회.
// 화면별 LCP · LCP 요소 · 이미지 전송량(바이트) · 이미지 요청 수를 잰다.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire('C:/tmp/gfont-tool/');
const puppeteer = require('puppeteer-core');

const OUT = process.argv[2];
const RUNS = 5;
const TARGETS = [['base', 4191], ['now', 4192], ['now2', 4193]];
const MOBILE = { width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true };
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1 };
const CASES = [
  { id: 'login-desktop', path: '/', viewport: DESKTOP, auth: false },
  { id: 'login-mobile', path: '/', viewport: MOBILE, auth: false },
  { id: 'main-mobile', path: '/main', viewport: MOBILE, auth: true },
  { id: 'learning-mobile', path: '/learning', viewport: MOBILE, auth: true },
  { id: 'league-mobile', path: '/league', viewport: MOBILE, auth: true },
  { id: 'league-desktop', path: '/league', viewport: DESKTOP, auth: true },
  { id: 'my-mobile', path: '/my/summary', viewport: MOBILE, auth: true },
];

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });

async function measure(port, c) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport(c.viewport);
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  // Fast 4G 근사: 9 Mbps · RTT 60ms, CPU 4배 (REF-054 · FIX-073과 같은 조건)
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 60, downloadThroughput: 9e6 / 8, uploadThroughput: 1.5e6 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const images = new Map();
  cdp.on('Network.responseReceived', (e) => { if (e.type === 'Image') images.set(e.requestId, { url: e.response.url, bytes: 0 }); });
  cdp.on('Network.loadingFinished', (e) => { const img = images.get(e.requestId); if (img) img.bytes = e.encodedDataLength; });
  await page.evaluateOnNewDocument((auth) => {
    if (auth) { localStorage.setItem('accessToken', 'mock'); localStorage.setItem('refreshToken', 'mock'); }
    window.__lcp = null;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        const el = e.element;
        window.__lcp = { t: e.startTime, size: e.size, el: el ? el.tagName + (e.url ? ' ' + e.url.split('/').pop().replace(/-[\w-]{8}\./, '.') : '') : '?' };
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  }, c.auth);
  await page.goto(`http://localhost:${port}${c.path}`, { waitUntil: 'load', timeout: 120000 });
  await new Promise((r) => setTimeout(r, 12000));
  const lcp = await page.evaluate(() => window.__lcp);
  const list = [...images.values()].filter((i) => !i.url.startsWith('data:'));
  await ctx.close();
  return { lcp: lcp?.t ?? -1, el: lcp?.el ?? 'none', imgBytes: list.reduce((s, i) => s + i.bytes, 0), imgCount: list.length };
}

const results = {};
for (const c of CASES) {
  results[c.id] = Object.fromEntries(TARGETS.map(([k]) => [k, []]));
  for (let i = 0; i < RUNS; i++) {
    for (const [k, port] of TARGETS) {
      const r = await measure(port, c);
      results[c.id][k].push(r);
      console.log(c.id, i + 1, k, Math.round(r.lcp), r.el, `${(r.imgBytes / 1024).toFixed(1)}KB`, r.imgCount);
    }
  }
  writeFileSync(`${OUT}/combined-results.json`, JSON.stringify(results, null, 2));
}
await browser.close();

const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
console.log('\nSUMMARY');
for (const c of CASES) {
  const row = Object.fromEntries(TARGETS.map(([k]) => [k, {
    lcp: Math.round(median(results[c.id][k].map((r) => r.lcp))),
    kb: +(median(results[c.id][k].map((r) => r.imgBytes)) / 1024).toFixed(1),
    n: median(results[c.id][k].map((r) => r.imgCount)),
    el: results[c.id][k].at(-1).el,
  }]));
  const jitter = Math.abs(row.now.lcp - row.now2.lcp);
  console.log(c.id, JSON.stringify(row), 'jitter', jitter, row.now.lcp <= row.base.lcp + jitter ? 'PASS' : 'OVER');
}
