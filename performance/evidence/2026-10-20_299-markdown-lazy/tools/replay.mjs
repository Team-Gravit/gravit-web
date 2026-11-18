// 사용법: node replay.mjs <runs> <route...>
// 녹화한 API 응답을 고정 지연으로 돌려주고, DevTools와 같은 방식(CDP)으로 CPU 4x · Fast 4G 를 건다.
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const BUILDS = [
  { name: 'before', origin: 'http://localhost:5173' },
  { name: process.env.BUILD2 ?? 'after', origin: 'http://localhost:5174' },
  { name: process.env.BUILD3 ?? 'exp-loader', origin: 'http://localhost:5175' },
];
const [runsArg = '5', ...routeArgs] = process.argv.slice(2);
const RUNS = Number(runsArg);
const ROUTES = routeArgs.length ? routeArgs : ['/learning', '/main'];

// Chrome DevTools 「Fast 4G」 프리셋과 같은 값
const FAST_4G = { offline: false, latency: 165, downloadThroughput: 1_012_500, uploadThroughput: 168_750 };
const CPU_RATE = 4;

const { tokens, recordings } = JSON.parse(fs.readFileSync(new URL('./recordings.json', import.meta.url), 'utf8'));
const recordingByKey = new Map(Object.entries(recordings));

// 가로챈 요청은 네트워크 제한을 받지 않으므로 지연을 직접 넣는다: 왕복 지연 + 본문 크기 / 대역폭
function replayDelayMs(bodyBase64) {
  const bytes = Buffer.byteLength(bodyBase64, 'base64');
  return FAST_4G.latency + Math.round((bytes / FAST_4G.downloadThroughput) * 1000);
}

const OBSERVER_SCRIPT = `
  window.__perf = { lcp: [], fcp: null, cls: 0, longtasks: [], shifts: [] };
  new PerformanceObserver((list) => { for (const entry of list.getEntries()) window.__perf.longtasks.push([Math.round(entry.startTime), Math.round(entry.duration)]); }).observe({ type: 'longtask', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const element = entry.element;
      window.__perf.lcp.push({
        time: Math.round(entry.startTime),
        element: element ? (element.tagName.toLowerCase() + '.' + String(element.className).trim().split(/\\s+/).slice(0, 4).join('.')) : '?',
        url: entry.url ? entry.url.split('/').pop() : '(텍스트)',
      });
    }
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) if (entry.name === 'first-contentful-paint') window.__perf.fcp = Math.round(entry.startTime);
  }).observe({ type: 'paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) if (!entry.hadRecentInput) { window.__perf.cls += entry.value; window.__perf.shifts.push([Math.round(entry.startTime), Number(entry.value.toFixed(3))]); }
  }).observe({ type: 'layout-shift', buffered: true });
`;

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  userDataDir: new URL('./profile-replay', import.meta.url).pathname.slice(1),
  headless: 'new',
  // 녹화 응답을 다른 출처에서 돌려주므로 CORS 사전 요청이 실제 서버로 나가지 않게 한다. 측정 전용 프로필이다.
  args: ['--disable-web-security', '--no-first-run'],
});

async function measure(build, route) {
  const page = await browser.newPage();
  const cdp = await page.createCDPSession();
  await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', FAST_4G);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_RATE });
  await page.evaluateOnNewDocument(
    (accessToken, refreshToken) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },
    tokens.accessToken,
    tokens.refreshToken,
  );
  await page.evaluateOnNewDocument(OBSERVER_SCRIPT);

  const misses = [];
  await cdp.send('Fetch.enable', {
    patterns: [{ urlPattern: '*/api/v*' }, { urlPattern: '*jsdelivr.net*' }],
  });
  cdp.on('Fetch.requestPaused', async ({ requestId, request }) => {
    const recording = recordingByKey.get(`${request.method} ${request.url}`);
    if (!recording) {
      misses.push(`${request.method} ${request.url.replace(/https?:\/\/[^/]+/, '')}`);
      await cdp.send('Fetch.fulfillRequest', { requestId, responseCode: 404, body: '' }).catch(() => {});
      return;
    }
    const headers = Object.entries(recording.headers)
      .filter(([name]) => !['content-encoding', 'content-length', 'transfer-encoding'].includes(name))
      // 여러 값이 줄바꿈으로 합쳐진 헤더(vary 등)는 CDP가 거부한다. 출처 헤더는 요청한 포트에 맞춘다.
      .map(([name, value]) => ({
        name,
        value: name === 'access-control-allow-origin' ? (request.headers.Origin ?? String(value)) : String(value).replaceAll('\n', ', '),
      }));
    setTimeout(() => {
      cdp
        .send('Fetch.fulfillRequest', { requestId, responseCode: recording.status, responseHeaders: headers, body: recording.body })
        .catch((error) => misses.push(`fulfill 실패 ${request.url.split('/').pop()}: ${error.message}`));
    }, replayDelayMs(recording.body));
  });

  await page.goto(`${build.origin}${route}`, { waitUntil: 'networkidle0', timeout: 90000 });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const result = await page.evaluate(() => {
    const resources = performance
      .getEntriesByType('resource')
      .filter((entry) => /\/api\/v1\/(chapters|main-pages\/learning|users|cs-notes\/.*)$|hero-|planet-01|card-background|markdown-|concept-note/.test(entry.name))
      .map((entry) => `${entry.name.split('/').pop()} ${Math.round(entry.startTime)}→${Math.round(entry.responseEnd)}`);
    const last = window.__perf.lcp.at(-1) ?? {};
    return {
      path: location.pathname,
      entry: [...document.scripts].map((script) => script.src.match(/index-[^/]+\.js/)?.[0]).find(Boolean),
      lcp: last.time,
      lcpElement: `${last.element} ${last.url}`,
      fcp: window.__perf.fcp,
      cls: Number(window.__perf.cls.toFixed(3)),
      resources,
      lcpCandidates: window.__perf.lcp.map((candidate) => `${candidate.time} ${candidate.element}`),
      longtasksAfter4s: window.__perf.longtasks.filter(([start]) => start > 4000),
      shifts: window.__perf.shifts,
    };
  });
  await page.close();
  return { ...result, misses };
}

const results = {};
try {
  for (const route of ROUTES) {
    for (let run = 1; run <= RUNS; run += 1) {
      for (const build of BUILDS) {
        const metrics = await measure(build, route);
        if (metrics.path !== route) throw new Error(`${build.name} ${route} #${run}: ${metrics.path} 를 측정했다`);
        (results[`${route} ${build.name}`] ??= []).push(metrics);
        console.log(`${route} ${build.name} #${run}`, JSON.stringify(metrics));
      }
    }
  }
} finally {
  await browser.close();
  // 실행마다 따로 남긴다. 같은 파일을 덮어쓰면 이전 측정 원본이 사라진다.
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const routeSlug = ROUTES.map((route) => route.replaceAll('/', '_')).join('+');
  fs.mkdirSync(new URL('./replay-runs/', import.meta.url), { recursive: true });
  fs.writeFileSync(new URL(`./replay-runs/${stamp}${routeSlug}_${BUILDS.map((build) => build.name).join('-')}.json`, import.meta.url), JSON.stringify(results, null, 2));
}

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
for (const [key, rows] of Object.entries(results)) {
  console.log(`MEDIAN ${key}`, JSON.stringify({ lcp: median(rows.map((row) => row.lcp)), fcp: median(rows.map((row) => row.fcp)), cls: median(rows.map((row) => row.cls)) }));
}




