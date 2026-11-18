// 사용법: node font-replay.mjs <runs> <route...>
// #299 replay.mjs 기반. API · MBC 글꼴은 녹화 응답, Pretendard는 실제 네트워크(CDP 제한 적용)로 받는다.
// REF-063: base = develop(4fb2c6b5), quiz = 커밋 1, quiz-icons = 커밋 1+2.
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const BUILDS = [
  { name: 'base', origin: 'http://localhost:5174' },
  { name: 'quiz', origin: 'http://localhost:5175' },
  { name: 'quiz-icons', origin: 'http://localhost:5176' },
  // 같은 최종 빌드를 다른 포트에 한 번 더 — 측정 흔들림 기준
  { name: 'quiz-icons-repeat', origin: 'http://localhost:5177' },
];
const [runsArg = '5', ...routeArgs] = process.argv.slice(2);
const RUNS = Number(runsArg);
const ROUTES = routeArgs.length ? routeArgs : ['/main', '/learning', '/learning/units/11/concept-note'];

const FAST_4G = { offline: false, latency: 165, downloadThroughput: 1_012_500, uploadThroughput: 168_750 };
const CPU_RATE = 4;

const { tokens, recordings } = JSON.parse(fs.readFileSync(new URL('./recordings.json', import.meta.url), 'utf8'));
const recordingByKey = new Map(Object.entries(recordings));
const isPretendard = (url) => /pretendard/i.test(url);

function replayDelayMs(bodyBase64) {
  const bytes = Buffer.byteLength(bodyBase64, 'base64');
  return FAST_4G.latency + Math.round((bytes / FAST_4G.downloadThroughput) * 1000);
}

