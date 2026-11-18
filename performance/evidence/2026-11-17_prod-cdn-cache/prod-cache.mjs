// 배포본(gravit.inuappcenter.kr)에서 처음 열기(cold)와 다시 열기(warm)를 비교한다.
//   - HTML · JS · 이미지는 실제 Cloudflare를 거친다. 로그인이 필요한 API만 CDP Fetch로 스텁 응답을 준다
//     (puppeteer setRequestInterception은 캐시를 끄므로 쓰지 않는다)
//   - warm: 같은 userDataDir로 브라우저를 다시 띄운다. 메모리 캐시는 비고 디스크 캐시만 남는다 → 앱을 다시 여는 상황
//   - CPU 4배 감속 · 네트워크 제한 없음(실제 회선) · 모바일 412×915 DPR 2.625
// node prod-cache.mjs <puppeteer node_modules/> <출력 폴더>   (SCREENS=main,learning,league · RUNS=7 · STUB=http://localhost:4199)
import { createRequire } from 'node:module';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');
const OUT = process.argv[3] ?? 'results';
const RUNS = Number(process.env.RUNS ?? 7);
const STUB = process.env.STUB ?? 'http://localhost:4199';
const SCREENS = (process.env.SCREENS ?? 'main,learning,league').split(',');
const ORIGIN = 'https://gravit.inuappcenter.kr';
const API_HOST = 'grav-it.inuappcenter.kr';
const MOBILE = { width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true };
const SETTLE_MS = 5000;

mkdirSync(OUT, { recursive: true });

async function stubApi(page) {
  const cdp = await page.createCDPSession();
  await cdp.send('Fetch.enable', { patterns: [{ urlPattern: `https://${API_HOST}/*`, requestStage: 'Request' }] });
  cdp.on('Fetch.requestPaused', async ({ requestId, request }) => {
    const path = new URL(request.url).pathname;
    const cors = [
      { name: 'access-control-allow-origin', value: ORIGIN },
      { name: 'access-control-allow-credentials', value: 'true' },
      { name: 'access-control-allow-headers', value: 'authorization, content-type' },
      { name: 'access-control-allow-methods', value: 'GET, POST, PATCH, DELETE, OPTIONS' },
    ];
    try {
      if (request.method === 'OPTIONS') {
        await cdp.send('Fetch.fulfillRequest', { requestId, responseCode: 204, responseHeaders: cors });
        return;
      }
      const res = await fetch(`${STUB}${path}`, { method: request.method === 'GET' ? 'GET' : 'POST' });
      const body = Buffer.from(await res.arrayBuffer()).toString('base64');
      await cdp.send('Fetch.fulfillRequest', {
        requestId,
        responseCode: res.status,
        responseHeaders: [...cors, { name: 'content-type', value: res.headers.get('content-type') ?? 'application/json' }],
        body,
      });
    } catch (error) {
      console.error('stub 실패', path, error.message);
      await cdp.send('Fetch.failRequest', { requestId, errorReason: 'Failed' }).catch(() => {});
    }
  });
  return cdp;
}

function collect() {
  const nav = performance.getEntriesByType('navigation')[0];
  const resources = performance.getEntriesByType('resource').map((r) => ({
    name: r.name.replace(location.origin, ''),
    type: r.initiatorType,
    start: Math.round(r.startTime),
    end: Math.round(r.responseEnd),
    transfer: r.transferSize,
    delivery: r.deliveryType ?? '',
    status: r.responseStatus ?? 0,
  }));
  return {
    url: location.pathname,
    html: { requestStart: Math.round(nav.requestStart), responseStart: Math.round(nav.responseStart), responseEnd: Math.round(nav.responseEnd), transfer: nav.transferSize },
    dcl: Math.round(nav.domContentLoadedEventEnd),
    load: Math.round(nav.loadEventEnd),
    lcp: window.__lcp,
    resources,
  };
}

async function openOnce(userDataDir, path) {
  const browser = await puppeteer.launch({ headless: true, userDataDir, args: ['--no-first-run'] });
  try {
    const page = await browser.newPage();
    await page.setViewport(MOBILE);
    await page.emulateCPUThrottling(4);
    await stubApi(page);
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('hasSession', '1');
      window.__lcp = null;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          window.__lcp = { time: Math.round(e.startTime), url: e.url ? new URL(e.url).pathname.split('/').pop() : null, tag: e.element?.tagName?.toLowerCase() ?? null };
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    await page.goto(`${ORIGIN}${path}`, { waitUntil: 'load', timeout: 60000 });
    await new Promise((r) => setTimeout(r, SETTLE_MS));
    return await page.evaluate(collect);
  } finally {
    await browser.close();
  }
}

const results = [];
for (const id of SCREENS) {
  const path = `/${id}`;
  for (let run = 1; run <= RUNS; run += 1) {
    const dir = mkdtempSync(join(tmpdir(), 'prod-cache-'));
    try {
      const cold = await openOnce(dir, path);
      const warm = await openOnce(dir, path);
      results.push({ screen: id, run, cold, warm });
      const fmt = (m) => `html ${m.html.responseEnd}ms · lcp ${m.lcp?.time ?? '-'}ms(${m.lcp?.url ?? m.lcp?.tag ?? '-'}) · 도착 ${m.url}`;
      console.log(`${id} #${run}  cold: ${fmt(cold)}  |  warm: ${fmt(warm)}`);
    } catch (error) {
      console.log(`${id} #${run} ERROR ${error.message}`);
      results.push({ screen: id, run, error: error.message });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
}
writeFileSync(join(OUT, 'prod-cache.json'), JSON.stringify(results, null, 2));
console.log('saved', join(OUT, 'prod-cache.json'));
