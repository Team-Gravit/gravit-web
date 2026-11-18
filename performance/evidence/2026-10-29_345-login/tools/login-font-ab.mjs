// 로그인 화면(/) 글꼴 A/B — Lighthouse DevTools 제한과 같은 조건으로 번갈아 측정
// RTT 562.5ms · 1.47Mbps · CPU 4x (Lighthouse devtools throttling 값)
import { createRequire } from 'node:module';
const require = createRequire('C:/tmp/gfont-tool/');
const puppeteer = require('puppeteer-core');

const BUILDS = { base: 'http://localhost:4173/', nofont: 'http://localhost:4174/' };
const ROUNDS = Number(process.argv[2] ?? 5);
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});

async function measure(url) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 562.5,
    downloadThroughput: (1474.56 * 1024) / 8,
    uploadThroughput: (675 * 1024) / 8,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  const requests = new Map();
  let navStart = 0;
  cdp.on('Network.requestWillBeSent', (e) => {
    if (!navStart) navStart = e.timestamp;
    requests.set(e.requestId, { url: e.request.url, start: e.timestamp });
  });
  cdp.on('Network.loadingFinished', (e) => {
    const r = requests.get(e.requestId);
    if (r) Object.assign(r, { end: e.timestamp, bytes: e.encodedDataLength });
  });

  await page.evaluateOnNewDocument(() => {
    window.__lcp = 0;
    window.__lcpEl = '';
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__lcp = entry.startTime;
        window.__lcpEl = entry.element ? entry.element.tagName + ':' + (entry.element.textContent || '').slice(0, 20) : '';
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });
  await new Promise((r) => setTimeout(r, 1500));
  const result = await page.evaluate(() => {
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0;
    return { fcp, lcp: window.__lcp, lcpEl: window.__lcpEl, font: document.fonts.check('16px Pretendard') };
  });
  const rel = (t) => Math.round((t - navStart) * 1000);
  const pick = (re) => [...requests.values()].find((r) => re.test(r.url));
  const font = pick(/Pretendard.*\.woff2/);
  const entry = pick(/\/assets\/index-[^/]+\.js$/);
  await context.close();
  return {
    fcp: Math.round(result.fcp),
    lcp: Math.round(result.lcp),
    lcpEl: result.lcpEl,
    entryJs: entry ? `${rel(entry.start)}→${rel(entry.end)}` : '-',
    font: font ? `${rel(font.start)}→${rel(font.end)}` : '-',
  };
}

const rows = [];
for (let i = 1; i <= ROUNDS; i++) {
  for (const [name, url] of Object.entries(BUILDS)) {
    const r = await measure(url);
    rows.push({ round: i, build: name, ...r });
    console.log(JSON.stringify(rows.at(-1)));
  }
}
await browser.close();

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};
for (const name of Object.keys(BUILDS)) {
  const mine = rows.filter((r) => r.build === name);
  console.log(name, 'FCP 중앙값', median(mine.map((r) => r.fcp)), 'LCP 중앙값', median(mine.map((r) => r.lcp)));
}