const OBSERVER_SCRIPT = `
  window.__perf = { lcp: [], fcp: null, cls: 0, shifts: [], fontsReady: null };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const element = entry.element;
      window.__perf.lcp.push({ time: Math.round(entry.startTime), element: element ? element.tagName.toLowerCase() : '?', url: entry.url ? entry.url.split('/').pop() : '(텍스트)' });
    }
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) if (entry.name === 'first-contentful-paint') window.__perf.fcp = Math.round(entry.startTime);
  }).observe({ type: 'paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) if (!entry.hadRecentInput) { window.__perf.cls += entry.value; window.__perf.shifts.push([Math.round(entry.startTime), Number(entry.value.toFixed(3))]); }
  }).observe({ type: 'layout-shift', buffered: true });
  // Pretendard 면이 하나라도 loaded 가 된 시각 = 글꼴이 바뀌어 그려지기 시작한 시점
  document.addEventListener('DOMContentLoaded', () => {
    document.fonts.addEventListener('loadingdone', (event) => {
      if (window.__perf.pretendardLoaded == null && event.fontfaces.some((face) => /pretendard/i.test(face.family))) window.__perf.pretendardLoaded = Math.round(performance.now());
    });
  });
`;

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  userDataDir: new URL('./profile-replay', import.meta.url).pathname.slice(1),
  headless: 'new',
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

  // Pretendard 요청을 CDP 기준으로 센다 (cross-origin 이라 Resource Timing 크기가 0일 수 있다)
  const fontRequests = new Map();
  let startTimestamp = null;
  cdp.on('Network.requestWillBeSent', ({ requestId, request, timestamp, type }) => {
    if (type === 'Document' && startTimestamp == null) startTimestamp = timestamp;
    if (isPretendard(request.url)) fontRequests.set(requestId, { url: request.url, start: timestamp });
  });
  cdp.on('Network.loadingFinished', ({ requestId, timestamp, encodedDataLength }) => {
    const entry = fontRequests.get(requestId);
    if (entry) Object.assign(entry, { end: timestamp, bytes: encodedDataLength });
  });
  cdp.on('Network.loadingFailed', ({ requestId, errorText }) => {
    const entry = fontRequests.get(requestId);
    if (entry) entry.error = errorText;
  });

  const misses = [];
  await cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*/api/v*' }, { urlPattern: '*jsdelivr.net*' }] });
  cdp.on('Fetch.requestPaused', async ({ requestId, request }) => {
    if (isPretendard(request.url)) {
      await cdp.send('Fetch.continueRequest', { requestId }).catch(() => {});
      return;
    }
    const recording = recordingByKey.get(`${request.method} ${request.url}`);
    if (!recording) {
      misses.push(`${request.method} ${request.url.replace(/https?:\/\/[^/]+/, '')}`);
      await cdp.send('Fetch.fulfillRequest', { requestId, responseCode: 404, body: '' }).catch(() => {});
      return;
    }
    const headers = Object.entries(recording.headers)
      .filter(([name]) => !['content-encoding', 'content-length', 'transfer-encoding'].includes(name))
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

  const result = await page.evaluate(async () => {
    await document.fonts.ready;
    const last = window.__perf.lcp.at(-1) ?? {};
    const faces = [...document.fonts].filter((face) => /pretendard/i.test(face.family));
    // 한글이 들어 있는 첫 텍스트 요소를 실제 렌더 글꼴 확인용으로 표시한다
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let probe = null;
    while (walker.nextNode()) {
      const parent = walker.currentNode.parentElement;
      if (/[가-힣]{2,}/.test(walker.currentNode.textContent) && parent?.checkVisibility() && parent.getBoundingClientRect().top < innerHeight) {
        probe = walker.currentNode.parentElement;
        break;
      }
    }
    probe?.setAttribute('data-font-probe', '');
    return {
      path: location.pathname,
      lcp: last.time,
      lcpElement: `${last.element} ${last.url}`,
      fcp: window.__perf.fcp,
      cls: Number(window.__perf.cls.toFixed(3)),
      pretendardLoaded: window.__perf.pretendardLoaded ?? null,
      facesTotal: faces.length,
      facesLoaded: faces.filter((face) => face.status === 'loaded').length,
      facesError: faces.filter((face) => face.status === 'error').length,
      probeText: probe?.textContent.trim().slice(0, 20) ?? null,
      probeFamily: probe ? getComputedStyle(probe).fontFamily.split(',')[0] : null,
    };
  });

  let platformFonts = null;
  const { root } = await cdp.send('DOM.getDocument', { depth: 0 });
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '[data-font-probe]' });
  if (nodeId) {
    await cdp.send('CSS.enable');
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
    platformFonts = fonts.map((font) => `${font.familyName}×${font.glyphCount}`).join(', ');
  }

  const fonts = [...fontRequests.values()];
  const ms = (timestamp) => Math.round((timestamp - startTimestamp) * 1000);
  const font = {
    requests: fonts.length,
    bytes: fonts.reduce((sum, entry) => sum + (entry.bytes ?? 0), 0),
    lastEnd: fonts.length ? Math.max(...fonts.filter((entry) => entry.end).map((entry) => ms(entry.end))) : null,
    cssEnd: fonts.find((entry) => entry.url.endsWith('.css'))?.end ? ms(fonts.find((entry) => entry.url.endsWith('.css')).end) : null,
    errors: fonts.filter((entry) => entry.error).map((entry) => `${entry.url.split('/').pop()} ${entry.error}`),
  };
  await page.close();
  return { ...result, platformFonts, font, misses };
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
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.mkdirSync(new URL('./runs/', import.meta.url), { recursive: true });
  fs.writeFileSync(new URL(`./runs/${stamp}_ref063.json`, import.meta.url), JSON.stringify(results, null, 2));
}

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
for (const [key, rows] of Object.entries(results)) {
  console.log(
    `MEDIAN ${key}`,
    JSON.stringify({
      lcp: median(rows.map((row) => row.lcp)),
      fcp: median(rows.map((row) => row.fcp)),
      cls: median(rows.map((row) => row.cls)),
      pretendardLoaded: median(rows.map((row) => row.pretendardLoaded ?? -1)),
      fontLastEnd: median(rows.map((row) => row.font.lastEnd ?? -1)),
      fontBytes: median(rows.map((row) => row.font.bytes)),
      fontRequests: median(rows.map((row) => row.font.requests)),
    }),
  );
}
